import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { CreatePVDto } from './dto/create-pv.dto';

@Injectable()
export class PulsarService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // PLANNING & SERVICES
  // ============================================

  async createPlanning(dto: CreatePlanningDto, userId: string) {
    return this.prisma.planningService.create({
      data: {
        ...dto,
        createdById: userId,
      },
      include: {
        unite: true,
        createdBy: true,
        participants: {
          include: { user: true },
        },
      },
    });
  }

  async getPlannings(filters?: {
    uniteId?: string;
    dateDebut?: Date;
    dateFin?: Date;
    statut?: string;
  }) {
    return this.prisma.planningService.findMany({
      where: {
        ...(filters?.uniteId && { uniteId: filters.uniteId }),
        ...(filters?.dateDebut &&
          filters?.dateFin && {
            dateDebut: {
              gte: filters.dateDebut,
              lte: filters.dateFin,
            },
          }),
        ...(filters?.statut && { statut: filters.statut as any }),
      },
      include: {
        unite: true,
        createdBy: true,
        participants: {
          include: { user: true },
        },
      },
      orderBy: { dateDebut: 'asc' },
    });
  }

  async getPlanning(id: string) {
    const planning = await this.prisma.planningService.findUnique({
      where: { id },
      include: {
        unite: true,
        createdBy: true,
        participants: {
          include: { user: true },
        },
        pvs: true,
      },
    });

    if (!planning) {
      throw new NotFoundException('Planning introuvable');
    }

    return planning;
  }

  async addParticipant(serviceId: string, userId: string, role?: string) {
    return this.prisma.planningParticipant.create({
      data: {
        serviceId,
        userId,
        role,
      },
      include: { user: true },
    });
  }

  // ============================================
  // REGISTRE PV
  // ============================================

  async generateNumeroPV(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.pV.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    });

    const numero = String(count + 1).padStart(6, '0');
    return `PV-${year}-${numero}`;
  }

  async createPV(dto: CreatePVDto, userId: string) {
    const numeroPV = await this.generateNumeroPV();

    return this.prisma.pV.create({
      data: {
        ...dto,
        numeroPV,
        createdById: userId,
      },
      include: {
        createdBy: true,
        service: true,
      },
    });
  }

  async getPVs(filters?: {
    createdById?: string;
    serviceId?: string;
    statut?: string;
    dateDebut?: Date;
    dateFin?: Date;
  }) {
    return this.prisma.pV.findMany({
      where: {
        ...(filters?.createdById && { createdById: filters.createdById }),
        ...(filters?.serviceId && { serviceId: filters.serviceId }),
        ...(filters?.statut && { statut: filters.statut as any }),
        ...(filters?.dateDebut &&
          filters?.dateFin && {
            dateInfraction: {
              gte: filters.dateDebut,
              lte: filters.dateFin,
            },
          }),
      },
      include: {
        createdBy: true,
        service: true,
        validatedBy: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPV(id: string) {
    const pv = await this.prisma.pV.findUnique({
      where: { id },
      include: {
        createdBy: true,
        service: true,
        validatedBy: true,
        pve: true,
      },
    });

    if (!pv) {
      throw new NotFoundException('PV introuvable');
    }

    return pv;
  }

  async validatePV(id: string, validatorId: string) {
    return this.prisma.pV.update({
      where: { id },
      data: {
        statut: 'VALIDE',
        validatedById: validatorId,
        validatedAt: new Date(),
      },
      include: {
        createdBy: true,
        validatedBy: true,
      },
    });
  }
}
