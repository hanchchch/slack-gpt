import { Injectable } from '@nestjs/common';
import { isAxiosError } from 'axios';
import {
  InjectSlackClient,
  MessageEvent,
  SlackClient,
} from 'nestjs-slack-listener';
import { CreateChatCompletionRequest } from 'openai';
import { OpenAIService } from 'nestjs-openai';

@Injectable()
export class ChatService {
  constructor(
    private readonly openai: OpenAIService,
    @InjectSlackClient() private readonly slack: SlackClient,
  ) {}

  async completion(
    messages: CreateChatCompletionRequest['messages'],
  ): Promise<string> {
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
      return data.choices[0].message.content;
    } catch (e) {
      if (isAxiosError(e)) {
        console.log('error', e.response.data);
      }
      throw e;
    }
  }

  async chat(event: MessageEvent) {
    const { text } = event;
    const answer = await this.completion([
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: text },
    ]);
    await this.slack.chat.postMessage({
      channel: event.channel,
      text: answer,
    });
  }
}
