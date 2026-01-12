import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateCompteRenduDto {
  @ApiProperty({ example: 'Intervention secteur A' })
  @IsString()
  @IsNotEmpty()
  titre: string;

  @ApiProperty({ example: 'Contenu détaillé du compte-rendu...' })
  @IsString()
  @IsNotEmpty()
  contenu: string;

  @ApiProperty({ example: '2024-01-15T10:00:00Z' })
  @IsDateString()
  dateOperation: string;

  @ApiProperty({ example: '123 Rue de la République, Paris' })
  @IsString()
  @IsNotEmpty()
  lieu: string;
}
