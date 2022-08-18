import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { TokensService } from 'src/tokens/tokens.service';
import { SongsValidationPipe } from './pipes/songs.validation.pipe';
import { StoragesService } from './storages.service';
import { UserForToken } from 'src/tokens/interfaces/UserForToken';
import { IsPositive } from 'class-validator';
import { PaginationParams } from './interfaces/pagination.params';

@Controller('storage')
@UseGuards(AuthGuard)
export class StoragesController {
  constructor(
    private storagesService: StoragesService,
    private tokensService: TokensService,
  ) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('songs', 10))
  async uploadSongs(
    @Req() req: Request,
    @UploadedFiles(SongsValidationPipe)
    songs: Array<Express.Multer.File>,
  ) {
    await this.storagesService.uploadSongs(songs, req.user as UserForToken);
    return 'success';
  }

  @Get('tracks')
  async getSongs(
    @Req() req: Request,
    @Query() { page, limit }: PaginationParams,
  ) {
    const songs = await this.storagesService.getSongs(
      req.user as UserForToken,
      page,
      limit,
    );
    return songs;
  }
}
