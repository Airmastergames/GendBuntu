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
import { MessagerieService } from './messagerie.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Messagerie')
@Controller('messagerie')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagerieController {
  constructor(private messagerieService: MessagerieService) {}

  @Post()
  @ApiOperation({ summary: 'Envoyer un message' })
  createMessage(@Body() dto: CreateMessageDto, @CurrentUser() user: any) {
    return this.messagerieService.createMessage(dto, user.id);
  }

  @Get('inbox')
  @ApiOperation({ summary: 'Boîte de réception' })
  getInbox(@CurrentUser() user: any, @Query() filters: any) {
    return this.messagerieService.getInbox(user.id, filters);
  }

  @Get('sent')
  @ApiOperation({ summary: 'Messages envoyés' })
  getSent(@CurrentUser() user: any) {
    return this.messagerieService.getSent(user.id);
  }

  @Get('drafts')
  @ApiOperation({ summary: 'Brouillons' })
  getDrafts(@CurrentUser() user: any) {
    return this.messagerieService.getDrafts(user.id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Nombre de messages non lus' })
  getUnreadCount(@CurrentUser() user: any) {
    return this.messagerieService.getUnreadCount(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un message' })
  getMessage(@Param('id') id: string, @CurrentUser() user: any) {
    return this.messagerieService.getMessage(id, user.id);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marquer comme lu' })
  markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.messagerieService.markAsRead(id, user.id);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archiver un message' })
  archiveMessage(@Param('id') id: string, @CurrentUser() user: any) {
    return this.messagerieService.archiveMessage(id, user.id);
  }
}
