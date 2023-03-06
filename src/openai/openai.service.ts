import { Inject, Injectable } from '@nestjs/common';
import { OpenAIApi, Configuration } from 'openai';
import { OpenAIModuleOptions } from './module-options.interface';
import { OPENAI_CONFIG_OPTIONS } from './openai.symbol';

@Injectable()
export class OpenAIService extends OpenAIApi {
  constructor(@Inject(OPENAI_CONFIG_OPTIONS) config: OpenAIModuleOptions) {
    super(new Configuration(config));
  }
}
