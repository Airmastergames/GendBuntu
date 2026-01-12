import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class BdspService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async generateNumeroIntervention(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.intervention.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    });

    const numero = String(count + 1).padStart(6, '0');
    return `INT-${year}-${numero}`;
  }

  async createIntervention(dto: CreateInterventionDto, userId: string) {
    const numeroIntervention = await this.generateNumeroIntervention();

    const intervention = await this.prisma.intervention.create({
      data: {
        ...dto,
        numeroIntervention,
        createdById: userId,
      },
      include: {
        createdBy: true,
        uniteAssigned: true,
        assignedTo: true,
      },
    });

    // Journal
    await this.prisma.journalIntervention.create({
      data: {
        interventionId: intervention.id,
        userId,
        action: `Intervention créée: ${intervention.titre}`,
      },
    });

    // Audit
    await this.auditService.log({
      userId,
      action: 'CREATE',
      entity: 'Intervention',
      entityId: intervention.id,
    });

    return intervention;
  }

  async getInterventions(filters?: {
    statut?: string;
    priorite?: string;
    createdById?: string;
    uniteAssignedId?: string;
  }) {
    return this.prisma.intervention.findMany({
      where: {
        ...(filters?.statut && { statut: filters.statut as any }),
        ...(filters?.priorite && { priorite: filters.priorite as any }),
        ...(filters?.createdById && { createdById: filters.createdById }),
        ...(filters?.uniteAssignedId && { uniteAssignedId: filters.uniteAssignedId }),
      },
      include: {
        createdBy: true,
        uniteAssigned: true,
        assignedTo: true,
        _count: {
          select: { journal: true },
        },
      },
      orderBy: [
        { priorite: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async getIntervention(id: string) {
    const intervention = await this.prisma.intervention.findUnique({
      where: { id },
      include: {
        createdBy: true,
        uniteAssigned: true,
        assignedTo: true,
        journal: {
          include: { user: true },
          orderBy: { createdAt: 'asc' },
        },
        incidents: true,
      },
    });

    if (!intervention) {
      throw new NotFoundException('Intervention introuvable');
    }

    return intervention;
  }

  async assignIntervention(id: string, uniteId: string, userId: string, assignedToId?: string) {
    const intervention = await this.prisma.intervention.update({
      where: { id },
      data: {
        uniteAssignedId: uniteId,
        assignedToId,
        statut: 'EN_COURS',
        dateDebut: new Date(),
      },
      include: {
        createdBy: true,
        uniteAssigned: true,
        assignedTo: true,
      },
    });

    // Journal
    await this.prisma.journalIntervention.create({
      data: {
        interventionId: id,
        userId,
        action: `Intervention assignée à l'unité ${intervention.uniteAssigned?.nom}`,
      },
    });

    return intervention;
  }

  async updateStatus(id: string, statut: string, userId: string) {
    const intervention = await this.prisma.intervention.update({
      where: { id },
      data: {
        statut: statut as any,
        ...(statut === 'TERMINEE' && { dateFin: new Date() }),
      },
      include: {
        createdBy: true,
        uniteAssigned: true,
        assignedTo: true,
      },
    });

    // Journal
    await this.prisma.journalIntervention.create({
      data: {
        interventionId: id,
        userId,
        action: `Statut modifié: ${statut}`,
      },
    });

    return intervention;
  }

  async addJournalEntry(interventionId: string, userId: string, action: string) {
    return this.prisma.journalIntervention.create({
      data: {
        interventionId,
        userId,
        action,
      },
      include: {
        user: true,
      },
    });
  }
}
