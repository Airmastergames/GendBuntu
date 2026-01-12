import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { StatutService } from '@prisma/client';

export class CreatePlanningDto {
  @ApiProperty({ example: 'Patrouille secteur A' })
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiProperty({ example: 'Patrouille de routine dans le secteur A', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2024-01-15T08:00:00Z' })
  @IsDateString()
  dateDebut: string;

  @ApiProperty({ example: '2024-01-15T16:00:00Z' })
  @IsDateString()
  dateFin: string;

  @ApiProperty({ enum: StatutService, default: StatutService.PLANIFIE })
  @IsEnum(StatutService)
  @IsOptional()
  statut?: StatutService;

  @ApiProperty({ example: 'Patrouille' })
  @IsString()
  @IsNotEmpty()
  typeService: string;

  @ApiProperty({ example: 'unit-id-123' })
  @IsString()
  @IsNotEmpty()
  uniteId: string;
}
