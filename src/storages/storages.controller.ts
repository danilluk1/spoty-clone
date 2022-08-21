import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { TokensService } from 'src/tokens/tokens.service';
import { SongsValidationPipe } from './pipes/songs.validation.pipe';
import { StoragesService } from './storages.service';
import { UserForToken } from 'src/tokens/interfaces/UserForToken';
import { PaginationParams } from './interfaces/pagination.params';
import { createReadStream } from 'fs';
import { join } from 'path';

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
    @Query(new ValidationPipe()) { page, limit }: PaginationParams,
  ) {
    const songs = await this.storagesService.getSongs(
      req.user as UserForToken,
      page,
      limit,
    );
    return songs;
  }

  @Get('track/:id')
  async getSong(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as UserForToken;
    const dbSong = await this.storagesService.getSongById(id);
    const song = createReadStream(
      join(process.cwd(), process.env.STORAGE_PATH, user.email, dbSong.name),
    );

    song.pipe(res);
  }
}
