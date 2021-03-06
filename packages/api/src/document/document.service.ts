import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentCreate, DocumentUpdate } from '@tr/common';
import { Model } from 'mongoose';
import { Comment } from 'src/comment/comment.model';
import { Vote } from 'src/vote/vote.model';
import { Collaboration } from '../collaboration/collaboration.model';
import { CollaborationService } from '../collaboration/collaboration.service';
import { Request } from '../request/request.model';
import { User } from '../users/user.entity';
import { UserRepository } from '../users/user.repository';
import { UsersService } from '../users/users.service';
import { Document } from './document.model';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel('Document') private readonly documentModel: Model<Document>,
    @InjectModel('Collaboration') private readonly collaborationModel?: Model<Collaboration>,
    @InjectRepository(UserRepository) private userRepository?: UserRepository,
    @InjectModel('Request') private readonly requestModel?: Model<Request>,
    @InjectModel('Vote') private readonly voteModel?: Model<Vote>,
    @InjectModel('Comment') private readonly commentModel?: Model<Comment>,
  ) {}

  async createDocument(user: User, doc: DocumentCreate) {
    const newDocument = new this.documentModel(doc);
    newDocument.owner = user.id;
    newDocument._history =[{ id:newDocument._id.toString(), status: "created", title:"Initial Commit 🎉", body: doc.body, user: user.username, time: new Date()}]
    await new CollaborationService(this.collaborationModel).joinTeam(
      user,
      newDocument._id,
      true,
    );
    await newDocument.save();
    return { document: newDocument };
  }

  async getDocument() {
    const docs = await this.documentModel.find().exec();
    return await docs.map(doc => ({
      id: doc.id,
      title: doc.title,
      body: doc.body,
      owner: doc.owner,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  }

  async getDocumentById(id: string) {
    let doc;
    let username;
    try {
      doc = await this.documentModel.findById(id).exec();
      username = (
        await new UsersService(this.userRepository, null).getUserById(doc.owner)
      ).username;
    } catch (error) {
      throw new NotFoundException();
    }
    if (!doc) {
      throw new NotFoundException();
    } else {
      return { ...doc._doc, username };
    }
  }

  async getDocumentByOwner(owner: string) {
    const docs = await this.documentModel.find({ owner: owner }).exec();
    return docs.map(doc => ({
      id: doc.id,
      title: doc.title,
      createdAt: doc.createdAt,
      body: doc.body,
      owner: doc.owner,
    }));
  }

  async getCollaborationRequests(owner: string) {
    const docs = await this.getDocumentByOwner(owner);
    const ids: string[] = docs.map(doc => doc.id);

    const requests = await Promise.all(
      ids.map(
        async id =>
          await new CollaborationService(
            this.collaborationModel,
            this.userRepository,
            this.documentModel,
          ).collaborationRequests(id),
      ),
    );
    return requests.reduce((acc, request) => {
      return {
        ...acc,
        ...request,
      };
    }, {});
  }

  async getFollowers(owner: string) {
    const docs = await this.getDocumentByOwner(owner);
    const ids: string[] = docs.map(doc => doc.id);

    const followers = Promise.all(
      ids.map(
        async id =>
          +(await new CollaborationService(
            this.collaborationModel,
            this.userRepository,
          ).teamCount(id)) - 1,
      ),
    );
    return (await followers).reduce((a, b) => a + b, 0);
  }

  async updateDocument(user: User, id: string, update: DocumentUpdate) {
  
  const doc = await this.getDocumentById(id);

    if(update.reqId == undefined)
    {
      throw new UnauthorizedException(
        'No Update Request Matching',
      );
    }
    if (doc.owner != user.id) {
      throw new UnauthorizedException(
        'You have to be the owner to Update this document',
      );
    }
    else
   {
     const title = await (await this.requestModel.findOne({_id:update.reqId})).title;
     const uid = await (await this.requestModel.findOne({_id:update.reqId})).userId;
     const username = await (await this.userRepository.findOne({id: uid})).username;
     await this.documentModel.updateOne({_id:id},{body:update.body, $push: {_history: { id:update.reqId, status: "updated", title:title,body: update.body, user:username, time: new Date()}}})
     await this.requestModel.deleteMany({_id:update.reqId})
     await this.voteModel.deleteMany({requestId:update.reqId})
     await this.commentModel.deleteMany({requestId:update.reqId})
   }
  }

  async deleteDocument(user: User, id: string) {
    const doc = await this.getDocumentById(id);
    if (doc.owner != user.id) {
      throw new UnauthorizedException(
        'You have to be the owner to Delete this document',
      );
    }
    const del = await this.documentModel.deleteOne({ _id: id }).exec();
    if (del.n === 0) {
      throw new NotFoundException();
    }
  }

  async isOwner(currentUser: User, docId: string) {
    const isOwner = (await this.documentModel.findOne({
      _id: docId,
      owner: currentUser.id,
    }))
      ? true
      : false;
    return isOwner;
  }

  async getDocumentByIds(ids: string[]) {
    const docs=  await this.documentModel.find({_id:{$in:ids}})
    return docs.map(doc => ({
      id: doc.id,
      title: doc.title,
      createdAt: doc.createdAt,
      body: doc.body,
      owner: doc.owner,
    }));
  }

  async getDocumentHistory(id: string) {
    const doc=  await this.documentModel.findById(id)
    return doc._history.reverse();
  }

  async getDocumentSnapshot(currentUser: User, docId: string, histId:string) {
    const docHistory=  await this.getDocumentHistory(docId);
    const snapshot = docHistory.find(snapshot=>snapshot.id === histId)
    return snapshot;
  }
}
