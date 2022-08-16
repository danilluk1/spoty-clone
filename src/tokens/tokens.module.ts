import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Module({
  imports: [],
  controllers: [],
  providers: [TokensService],
})
export class TokensModule {}
