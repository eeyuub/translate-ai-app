import { IsNotEmpty, IsString } from 'class-validator';

export class TranslateRequestDto {
  @IsNotEmpty()
  @IsString()
  textContent: string;

  @IsNotEmpty()
  @IsString()
  targetLanguage: string;
}

// translate-response.dto.ts
export class TranslateResponseDto {
  detectedLanguage: string;
  originalTextContent: string;
  targetLanguage: string;
  translatedTextContent: string;
}