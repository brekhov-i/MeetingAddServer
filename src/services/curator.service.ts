import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { City } from 'src/schemas/city.schema';
import { Curator } from 'src/schemas/curator.schema';
import { ICity } from 'src/types/city';
import { ICurator } from 'src/types/curator';

@Injectable()
export class CuratorService {
  constructor(
    @InjectModel(Curator.name) private curatorModel: Model<Curator>,
    @InjectModel(City.name) private cityModel: Model<City>,
  ) {}

  //Get all curators
  async getAllCurators(): Promise<ICurator[]> {
    return await this.curatorModel.find();
  }

  //Get curator by id
  async getCuratorById(id: string): Promise<ICurator> {
    const curator: ICurator = await this.curatorModel.findById(id);
    if (curator) {
      return curator;
    } else {
      throw new HttpException('Куратор не найден', HttpStatus.NOT_FOUND);
    }
  }

  //Create new curator
  async createCurator(curatorData: ICurator): Promise<ICurator> {
    const candidate: ICurator | null = await this.curatorModel.findOne({
      name: curatorData.name,
    });

    if (!candidate) {
      const city: ICity = await this.cityModel.findById(curatorData.city);
      const newCurator: Document<any, any, ICurator> = new this.curatorModel({
        name: curatorData.name,
        city,
      });

      return await newCurator.save().then(() => {
        return this.curatorModel.findById(newCurator.id);
      });
    } else {
      throw new HttpException(
        `Куратор ${curatorData.name} уже существует`,
        HttpStatus.CONFLICT,
      );
    }
  }

  //Update curator
  async updateCurator(id: string, curatorData: ICurator): Promise<ICurator> {
    const candidate: ICurator = await this.curatorModel.findById(id);
    const cityId: string = candidate.city;
    let city = await this.cityModel.findById(cityId);

    if (curatorData.city) {
      city = await this.cityModel.findById(curatorData.city);
    }

    await this.curatorModel.updateOne(
      { _id: id },
      {
        name: curatorData.name,
        city,
      },
    );

    const curator: ICurator = await this.curatorModel.findById(id);

    return curator;
  }

  //Delete curator
  async deleteCurator(id: string): Promise<HttpException> {
    const curator: ICurator = await this.curatorModel.findById(id);
    await this.curatorModel.deleteOne({ _id: id });

    throw new HttpException(`Куратор ${curator.name} удален`, HttpStatus.OK);
  }
}
