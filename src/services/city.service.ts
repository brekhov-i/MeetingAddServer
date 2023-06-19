import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { unlink } from 'fs';
import { Document, Model } from 'mongoose';
import { City } from 'src/schemas/city.schema';
import { ICity } from 'src/types/city';

@Injectable()
export class CityService {
  constructor(@InjectModel(City.name) private cityModel: Model<City>) {}

  async getCities(): Promise<ICity[]> {
    const cities: ICity[] = await this.cityModel.find();

    return cities;
  }

  async getCity(id: string): Promise<ICity | HttpException> {
    const city: ICity = await this.cityModel.findById(id);

    if (city) {
      return city;
    } else {
      throw new HttpException('Город не найден', HttpStatus.NOT_FOUND);
    }
  }

  //Create City
  async createCity(
    cityData: ICity,
    imageUrl: string,
  ): Promise<ICity | HttpException> {
    const candidate = await this.cityModel.findOne({ name: cityData.name });

    if (!candidate) {
      const newCity: Document<any, any, ICity> = new this.cityModel({
        name: cityData.name,
        image: imageUrl,
        chatLink: cityData.chatLink,
      });

      return await newCity
        .save()
        .then(() => {
          return newCity;
        })
        .catch((err) => {
          return err;
        });
    } else {
      throw new HttpException(
        'Город с таким названием уже создан',
        HttpStatus.NOT_IMPLEMENTED,
      );
    }
  }

  //Update City
  async updateCity(
    id: string,
    cityData: ICity,
    imageUrl: string,
  ): Promise<ICity | HttpException> {
    const city: ICity = await this.cityModel.findById(id);

    if (city) {
      let image: string = imageUrl;
      if (imageUrl) {
        unlink(city.image, (error) => {
          if (error) console.log(error);
        });
        image = imageUrl;
      } else {
        image = city.image;
      }

      await this.cityModel.updateOne(
        { _id: id },
        {
          ...cityData,
          image: image,
        },
      );

      const cityUpdated: ICity = await this.cityModel.findById(id);

      return cityUpdated;
    } else {
      throw new HttpException('Город не найден', HttpStatus.NOT_FOUND);
    }
  }

  //Delete City
  async deleteCity(id: string): Promise<HttpException> {
    const city = await this.cityModel.findById(id);
    unlink(city.image, (error) => {
      if (error) console.log(error);
    });
    await this.cityModel.deleteOne({ _id: id });

    throw new HttpException('Город удален', HttpStatus.OK);
  }
}
