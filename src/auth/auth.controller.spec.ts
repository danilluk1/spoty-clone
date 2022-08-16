import { TokensService } from 'src/tokens/tokens.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, TokensService],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return { register: jest.fn().mockResolvedValue(results) };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('regiser', () => {
    it('register', () => {
      expect(2 + 2).toBe(4);
    });
  });
});
