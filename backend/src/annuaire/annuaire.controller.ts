import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnnuaireService } from './annuaire.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Annuaire')
@Controller('annuaire')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnnuaireController {
  constructor(private annuaireService: AnnuaireService) {}

  @Get('search')
  @ApiOperation({ summary: 'Recherche dans l\'annuaire' })
  search(@Query() filters: any) {
    return this.annuaireService.search(filters);
  }

  @Get('unite/:uniteId')
  @ApiOperation({ summary: 'Personnels par unité' })
  getByUnite(@Query('uniteId') uniteId: string) {
    return this.annuaireService.getByUnite(uniteId);
  }

  @Get('grade/:grade')
  @ApiOperation({ summary: 'Personnels par grade' })
  getByGrade(@Query('grade') grade: string) {
    return this.annuaireService.getByGrade(grade as any);
  }
}
