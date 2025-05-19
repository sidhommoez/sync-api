import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configuration from '../configuration';
import { HealthModule } from '../common/health/health.module';
import pgDataSource from '../pg-data-source';
import {WebzModule} from "../features/webz/webz.module";

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          ...pgDataSource.options,
        };
      },
    }),
    WebzModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
