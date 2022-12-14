import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserForToken } from 'src/tokens/interfaces/UserForToken';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokensService: TokensService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authStr = request.headers['authorization'];
    if (!authStr) return false;

    const access_token = authStr.split(' ').pop();
    if (!access_token) return false;

    const res = this.tokensService.parseAccessToken(access_token);
    if (!res) return false;

    request.user = res;
    return true;
  }
}
