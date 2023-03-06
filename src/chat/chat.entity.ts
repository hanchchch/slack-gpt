import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
} from 'typeorm';
import { ChatMessage } from './chat.type';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  channel: string;

  @Column()
  totalTokens: number;

  @Column()
  completionTokens: number;

  @Column({ default: false })
  isComplete: boolean;

  @Column({ type: 'json' })
  messages: ChatMessage[];

  @Column({ type: 'timestamptz' })
  lastMessageAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
