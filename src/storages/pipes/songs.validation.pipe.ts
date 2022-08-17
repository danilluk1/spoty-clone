import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class SongsValidationPipe implements PipeTransform {
  transform(songs: Express.Multer.File[], metadata: ArgumentMetadata) {
    if (!songs) throw new BadRequestException('Songs must be a specified');
    for (const song of songs) {
      if (!song) throw new BadRequestException('Song must be a specified');
      if (song.size > 15 * 1024 * 1024)
        throw new BadRequestException('Size must be less than 15MB');
      if (song.originalname.split('.').pop() !== 'mp3')
        throw new BadRequestException('Filetype must be mp3');
    }
    return songs;
  }
}
