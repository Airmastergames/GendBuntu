import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private auditService: AuditService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { unite: true },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isActive) {
        throw new UnauthorizedException('Compte désactivé');
      }
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Mise à jour dernière connexion
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Génération tokens
    const tokens = await this.generateTokens(user);

    // Audit log
    await this.auditService.log({
      userId: user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
    });

    return tokens;
  }

  async register(registerDto: RegisterDto) {
    // Vérification unicité email et RIO
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerDto.email },
          { rio: registerDto.rio },
          { numeroService: registerDto.numeroService },
        ],
      },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email, RIO ou numéro de service déjà utilisé');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      parseInt(this.config.get<string>('BCRYPT_ROUNDS') || '10'),
    );

    // Création utilisateur
    const user = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: hashedPassword,
      },
      include: { unite: true },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });

      const token = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: { include: { unite: true } } },
      });

      if (!token || token.expiresAt < new Date()) {
        throw new UnauthorizedException('Token invalide ou expiré');
      }

      const user = token.user;
      if (!user.isActive) {
        throw new UnauthorizedException('Compte désactivé');
      }

      // Génération nouveaux tokens
      const tokens = await this.generateTokens(user);

      // Suppression ancien token
      await this.prisma.refreshToken.delete({
        where: { id: token.id },
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Token invalide');
    }
  }

  private async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRATION') || '7d',
    });

    // Sauvegarde refresh token
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(
          Date.now() +
            (parseInt(this.config.get<string>('JWT_REFRESH_EXPIRATION')?.replace('d', '') || '7') *
              24 *
              60 *
              60 *
              1000),
        ),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        grade: user.grade,
        role: user.role,
        unite: user.unite,
      },
    };
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }
}
