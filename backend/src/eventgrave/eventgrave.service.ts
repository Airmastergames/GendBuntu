import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Injectable()
export class EventgraveService {
  constructor(private prisma: PrismaService) {}

  async generateNumeroIncident(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await this.prisma.incident.count({
      where: {
        createdAt: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
    });

    const numero = String(count + 1).padStart(6, '0');
    return `INC-${year}-${numero}`;
  }

  async createIncident(dto: CreateIncidentDto, userId: string) {
    const numeroIncident = await this.generateNumeroIncident();

    return this.prisma.incident.create({
      data: {
        ...dto,
        numeroIncident,
        createdById: userId,
      },
      include: {
        createdBy: true,
        unite: true,
        intervention: {
          include: {
            createdBy: true,
            uniteAssigned: true,
          },
        },
      },
    });
  }

  async getIncidents(filters?: {
    gravite?: string;
    uniteId?: string;
    interventionId?: string;
    dateDebut?: Date;
    dateFin?: Date;
  }) {
    return this.prisma.incident.findMany({
      where: {
        ...(filters?.gravite && { gravite: filters.gravite as any }),
        ...(filters?.uniteId && { uniteId: filters.uniteId }),
        ...(filters?.interventionId && { interventionId: filters.interventionId }),
        ...(filters?.dateDebut &&
          filters?.dateFin && {
            dateIncident: {
              gte: filters.dateDebut,
              lte: filters.dateFin,
            },
          }),
      },
      include: {
        createdBy: true,
        unite: true,
        intervention: true,
      },
      orderBy: [
        { gravite: 'desc' },
        { dateIncident: 'desc' },
      ],
    });
  }

  async getIncident(id: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      include: {
        createdBy: true,
        unite: true,
        intervention: {
          include: {
            createdBy: true,
            uniteAssigned: true,
            assignedTo: true,
          },
        },
      },
    });

    if (!incident) {
      throw new NotFoundException('Incident introuvable');
    }

    return incident;
  }

  async updateIncident(id: string, dto: Partial<CreateIncidentDto>) {
    return this.prisma.incident.update({
      where: { id },
      data: dto,
      include: {
        createdBy: true,
        unite: true,
        intervention: true,
      },
    });
  }
}
