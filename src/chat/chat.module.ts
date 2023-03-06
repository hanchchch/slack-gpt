import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/enviroment/env.interface';
import { OpenAIModule } from 'src/openai/openai.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    OpenAIModule.registerAsync({
      useFactory: (config: ConfigService<EnvVars>) => ({
        apiKey: config.get('OPENAI_API_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
