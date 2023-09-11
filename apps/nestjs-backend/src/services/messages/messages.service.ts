import { Injectable } from '@nestjs/common';
import { MessageEntity } from '../../entities/message.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from '../../entities/page.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>
  ) {}

  async findByConversationId(
    conversationId: string,
    pageNo = 0
  ): Promise<PageDto<MessageEntity>> {
    const pageSize = 10;
    const [messages, totalCount] = await this.messageRepository.findAndCount({
      where: {
        conversation: { id: conversationId },
      },
      order: {
        date: 'DESC',
      },
      skip: +pageNo * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalCount / pageSize);
    const last = (+pageNo + 1) * pageSize > totalCount;

    const pageDto = new PageDto<MessageEntity>({
      content: messages,
      pageNo: +pageNo,
      pageSize,
      totalPages,
      totalElements: totalCount,
      last,
    });

    return pageDto;
  }

  async sendMessage(
    conversationId: string,
    message: string
  ): Promise<MessageEntity> {
    const newmessage = this.messageRepository.create({
      requestmessage: message,
      responsemessage: [{ text: 'response message' }],
      conversation: { id: conversationId },
    });
    return this.messageRepository.save(newmessage);
  }
}
