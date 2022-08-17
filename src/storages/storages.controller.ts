import {
  Controller,
  HttpStatus,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
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
    console.log(req.body.user);
    return '123';
  }
}
