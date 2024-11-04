import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import mikroOrmConfig from './mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    ConfigModule.forRoot(),
    AuthModule,
    WorkspaceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
