import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagerieService {
  constructor(private prisma: PrismaService) {}

  async createMessage(dto: CreateMessageDto, senderId: string) {
    return this.prisma.message.create({
      data: {
        ...dto,
        senderId,
      },
      include: {
        sender: true,
        receiver: true,
        piecesJointes: true,
      },
    });
  }

  async getInbox(userId: string, filters?: { isRead?: boolean; statut?: string }) {
    return this.prisma.message.findMany({
      where: {
        receiverId: userId,
        ...(filters?.isRead !== undefined && { isRead: filters.isRead }),
        ...(filters?.statut && { statut: filters.statut as any }),
      },
      include: {
        sender: true,
        piecesJointes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSent(userId: string) {
    return this.prisma.message.findMany({
      where: { senderId: userId },
      include: {
        receiver: true,
        piecesJointes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDrafts(userId: string) {
    return this.prisma.message.findMany({
      where: {
        senderId: userId,
        statut: 'BROUILLON',
      },
      include: {
        receiver: true,
        piecesJointes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMessage(id: string, userId: string) {
    const message = await this.prisma.message.findFirst({
      where: {
        id,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: true,
        receiver: true,
        piecesJointes: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message introuvable');
    }

    // Marquer comme lu si c'est le destinataire
    if (message.receiverId === userId && !message.isRead) {
      await this.prisma.message.update({
        where: { id },
        data: { isRead: true, readAt: new Date() },
      });
      message.isRead = true;
      message.readAt = new Date();
    }

    return message;
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.message.updateMany({
      where: {
        id,
        receiverId: userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async archiveMessage(id: string, userId: string) {
    return this.prisma.message.updateMany({
      where: {
        id,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      data: {
        statut: 'ARCHIVE',
      },
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
        statut: 'ENVOYE',
      },
    });
  }
}
