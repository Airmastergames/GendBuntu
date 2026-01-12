import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PulsarService } from './pulsar.service';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { CreatePVDto } from './dto/create-pv.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Pulsar')
@Controller('pulsar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PulsarController {
  constructor(private pulsarService: PulsarService) {}

  // Planning
  @Post('planning')
  @ApiOperation({ summary: 'Créer un planning/service' })
  createPlanning(@Body() dto: CreatePlanningDto, @CurrentUser() user: any) {
    return this.pulsarService.createPlanning(dto, user.id);
  }

  @Get('planning')
  @ApiOperation({ summary: 'Liste des plannings' })
  getPlannings(@Query() filters: any) {
    return this.pulsarService.getPlannings(filters);
  }

  @Get('planning/:id')
  @ApiOperation({ summary: 'Détails d\'un planning' })
  getPlanning(@Param('id') id: string) {
    return this.pulsarService.getPlanning(id);
  }

  @Post('planning/:id/participants')
  @ApiOperation({ summary: 'Ajouter un participant' })
  addParticipant(
    @Param('id') serviceId: string,
    @Body('userId') userId: string,
    @Body('role') role?: string,
  ) {
    return this.pulsarService.addParticipant(serviceId, userId, role);
  }

  // PV
  @Post('pv')
  @ApiOperation({ summary: 'Créer un PV' })
  createPV(@Body() dto: CreatePVDto, @CurrentUser() user: any) {
    return this.pulsarService.createPV(dto, user.id);
  }

  @Get('pv')
  @ApiOperation({ summary: 'Liste des PV' })
  getPVs(@Query() filters: any) {
    return this.pulsarService.getPVs(filters);
  }

  @Get('pv/:id')
  @ApiOperation({ summary: 'Détails d\'un PV' })
  getPV(@Param('id') id: string) {
    return this.pulsarService.getPV(id);
  }

  @Patch('pv/:id/validate')
  @ApiOperation({ summary: 'Valider un PV' })
  validatePV(@Param('id') id: string, @CurrentUser() user: any) {
    return this.pulsarService.validatePV(id, user.id);
  }
}
