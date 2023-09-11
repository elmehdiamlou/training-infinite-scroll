import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationEntity } from '../../entities/conversation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(ConversationEntity)
    private conversationRepository: Repository<ConversationEntity>
  ) {}

  async findAll(): Promise<ConversationEntity[]> {
    return this.conversationRepository.find();
  }

  async findOne(id: string): Promise<ConversationEntity> {
    return this.conversationRepository.findOne({ where: { id } });
  }

  async create(
    conversation: Partial<ConversationEntity>
  ): Promise<ConversationEntity> {
    const newconversation = this.conversationRepository.create(conversation);
    return this.conversationRepository.save(newconversation);
  }

  async delete(id: string): Promise<void> {
    await this.conversationRepository.delete(id);
  }
}
