import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePVEDto {
  @ApiProperty({ example: 'Contenu détaillé du PVE...' })
  @IsString()
  @IsNotEmpty()
  contenu: string;

  @ApiProperty({ example: 'pv-id-123', required: false })
  @IsString()
  @IsOptional()
  pvId?: string;
}
