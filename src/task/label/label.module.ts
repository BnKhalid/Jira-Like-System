import { Module } from '@nestjs/common';
import { LabelService } from './label.service';
import { LabelController } from './label.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Label } from './label.entity';

@Module({
  imports: [
    MikroOrmModule.forFeature([Label])
  ],
  controllers: [LabelController],
  providers: [LabelService],
  exports: [LabelService]
})
export class LabelModule {}
