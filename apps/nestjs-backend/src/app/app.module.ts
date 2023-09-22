import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ConversationsController } from '../controllers/conversations/conversations.controller';
import { MessagesController } from '../controllers/messages/messages.controller';
import { ConversationsService } from '../services/conversations/conversations.service';
import { MessagesService } from '../services/messages/messages.service';
import { ConversationEntity } from '../entities/conversation.entity';
import { MessageEntity } from '../entities/message.entity';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationsController } from '../controllers/notifications/notifications.controller';
import { NotificationsService } from '../services/notifications/notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConversationEntity,
      MessageEntity,
      NotificationEntity,
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        type: 'postgres',
        url: `postgres://peaqock:peaqock@localhost:5432/infinite-scroll`,
        entities: [ConversationEntity, MessageEntity, NotificationEntity],
        synchronize: true,
        migrationsRun: true,
      }),
    }),
  ],
  controllers: [
    ConversationsController,
    MessagesController,
    NotificationsController,
  ],
  providers: [ConversationsService, MessagesService, NotificationsService],
})
export class AppModule {}
