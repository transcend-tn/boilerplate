import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { UnauthorizedException } from '@nestjs/common/exceptions/unauthorized.exception';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentCreate } from '@tr/common';
import { Model } from 'mongoose';
import { User } from '../users/user.entity';
import { Document } from './document.model';
import { Collaboration } from '../collaboration/collaboration.model';
import { CollaborationService } from '../collaboration/collaboration.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { UsersService } from '../users/users.service';

@Injectable()
export class DocumentService {
  constructor(
    @InjectModel('Document') private readonly documentModel: Model<Document>,
    @InjectModel('Collaboration')
    private readonly collaborationModel?: Model<Collaboration>,
    @InjectRepository(UserRepository)
    private userRepository?: UserRepository,
  ) {}

  async createDocument(user: User, doc: DocumentCreate) {
    const newDocument = new this.documentModel(doc);
    newDocument.owner = user.id;
    await new CollaborationService(this.collaborationModel).joinTeam(user,newDocument._id,true);
    await newDocument.save();
    return {document:newDocument}
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
      username = (await new UsersService(this.userRepository,null).getUserById(doc.owner)).username;
    } catch (error) {
      throw new NotFoundException();
    }
    if (!doc) {
      throw new NotFoundException();
    } else {
      return {...doc._doc, username} ;
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

  async getCollaborationRequests(owner: string) 
  { 
    const docs = await this.getDocumentByOwner(owner); 
    const ids:string[]=docs.map((doc)=>doc.id); 
    
    const requests= Promise.all(ids.map(async (id)=> await new CollaborationService(this.collaborationModel,this.userRepository).collaborationRequests(id)));
    return requests;  
  } 

  async getFollowers(owner: string) 
  { 
    const docs = await this.getDocumentByOwner(owner); 
    const ids:string[]=docs.map((doc)=>doc.id); 
    
    const followers= Promise.all(ids.map(async (id)=> + await new CollaborationService(this.collaborationModel,this.userRepository).teamCount(id)-1));
    return ((await followers).reduce((a, b) => a + b, 0))

     
  }  

  async updateDocument(user: User, id: string, update: DocumentCreate) {
    const doc = await this.getDocumentById(id);
    if (doc.owner != user.id) {
      throw new UnauthorizedException(
        'You have to be the owner to Update this document',
      );
    }
    if (update.title) {
      doc.title = update.title;
    }
    if (update.body) {
      doc.body = update.body;
    }
    doc.save();
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

  async isOwner(currentUser:User, docId:string)
  {
    const isOwner = await this.documentModel.findOne({_id:docId, owner:currentUser.id})?true:false;
    return isOwner;
  }
}
