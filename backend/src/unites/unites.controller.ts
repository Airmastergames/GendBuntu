import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UnitesService } from './unites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Unités')
@Controller('unites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UnitesController {
  constructor(private unitesService: UnitesService) {}

  @Get()
  @ApiOperation({ summary: 'Liste toutes les unités' })
  findAll() {
    return this.unitesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une unité' })
  findOne(@Param('id') id: string) {
    return this.unitesService.findOne(id);
  }
}
