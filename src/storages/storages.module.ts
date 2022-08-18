import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UserForToken } from 'src/tokens/interfaces/UserForToken';
import { TokensService } from 'src/tokens/tokens.service';
import { StorageSchema, Storage } from './schemas/storage.schema';
import { StoragesController } from './storages.controller';
import { StoragesService } from './storages.service';
import * as fs from 'fs';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: Storage.name, schema: StorageSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: function (req, file, cb) {
          const user = req.user as UserForToken;
          const path = `${process.env.STORAGE_PATH}/${user.email}`;

          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }

          cb(null, `${process.env.STORAGE_PATH}/${user.email}`);
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
