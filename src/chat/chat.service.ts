import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAIService } from 'nestjs-openai';
import { ChatMessage, ChatResponse } from './chat.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { MoreThan, Repository } from 'typeorm';
import {
  InjectSlackClient,
  MessageEvent,
  SlackClient,
} from 'nestjs-slack-listener';

@Injectable()
export class ChatService {
  private instruction =
    'You are a helpful assistant, and your name is "Hanch".';
  private chatSessionExpiration = 10 * 60 * 1000; // 10 minutes
  private maxToken = 3000; // 4196 is the max
  private completeTriggers = ['end this chat', 'end chat', 'end conversation'];

  constructor(
    private readonly openai: OpenAIService,
    @InjectSlackClient() private readonly slack: SlackClient,
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
  ) {}

  async completion(messages: ChatMessage[]): Promise<ChatResponse> {
    try {
      const { data } = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      return data;
    } catch (e) {
      if (e.isAxiosError) {
        console.log(e.response.data);
      }
      throw e;
    }
  }

  async chat(event: MessageEvent) {
    const { text, channel } = event;

    const existingChat = await this.chatRepository.findOne({
      where: {
        channel,
        isComplete: false,
        lastMessageAt: MoreThan(
          new Date(Date.now() - this.chatSessionExpiration),
        ),
      },
    });

    const messages = existingChat?.messages ?? [];

    if (existingChat?.totalTokens > this.maxToken) {
      messages.splice(0, 1);
    }

    messages.push({ role: 'user', content: text } as ChatMessage);

    const {
      id: answerId,
      choices: [{ message }],
      usage: { total_tokens, completion_tokens },
    } = await this.completion([
      { role: 'system', content: this.instruction },
      ...messages,
    ]);

    if (!message) {
      throw new InternalServerErrorException('No answer in response');
    }

    const isComplete = this.completeTriggers.some((trigger) =>
      text.includes(trigger),
    );

    const nextMessages = [...messages, message];

    if (existingChat) {
      await this.chatRepository.update(
        { id: existingChat.id },
        {
          messages: nextMessages,
          lastMessageAt: new Date(),
          totalTokens: total_tokens,
          completionTokens: completion_tokens,
          isComplete,
        },
      );
    } else {
      await this.chatRepository.insert({
        id: answerId,
        channel,
        messages: nextMessages,
        lastMessageAt: new Date(),
        totalTokens: total_tokens,
        completionTokens: completion_tokens,
        isComplete,
      });
    }

    await this.slack.chat.postMessage({
      channel: event.channel,
      text: message.content,
    });
  }
}
