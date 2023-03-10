import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVars } from 'src/enviroment/env.interface';
import { OpenAIModule } from 'nestjs-openai';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
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
