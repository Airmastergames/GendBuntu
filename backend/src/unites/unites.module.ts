import { Module } from '@nestjs/common';
import { UnitesService } from './unites.service';
import { UnitesController } from './unites.controller';

@Module({
  controllers: [UnitesController],
  providers: [UnitesService],
  exports: [UnitesService],
})
export class UnitesModule {}
