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
import { EventgraveService } from './eventgrave.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('EventGrave')
@Controller('eventgrave')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EventgraveController {
  constructor(private eventgraveService: EventgraveService) {}

  @Post('incidents')
  @ApiOperation({ summary: 'Créer un incident grave' })
  createIncident(@Body() dto: CreateIncidentDto, @CurrentUser() user: any) {
    return this.eventgraveService.createIncident(dto, user.id);
  }

  @Get('incidents')
  @ApiOperation({ summary: 'Liste des incidents graves' })
  getIncidents(@Query() filters: any) {
    return this.eventgraveService.getIncidents(filters);
  }

  @Get('incidents/:id')
  @ApiOperation({ summary: 'Détails d\'un incident' })
  getIncident(@Param('id') id: string) {
    return this.eventgraveService.getIncident(id);
  }

  @Patch('incidents/:id')
  @ApiOperation({ summary: 'Mettre à jour un incident' })
  updateIncident(@Param('id') id: string, @Body() dto: Partial<CreateIncidentDto>) {
    return this.eventgraveService.updateIncident(id, dto);
  }
}
