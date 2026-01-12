import { Module } from '@nestjs/common';
import { EventgraveService } from './eventgrave.service';
import { EventgraveController } from './eventgrave.controller';

@Module({
  controllers: [EventgraveController],
  providers: [EventgraveService],
  exports: [EventgraveService],
})
export class EventgraveModule {}
