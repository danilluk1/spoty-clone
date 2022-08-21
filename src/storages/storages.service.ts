import { HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UserForToken } from 'src/tokens/interfaces/UserForToken';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { StorageDocument, Storage } from './schemas/storage.schema';

export class StoragesService {
  constructor(
    @InjectModel(Storage.name) private storageModel: Model<StorageDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async uploadSongs(songs: Express.Multer.File[], user: UserForToken) {
    const dbUser = await this.userModel.findById(user._id);
    if (!dbUser) throw new HttpException('Cannot find user', 404);

    for (const song of songs) {
      const dbSong = new this.storageModel();
      dbSong.name = song.filename;
      dbSong.size = song.size;
      dbSong.user = dbUser;
      await dbSong.save();
    }
  }

  async getSongs(user: UserForToken, page: number, limit: number) {
    const dbUser = await this.userModel.findById(user._id);
    if (!dbUser) throw new HttpException('Cannot find user', 404);

    const songs = await this.storageModel
      .find({
        user: dbUser,
      })
      .limit(limit)
      .skip((page - 1) * limit);
    return songs;
  }

  async getSongById(_id: string): Promise<StorageDocument> {
    if (!mongoose.isValidObjectId(_id))
      throw new HttpException('Invalid id', 400);

    const dbSong = await this.storageModel.findById(_id);
    if (!dbSong) throw new HttpException('Cannot find song', 404);

    return dbSong;
  }
}
