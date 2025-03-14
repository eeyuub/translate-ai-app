import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { TranslateRequestDto, TranslateResponseDto } from '../dtos/translate-request.dto';

@Injectable()
export class TranslateService {
  private readonly logger = new Logger(TranslateService.name);
  private readonly genAI: GoogleGenerativeAI;
  
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
  }
  
  async translate(request: TranslateRequestDto): Promise<TranslateResponseDto> {
    try {
      const model = this.genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL });
      
      // Use parts to avoid escaping issues with quotes
      const parts = [
        { text: `Translate the following text to ${request.targetLanguage} and detect the original language.\n\nText: ` },
        { text: request.textContent }, // No manual escaping needed when using parts
        { text: `\n\nReturn only a valid JSON object with this format:
          {
            "detectedLanguage": "detected language name",
            "originalTextContent": "original text exactly as provided",
            "targetLanguage": "${request.targetLanguage}",
            "translatedTextContent": "translated text"
          }` }
      ];
      
      const result = await model.generateContent(parts);
      const textResponse = result.response.text();
      
      // Parse JSON response
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from API response');
      }
      
      const translationResult = JSON.parse(jsonMatch[0]);
      return {
        detectedLanguage: translationResult.detectedLanguage,
        originalTextContent: request.textContent,
        targetLanguage: request.targetLanguage,
        translatedTextContent: translationResult.translatedTextContent,
      };
    } catch (error) {
      this.logger.error(`Translation error: ${error.message}`);
      throw error;
    }
  }
}