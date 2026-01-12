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
import { BdspService } from './bdsp.service';
import { CreateInterventionDto } from './dto/create-intervention.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('BDSP')
@Controller('bdsp')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BdspController {
  constructor(private bdspService: BdspService) {}

  @Post('interventions')
  @Roles(Role.CORG, Role.ADMIN)
  @ApiOperation({ summary: 'Créer une intervention' })
  createIntervention(@Body() dto: CreateInterventionDto, @CurrentUser() user: any) {
    return this.bdspService.createIntervention(dto, user.id);
  }

  @Get('interventions')
  @ApiOperation({ summary: 'Liste des interventions' })
  getInterventions(@Query() filters: any) {
    return this.bdspService.getInterventions(filters);
  }

  @Get('interventions/:id')
  @ApiOperation({ summary: 'Détails d\'une intervention' })
  getIntervention(@Param('id') id: string) {
    return this.bdspService.getIntervention(id);
  }

  @Patch('interventions/:id/assign')
  @Roles(Role.CORG, Role.ADMIN)
  @ApiOperation({ summary: 'Assigner une intervention' })
  assignIntervention(
    @Param('id') id: string,
    @Body('uniteId') uniteId: string,
    @Body('assignedToId') assignedToId: string,
    @CurrentUser() user: any,
  ) {
    return this.bdspService.assignIntervention(id, uniteId, user.id, assignedToId);
  }

  @Patch('interventions/:id/status')
  @Roles(Role.CORG, Role.ADMIN)
  @ApiOperation({ summary: 'Mettre à jour le statut' })
  updateStatus(
    @Param('id') id: string,
    @Body('statut') statut: string,
    @CurrentUser() user: any,
  ) {
    return this.bdspService.updateStatus(id, statut, user.id);
  }

  @Post('interventions/:id/journal')
  @ApiOperation({ summary: 'Ajouter une entrée au journal' })
  addJournalEntry(
    @Param('id') interventionId: string,
    @Body('action') action: string,
    @CurrentUser() user: any,
  ) {
    return this.bdspService.addJournalEntry(interventionId, user.id, action);
  }
}
