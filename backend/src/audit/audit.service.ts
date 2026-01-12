import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TypeAction } from '@prisma/client';

interface LogData {
  userId?: string;
  action: TypeAction;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: LogData) {
    try {
      await this.prisma.auditLog.create({
        data,
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du log:', error);
    }
  }

  async getLogs(filters?: {
    userId?: string;
    action?: TypeAction;
    entity?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.action && { action: filters.action }),
        ...(filters?.entity && { entity: filters.entity }),
        ...(filters?.startDate &&
          filters?.endDate && {
            createdAt: {
              gte: filters.startDate,
              lte: filters.endDate,
            },
          }),
      },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });
  }
}
