import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TokensService } from 'src/tokens/tokens.service';
import { StorageSchema, Storage } from './schemas/storage.schema';
import { StoragesController } from './storages.controller';
import { StoragesService } from './storages.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: function (req, file, cb) {
          console.log(req.body);
          cb(null, process.env.STORAGE_PATH);
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
  ],
  controllers: [StoragesController],
  providers: [StoragesService, TokensService],
})
export class StoragesModule {}
