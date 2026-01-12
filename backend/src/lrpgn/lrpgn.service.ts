import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePVEDto } from './dto/create-pve.dto';

@Injectable()
export class LrpgnService {
  constructor(private prisma: PrismaService) {}

  async generateNumeroPVE(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.pVE.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    });

    const numero = String(count + 1).padStart(6, '0');
    return `PVE-${year}-${numero}`;
  }

  async createPVE(dto: CreatePVEDto, userId: string) {
    const numeroPVE = await this.generateNumeroPVE();

    return this.prisma.pVE.create({
      data: {
        ...dto,
        numeroPVE,
        createdById: userId,
      },
      include: {
        createdBy: true,
        pv: {
          include: {
            createdBy: true,
            service: true,
          },
        },
      },
    });
  }

  async getPVEs(filters?: {
    createdById?: string;
    statut?: string;
    pvId?: string;
  }) {
    return this.prisma.pVE.findMany({
      where: {
        ...(filters?.createdById && { createdById: filters.createdById }),
        ...(filters?.statut && { statut: filters.statut as any }),
        ...(filters?.pvId && { pvId: filters.pvId }),
      },
      include: {
        createdBy: true,
        pv: {
          include: {
            createdBy: true,
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPVE(id: string) {
    const pve = await this.prisma.pVE.findUnique({
      where: { id },
      include: {
        createdBy: true,
        pv: {
          include: {
            createdBy: true,
            service: true,
            validatedBy: true,
          },
        },
      },
    });

    if (!pve) {
      throw new NotFoundException('PVE introuvable');
    }

    return pve;
  }

  async updatePVEStatus(id: string, statut: string) {
    return this.prisma.pVE.update({
      where: { id },
      data: { statut: statut as any },
      include: {
        createdBy: true,
        pv: true,
      },
    });
  }

  async linkPVEToPV(pveId: string, pvId: string) {
    return this.prisma.pVE.update({
      where: { id: pveId },
      data: { pvId },
      include: {
        createdBy: true,
        pv: true,
      },
    });
  }
}
