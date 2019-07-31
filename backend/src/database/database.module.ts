import { Module, Global, DynamicModule } from '@nestjs/common';
import { join } from 'path';
import { EnvService } from '../env/env.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule } from '../env/env.module';

function DatabaseOrmModule(): DynamicModule {
  const config = new EnvService().read();

  return TypeOrmModule.forRoot({
    type: config.DB_TYPE,
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    entities: [join(__dirname, '/../**/**.entity{.ts,.js}')],
    synchronize: false,
  });
}

@Global()
@Module({
  imports: [
    EnvModule,
    DatabaseOrmModule(),
  ],
})
export class DatabaseModule { }
