import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StorageDocument, Storage } from './schemas/storage.schema';

export class StoragesService {
  constructor(
    @InjectModel(Storage.name) private storageModel: Model<StorageDocument>,
  ) {}

  async uploadSongs() {

  }
}
