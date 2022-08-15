import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { Observable } from 'rxjs';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokensService: TokensService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const access_token = ExtractJwt.fromAuthHeaderAsBearerToken();
    return validateRequest(request);
  }
}
