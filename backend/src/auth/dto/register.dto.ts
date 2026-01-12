import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsNotEmpty } from 'class-validator';
import { Role, Grade } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'RIO123456' })
  @IsString()
  @IsNotEmpty()
  rio: string;

  @ApiProperty({ example: 'Dupont' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Jean' })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({ example: 'gendarme@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ enum: Grade, example: Grade.GENDARME })
  @IsEnum(Grade)
  grade: Grade;

  @ApiProperty({ example: 'NS001234' })
  @IsString()
  @IsNotEmpty()
  numeroService: string;

  @ApiProperty({ example: 'unit-id-123' })
  @IsString()
  @IsNotEmpty()
  uniteId: string;

  @ApiProperty({ enum: Role, example: Role.GENDARME, default: Role.GENDARME })
  @IsEnum(Role)
  role?: Role;
}
