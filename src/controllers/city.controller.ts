import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CityService } from 'src/services/city.service';
import { ICity } from 'src/types/city';

@Controller('/city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @UseGuards(AuthGuard)
  //Get all City
  @Get('/')
  async getAllCity(@Res() responce: Response) {
    try {
      const cities: ICity[] = await this.cityService.getCities();
      responce.send(cities);
    } catch (e) {
      responce.send(e);
    }
  }

  @UseGuards(AuthGuard)
  //Get by id city
  @Get('/:id')
  async getCityById(@Param() param: { id: string }, @Res() responce: Response) {
    try {
      const { id } = param;
      const city: ICity | HttpException = await this.cityService.getCity(id);

      responce.send(city);
    } catch (e) {
      responce.send(e);
    }
  }

  @UseGuards(AuthGuard)
  //Create new city
  @Post('/')
  @UseInterceptors(FileInterceptor('image'))
  async createNewCity(
    @Res() responce: Response,
    @Body() body: ICity,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      const imageUrl: string = image.path;
      console.log(imageUrl);
      const city = await this.cityService.createCity(body, imageUrl);
      responce.send(city);
    } catch (e) {
      responce.send(e);
    }
  }

  @UseGuards(AuthGuard)
  //UpdateCity
  @Put('/:id')
  @UseInterceptors(FileInterceptor('image'))
  async updateCity(
    @Param() param: { id: string },
    @Res() responce: Response,
    @Body() body: ICity,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      const id: string = param.id;
      const imageUrl: string = image?.path;
      const city: ICity | HttpException = await this.cityService.updateCity(
        id,
        body,
        imageUrl,
      );

      responce.send(city);
    } catch (e) {
      responce.send(e);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deleteCity(@Param() param: { id: string }, @Res() responce: Response) {
    try {
      const id: string = param.id;
      const result: HttpException = await this.cityService.deleteCity(id);

      responce.send(result);
    } catch (e) {
      responce.send(e);
    }
  }
}
