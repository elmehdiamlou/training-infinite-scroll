import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
  CreateDateColumn,
} from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  requestmessage: string;

  @Column({ type: 'jsonb' })
  responsemessage: object;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(
    () => ConversationEntity,
    (conversation) => conversation.messages,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'conversation_id' })
  conversation: Relation<ConversationEntity>;
}
