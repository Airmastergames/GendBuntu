import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Grade } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  // Utilisateurs
  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        unite: true,
      },
      orderBy: [
        { nom: 'asc' },
        { prenom: 'asc' },
      ],
    });
  }

  async updateUser(id: string, data: {
    role?: Role;
    isActive?: boolean;
    grade?: Grade;
    uniteId?: string;
  }) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { unite: true },
    });
  }

  async resetPassword(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(this.config.get<string>('BCRYPT_ROUNDS') || '10'),
    );

    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  // Unités
  async createUnite(data: {
    code: string;
    nom: string;
    type: string;
    adresse?: string;
    telephone?: string;
    email?: string;
    responsableId?: string;
  }) {
    return this.prisma.unite.create({
      data,
      include: {
        _count: {
          select: { users: true },
        },
      },
    });
  }

  async updateUnite(id: string, data: {
    nom?: string;
    type?: string;
    adresse?: string;
    telephone?: string;
    email?: string;
    responsableId?: string;
    isActive?: boolean;
  }) {
    return this.prisma.unite.update({
      where: { id },
      data,
    });
  }

  // Statistiques
  async getStats() {
    const [
      totalUsers,
      activeUsers,
      totalUnites,
      totalInterventions,
      totalPVs,
      totalIncidents,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.unite.count({ where: { isActive: true } }),
      this.prisma.intervention.count(),
      this.prisma.pV.count(),
      this.prisma.incident.count(),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      unites: {
        total: totalUnites,
      },
      interventions: {
        total: totalInterventions,
      },
      pvs: {
        total: totalPVs,
      },
      incidents: {
        total: totalIncidents,
      },
    };
  }

  async getLogs(filters?: {
    userId?: string;
    action?: string;
    entity?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.action && { action: filters.action as any }),
        ...(filters?.entity && { entity: filters.entity }),
        ...(filters?.startDate &&
          filters?.endDate && {
            createdAt: {
              gte: filters.startDate,
              lte: filters.endDate,
            },
          }),
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });
  }
}
