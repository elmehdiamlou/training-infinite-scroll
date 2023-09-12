import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ConversationsService } from '../../services/conversations/conversations.service';
import { ConversationEntity } from '../../entities/conversation.entity';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationService: ConversationsService) {}

  @Get()
  async findAll(): Promise<ConversationEntity[]> {
    return this.conversationService.findAll();
  }

  @Post()
  @HttpCode(201)
  async create(
    @Body() conversation: ConversationEntity
  ): Promise<ConversationEntity> {
    const createdConversation = await this.conversationService.create(
      conversation
    );
    return createdConversation;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    const conversation = await this.conversationService.findOne(id);

    if (!conversation) {
      throw new NotFoundException('Conversation does not exist!');
    }

    await this.conversationService.delete(id);
    return { message: 'Conversation deleted successfully' };
  }
}
