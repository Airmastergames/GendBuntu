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
import { LrpgnService } from './lrpgn.service';
import { CreatePVEDto } from './dto/create-pve.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('LRPGN')
@Controller('lrpgn')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LrpgnController {
  constructor(private lrpgnService: LrpgnService) {}

  @Post('pve')
  @Roles(Role.OPJ, Role.ADMIN)
  @ApiOperation({ summary: 'Créer un PVE' })
  createPVE(@Body() dto: CreatePVEDto, @CurrentUser() user: any) {
    return this.lrpgnService.createPVE(dto, user.id);
  }

  @Get('pve')
  @Roles(Role.OPJ, Role.ADMIN, Role.OFFICIER)
  @ApiOperation({ summary: 'Liste des PVE' })
  getPVEs(@Query() filters: any) {
    return this.lrpgnService.getPVEs(filters);
  }

  @Get('pve/:id')
  @Roles(Role.OPJ, Role.ADMIN, Role.OFFICIER)
  @ApiOperation({ summary: 'Détails d\'un PVE' })
  getPVE(@Param('id') id: string) {
    return this.lrpgnService.getPVE(id);
  }

  @Patch('pve/:id/status')
  @Roles(Role.OPJ, Role.ADMIN)
  @ApiOperation({ summary: 'Mettre à jour le statut d\'un PVE' })
  updateStatus(@Param('id') id: string, @Body('statut') statut: string) {
    return this.lrpgnService.updatePVEStatus(id, statut);
  }

  @Patch('pve/:id/link-pv')
  @Roles(Role.OPJ, Role.ADMIN)
  @ApiOperation({ summary: 'Lier un PVE à un PV' })
  linkToPV(@Param('id') pveId: string, @Body('pvId') pvId: string) {
    return this.lrpgnService.linkPVEToPV(pveId, pvId);
  }
}
