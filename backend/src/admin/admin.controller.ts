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
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Administration')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  // Utilisateurs
  @Get('users')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Liste tous les utilisateurs' })
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Modifier un utilisateur' })
  updateUser(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateUser(id, data);
  }

  @Patch('users/:id/reset-password')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Réinitialiser le mot de passe' })
  resetPassword(@Param('id') id: string, @Body('password') password: string) {
    return this.adminService.resetPassword(id, password);
  }

  // Unités
  @Post('unites')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Créer une unité' })
  createUnite(@Body() data: any) {
    return this.adminService.createUnite(data);
  }

  @Patch('unites/:id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Modifier une unité' })
  updateUnite(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateUnite(id, data);
  }

  // Statistiques
  @Get('stats')
  @Roles(Role.ADMIN, Role.COMMANDEMENT)
  @ApiOperation({ summary: 'Statistiques globales' })
  getStats() {
    return this.adminService.getStats();
  }

  // Logs
  @Get('logs')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Logs système' })
  getLogs(@Query() filters: any) {
    return this.adminService.getLogs(filters);
  }
}
