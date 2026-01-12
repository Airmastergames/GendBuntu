import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Grade } from '@prisma/client';

@Injectable()
export class AnnuaireService {
  constructor(private prisma: PrismaService) {}

  async search(filters?: {
    search?: string;
    grade?: Grade;
    uniteId?: string;
    role?: string;
  }) {
    const where: any = {
      isActive: true,
    };

    if (filters?.search) {
      where.OR = [
        { nom: { contains: filters.search, mode: 'insensitive' } },
        { prenom: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { rio: { contains: filters.search, mode: 'insensitive' } },
        { numeroService: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.grade) {
      where.grade = filters.grade;
    }

    if (filters?.uniteId) {
      where.uniteId = filters.uniteId;
    }

    if (filters?.role) {
      where.role = filters.role;
    }

    return this.prisma.user.findMany({
      where,
      include: {
        unite: true,
      },
      orderBy: [
        { grade: 'asc' },
        { nom: 'asc' },
        { prenom: 'asc' },
      ],
    });
  }

  async getByUnite(uniteId: string) {
    return this.prisma.user.findMany({
      where: {
        uniteId,
        isActive: true,
      },
      include: {
        unite: true,
      },
      orderBy: [
        { grade: 'asc' },
        { nom: 'asc' },
      ],
    });
  }

  async getByGrade(grade: Grade) {
    return this.prisma.user.findMany({
      where: {
        grade,
        isActive: true,
      },
      include: {
        unite: true,
      },
      orderBy: [
        { nom: 'asc' },
        { prenom: 'asc' },
      ],
    });
  }
}
