import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import mikroOrmConfig from './mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(mikroOrmConfig)],
  controllers: [],
  providers: [],
})
export class AppModule {}
