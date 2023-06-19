import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  Body,
  Put,
  Delete,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard, Roles } from 'src/guards/role.guard';
import { CuratorService } from 'src/services/curator.service';
import { ICurator } from 'src/types/curator';

@Controller('/curator')
export class CuratorController {
  constructor(private readonly curatorService: CuratorService) {}

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  //Get all Curators
  @Get('/')
  async getCurators(@Res() responce: Response) {
    try {
      const curators: ICurator[] = await this.curatorService.getAllCurators();

      responce.send(curators);
    } catch (e) {
      responce.send(e);
    }
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  //Get curator by id
  @Get('/:id')
  async getCuratorById(
    @Param() param: { id: string },
    @Res() responce: Response,
  ) {
    try {
      const curators: ICurator = await this.curatorService.getCuratorById(
        param.id,
      );
      responce.send(curators);
    } catch (e) {
      responce.send(e);
    }
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  //Create new curator
  @Post('/')
  async createCurator(@Res() response: Response, @Body() body: ICurator) {
    try {
      const curator: ICurator = await this.curatorService.createCurator(body);

      response.send(curator);
    } catch (e) {
      response.send(e);
    }
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  //Update curator
  @Put('/:id')
  async updateCurator(
    @Param() param: { id: string },
    @Body() body: ICurator,
    @Res() response: Response,
  ) {
    try {
      const curator: ICurator = await this.curatorService.updateCurator(
        param.id,
        body,
      );

      response.send(curator);
    } catch (e) {
      response.send(e);
    }
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  //Delete curator
  @Delete('/:id')
  async deleteCurator(
    @Param() param: { id: string },
    @Res() responce: Response,
  ) {
    const result: HttpException = await this.curatorService.deleteCurator(
      param.id,
    );

    responce.send(result);
  }
}
