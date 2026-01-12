import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { TypePV } from '@prisma/client';

export class CreatePVDto {
  @ApiProperty({ enum: TypePV })
  @IsEnum(TypePV)
  type: TypePV;

  @ApiProperty({ example: '2024-01-15T14:30:00Z' })
  @IsDateString()
  dateInfraction: string;

  @ApiProperty({ example: '123 Rue de la République, Paris' })
  @IsString()
  @IsNotEmpty()
  lieuInfraction: string;

  @ApiProperty({ example: 'Description détaillée de l\'infraction...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'service-id-123', required: false })
  @IsString()
  @IsOptional()
  serviceId?: string;
}
