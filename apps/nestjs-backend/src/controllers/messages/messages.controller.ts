import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { MessageEntity } from '../../entities/message.entity';
import { MessagesService } from '../../services/messages/messages.service';
import { PageDto } from '../../entities/page.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}

  @Post()
  async findByConversationId(
    @Query('pageNo') pageNo: number,
    @Body() { conversationId }: { conversationId: string }
  ): Promise<PageDto<MessageEntity>> {
    return this.messageService.findByConversationId(conversationId, pageNo);
  }

  @Post(':conversationId')
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Body() value: { message: string }
  ): Promise<MessageEntity> {
    const createdMessage = await this.messageService.sendMessage(
      conversationId,
      value.message
    );
    return createdMessage;
  }
}
