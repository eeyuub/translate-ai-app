import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { TranslateService } from '../services/translate.service';
import { TranslateRequestDto, TranslateResponseDto } from '../dtos/translate-request.dto';

@Controller()
export class TranslateController {
  constructor(
    private readonly httpService: HttpService,
    private readonly translateService: TranslateService) { }



  @Post('translate')
  async translate(@Body() request: TranslateRequestDto) : Promise<TranslateResponseDto> {
    try {
      return await this.translateService.translate(request);
    } catch (error) {
      throw new HttpException(
        { error: `Translation failed: ${error.message}` },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

