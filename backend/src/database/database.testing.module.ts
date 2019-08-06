import { Module, Global, DynamicModule } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

function DatabaseOrmModule(): DynamicModule {
  return TypeOrmModule.forRoot({
    type: 'mongodb',
    host: '127.0.0.1',
    port: 27017,
    database: 'testing',
    entities: [join(__dirname, '/../**/**.entity{.ts,.js}')],
    synchronize: false,
  });
}

@Module({
  imports: [DatabaseOrmModule()],
})
export class DatabaseTestingModule {}
