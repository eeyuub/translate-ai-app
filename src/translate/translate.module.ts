import { GoogleGenerativeAI } from '@google/generative-ai';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TranslateService } from './services/translate.service';    
import { TranslateController } from './controllers/translate.controller';

@Module({
  imports: [HttpModule, GoogleGenerativeAI],
  controllers: [TranslateController],
  providers: [TranslateService],
})

export class TranslateModule {}
