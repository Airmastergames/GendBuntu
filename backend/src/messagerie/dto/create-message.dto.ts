import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'Objet du message' })
  @IsString()
  @IsNotEmpty()
  sujet: string;

  @ApiProperty({ example: 'Contenu du message...' })
  @IsString()
  @IsNotEmpty()
  contenu: string;

  @ApiProperty({ example: 'user-id-123' })
  @IsString()
  @IsNotEmpty()
  receiverId: string;
}
