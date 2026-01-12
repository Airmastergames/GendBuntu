import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnitesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.unite.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.unite.findUnique({
      where: { id },
      include: {
        users: {
          where: { isActive: true },
        },
      },
    });
  }
}
