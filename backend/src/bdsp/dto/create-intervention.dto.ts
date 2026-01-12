import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { PrioriteIntervention } from '@prisma/client';

export class CreateInterventionDto {
  @ApiProperty({ example: 'Intervention urgente secteur A' })
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiProperty({ example: 'Description détaillée de l\'intervention...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '123 Rue de la République, Paris' })
  @IsString()
  @IsNotEmpty()
  adresse: string;

  @ApiProperty({ enum: PrioriteIntervention, default: PrioriteIntervention.NORMALE })
  @IsEnum(PrioriteIntervention)
  @IsOptional()
  priorite?: PrioriteIntervention;
}
