import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Relation,
  CreateDateColumn,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  conversationname: string;

  @CreateDateColumn()
  date: Date;

  @OneToMany(() => MessageEntity, (message) => message.conversation)
  messages: Relation<MessageEntity>[];
}
