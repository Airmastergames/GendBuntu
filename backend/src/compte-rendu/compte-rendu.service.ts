import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompteRenduDto } from './dto/create-compte-rendu.dto';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { FormData } from 'form-data';

@Injectable()
export class CompteRenduService {
  private uploadsDir: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.uploadsDir = path.join(process.cwd(), 'uploads', 'compte-rendus');
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async createCompteRendu(dto: CreateCompteRenduDto, userId: string) {
    const compteRendu = await this.prisma.compteRendu.create({
      data: {
        ...dto,
        createdById: userId,
      },
      include: {
        createdBy: {
          include: { unite: true },
        },
      },
    });

    // Génération PDF
    const pdfPath = await this.generatePDF(compteRendu);

    // Upload Discord
    const discordUrl = await this.uploadToDiscord(pdfPath, compteRendu);

    // Mise à jour avec les chemins
    return this.prisma.compteRendu.update({
      where: { id: compteRendu.id },
      data: {
        pdfPath,
        discordUrl,
      },
      include: {
        createdBy: {
          include: { unite: true },
        },
      },
    });
  }

  private async generatePDF(compteRendu: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const filename = `CR-${compteRendu.id}-${Date.now()}.pdf`;
      const filepath = path.join(this.uploadsDir, filename);

      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // En-tête
      doc.fontSize(20).text('COMPTE-RENDU OPÉRATIONNEL', { align: 'center' });
      doc.moveDown();

      // Informations
      doc.fontSize(12);
      doc.text(`Date de l'opération: ${new Date(compteRendu.dateOperation).toLocaleDateString('fr-FR')}`);
      doc.text(`Lieu: ${compteRendu.lieu}`);
      doc.text(`Rédigé par: ${compteRendu.createdBy.prenom} ${compteRendu.createdBy.nom} - ${compteRendu.createdBy.grade}`);
      doc.text(`Unité: ${compteRendu.createdBy.unite?.nom || 'N/A'}`);
      doc.moveDown();

      // Titre
      doc.fontSize(16).text(compteRendu.titre, { underline: true });
      doc.moveDown();

      // Contenu
      doc.fontSize(11).text(compteRendu.contenu, {
        align: 'justify',
      });

      // Pied de page
      const pageHeight = doc.page.height;
      const pageWidth = doc.page.width;
      doc.fontSize(8)
        .text(
          `Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`,
          pageWidth - 200,
          pageHeight - 30,
        );

      doc.end();

      stream.on('finish', () => resolve(filepath));
      stream.on('error', reject);
    });
  }

  private async uploadToDiscord(filepath: string, compteRendu: any): Promise<string | null> {
    const webhookUrl = this.config.get<string>('DISCORD_WEBHOOK_URL');
    if (!webhookUrl) {
      console.warn('DISCORD_WEBHOOK_URL non configuré');
      return null;
    }

    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filepath), {
        filename: path.basename(filepath),
        contentType: 'application/pdf',
      });

      const response = await axios.post(webhookUrl, form, {
        headers: form.getHeaders(),
        params: {
          content: `📄 **Nouveau compte-rendu opérationnel**\n` +
            `**Titre:** ${compteRendu.titre}\n` +
            `**Date:** ${new Date(compteRendu.dateOperation).toLocaleDateString('fr-FR')}\n` +
            `**Lieu:** ${compteRendu.lieu}\n` +
            `**Auteur:** ${compteRendu.createdBy.prenom} ${compteRendu.createdBy.nom}`,
        },
      });

      return response.data?.url || null;
    } catch (error) {
      console.error('Erreur upload Discord:', error);
      return null;
    }
  }

  async getCompteRendus(filters?: {
    createdById?: string;
    dateDebut?: Date;
    dateFin?: Date;
  }) {
    return this.prisma.compteRendu.findMany({
      where: {
        ...(filters?.createdById && { createdById: filters.createdById }),
        ...(filters?.dateDebut &&
          filters?.dateFin && {
            dateOperation: {
              gte: filters.dateDebut,
              lte: filters.dateFin,
            },
          }),
      },
      include: {
        createdBy: {
          include: { unite: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCompteRendu(id: string) {
    const compteRendu = await this.prisma.compteRendu.findUnique({
      where: { id },
      include: {
        createdBy: {
          include: { unite: true },
        },
      },
    });

    if (!compteRendu) {
      throw new NotFoundException('Compte-rendu introuvable');
    }

    return compteRendu;
  }

  async getPDFPath(id: string): Promise<string> {
    const compteRendu = await this.getCompteRendu(id);
    if (!compteRendu.pdfPath || !fs.existsSync(compteRendu.pdfPath)) {
      throw new NotFoundException('PDF introuvable');
    }
    return compteRendu.pdfPath;
  }
}
