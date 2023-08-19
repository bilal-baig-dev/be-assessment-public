import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { DeploymentEnvironmentTypes } from '../shared/enums/environment-types.enum';
import { IEnvSchema } from '../shared/interfaces/env-schema.interface';
import { DataSourceOptions } from 'typeorm/data-source';

@Injectable()
export class ConfigService {
  private readonly envConfig: IEnvSchema;

  constructor() {
    console.log(process.env.NODE_ENV, 'Environemnt');
    dotenv.config({ path: `env/.env.${process.env.NODE_ENV}` });
    const config: { [name: string]: string } = process.env;
    const parsedConfig = JSON.parse(JSON.stringify(config));
    this.envConfig = this.validateEnvSchema(parsedConfig);
  }

  private getEnvSchema() {
    const schema = Joi.object<IEnvSchema>({
      NODE_ENV: Joi.string()
        .valid(...Object.values(DeploymentEnvironmentTypes))
        .default(DeploymentEnvironmentTypes.Development),
      PORT: Joi.number().integer().positive().min(1001).max(9999).required(),
      DB_USERNAME: Joi.string().trim().min(1).required(),
      DB_PASSWORD: Joi.string().trim().min(1).required(),
      DB_NAME: Joi.string().trim().min(1).required(),
      DB_HOST: Joi.string().trim().min(1).required(),
      DB_PORT: Joi.number().integer().positive().min(1001).max(9999).required(),
      JWT_SECRET_KEY: Joi.string().trim().min(1).required(),
      JWT_TOKEN_EXPIRATION: Joi.string().trim().min(1).required(),
    });
    return schema;
  }

  private validateEnvSchema(keyValuePairs) {
    const envSchema = this.getEnvSchema();
    const validationResult = envSchema.validate(keyValuePairs, {
      allowUnknown: true,
    });

    if (validationResult.error) {
      throw new Error(
        `Validation failed for .env file. ${validationResult.error.message}`,
      );
    }

    return validationResult.value;
  }

  getTypeOrmConfig(): DataSourceOptions {
    return {
      type: 'mysql',
      username: this.getDBUsername(),
      password: this.getDBPassword(),
      database: this.getDBName(),
      host: this.getDBHost(),
      synchronize: true,
      port: parseInt(this.getDBPort()),
    };
  }

  private get(key: string): string {
    return this.envConfig[key];
  }

  getEnvironment(): string {
    return this.get('NODE_ENV');
  }

  getPort(): string {
    return this.get('PORT');
  }

  getDBUsername(): string {
    return this.get('DB_USERNAME');
  }

  getDBPassword(): string {
    return this.get('DB_PASSWORD');
  }

  getDBName(): string {
    return this.get('DB_NAME');
  }

  getDBHost(): string {
    return this.get('DB_HOST');
  }

  getDBPort(): string {
    return this.get('DB_PORT');
  }

  getJWTSecretKey(): string {
    return this.get('JWT_SECRET_KEY');
  }

  getJWTTokenExpiration(): string {
    return this.get('JWT_TOKEN_EXPIRATION');
  }
}
