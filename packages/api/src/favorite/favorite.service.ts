import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Document } from '../document/document.model';
import { User } from '../users/user.entity';
import { FavoriteRepository } from './favorite.repository';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(FavoriteRepository)
    private favoriteRepository: FavoriteRepository,
    @InjectModel('Document') private readonly documentModel: Model<Document>,
  ) {}

  async getFavorite(id: string) {
    let favs = {};
    const data = await this.favoriteRepository.find({ userId: id });
    favs = Promise.all(
      data.map(
        async f => await this.documentModel.findOne({ _id: f.documentId }),
      ),
    );
    return favs;
  }
  async addFavorite(currentUser: User, id: string) {
    let newFavorite = this.favoriteRepository.create();

    newFavorite.userId = currentUser.id;
    newFavorite.documentId = id;
    if (await this.favoriteRepository.findOne({userId: currentUser.id, documentId: id})) {
      throw new ConflictException('Cant add same document twice')
    }
    try {
      await this.favoriteRepository.save(newFavorite);
    } catch (error) {
      return error;
    }

    return newFavorite;
  }

  async removeFavorite(currentUser: User, id: string) {
    await this.favoriteRepository.delete(await (await this.favoriteRepository.findOne({userId:currentUser.id, documentId:id})).id);
    return { deleted: id };
  }
}
