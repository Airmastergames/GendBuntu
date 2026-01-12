import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { CompteRenduService } from './compte-rendu.service';
import { CreateCompteRenduDto } from './dto/create-compte-rendu.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import * as fs from 'fs';

@ApiTags('Compte-rendu')
@Controller('compte-rendu')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompteRenduController {
  constructor(private compteRenduService: CompteRenduService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un compte-rendu' })
  createCompteRendu(@Body() dto: CreateCompteRenduDto, @CurrentUser() user: any) {
    return this.compteRenduService.createCompteRendu(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Liste des comptes-rendus' })
  getCompteRendus(@Query() filters: any) {
    return this.compteRenduService.getCompteRendus(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un compte-rendu' })
  getCompteRendu(@Param('id') id: string) {
    return this.compteRenduService.getCompteRendu(id);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Télécharger le PDF' })
  async downloadPDF(@Param('id') id: string, @Res() res: Response) {
    const pdfPath = await this.compteRenduService.getPDFPath(id);
    const filename = `compte-rendu-${id}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  }
}
