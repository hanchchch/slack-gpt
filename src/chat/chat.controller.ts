import { Controller } from '@nestjs/common';
import {
  IncomingSlackEvent,
  MessageEvent,
  SlackEventHandler,
  SlackEventListener,
} from 'nestjs-slack-listener';
import { ChatService } from './chat.service';

@Controller('chat')
@SlackEventListener()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @SlackEventHandler('message')
  async onMessage({ event }: IncomingSlackEvent<MessageEvent>) {
    this.chatService.chat(event); // since inference takes pretty much of time, Slack will time out and try same request again
    return 'ok';
  }
}
