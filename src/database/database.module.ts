import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../config';
import { entitiesAndMigrations } from '../shared/entities-and-migrations';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          ...configService.getTypeOrmConfig(),
          ...entitiesAndMigrations,
          keepConnectionAlive: true,
          timezone: '00:00',
        } as TypeOrmModuleAsyncOptions;
      },
    }),
  ],
  exports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => {
        return {
          ...ConfigService.getTypeOrmConfig(),
          ...entitiesAndMigrations,
        };
      },
    }),
    TypeOrmModule.forFeature([]),
  ],
})
export class DatabaseModule {}
