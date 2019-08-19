import { Module, Global } from '@nestjs/common';
import { EnvService } from './env.service';

@Global()
@Module({
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
