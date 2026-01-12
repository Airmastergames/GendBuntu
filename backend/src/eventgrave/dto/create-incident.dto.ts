import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { GraviteIncident } from '@prisma/client';

export class CreateIncidentDto {
  @ApiProperty({ example: 'Accident de la route' })
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiProperty({ example: 'Description détaillée de l\'incident...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: GraviteIncident, default: GraviteIncident.MOYENNE })
  @IsEnum(GraviteIncident)
  @IsOptional()
  gravite?: GraviteIncident;

  @ApiProperty({ example: '2024-01-15T14:30:00Z' })
  @IsDateString()
  dateIncident: string;

  @ApiProperty({ example: '123 Rue de la République, Paris' })
  @IsString()
  @IsNotEmpty()
  lieu: string;

  @ApiProperty({ example: 'unit-id-123' })
  @IsString()
  @IsNotEmpty()
  uniteId: string;

  @ApiProperty({ example: 'intervention-id-123', required: false })
  @IsString()
  @IsOptional()
  interventionId?: string;

  @ApiProperty({ example: 'Liste des militaires blessés...', required: false })
  @IsString()
  @IsOptional()
  militairesBlesses?: string;

  @ApiProperty({ example: 'Chronologie des événements...', required: false })
  @IsString()
  @IsOptional()
  chronologie?: string;
}
