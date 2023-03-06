import { ModuleMetadata } from '@nestjs/common';
import { ConfigurationParameters } from 'openai';

export interface OpenAIModuleOptions extends ConfigurationParameters {}

export interface OpenAIModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<OpenAIModuleOptions> | OpenAIModuleOptions;
  inject?: any[];
}
