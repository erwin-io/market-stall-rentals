import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { CreateStallDto } from "src/core/dto/stalls/stall.create.dto";
import { UpdateStallDto } from "src/core/dto/stalls/stall.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { StallsService } from "src/services/stalls.service";
import { Stalls } from "src/db/entities/Stalls";

@ApiTags("stalls")
@Controller("stalls")
export class StallController {
  constructor(private readonly stallService: StallsService) {}

  @Get("getByCode/:stallCode")
  //   @UseGuards(JwtAuthGuard)
  async getByCode(@Param("stallCode") stallCode: string) {
    const res = {} as ApiResponseModel<Stalls>;
    try {
      res.data = await this.stallService.getByCode(stallCode);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("/:stallId")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(@Param("stallId") stallId: string) {
    const res = {} as ApiResponseModel<Stalls>;
    try {
      res.data = await this.stallService.getById(stallId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/page")
  //   @UseGuards(JwtAuthGuard)
  async getPaginated(@Body() params: PaginationParamsDto) {
    const res: ApiResponseModel<{ results: Stalls[]; total: number }> =
      {} as any;
    try {
      res.data = await this.stallService.getPagination(params);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  //   @UseGuards(JwtAuthGuard)
  async create(@Body() stallDto: CreateStallDto) {
    const res: ApiResponseModel<Stalls> = {} as any;
    try {
      res.data = await this.stallService.create(stallDto);
      res.success = true;
      res.message = `Stall ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:stallId")
  //   @UseGuards(JwtAuthGuard)
  async update(@Param("stallId") stallId: string, @Body() dto: UpdateStallDto) {
    const res: ApiResponseModel<Stalls> = {} as any;
    try {
      res.data = await this.stallService.update(stallId, dto);
      res.success = true;
      res.message = `Stall ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:stallId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("stallId") stallId: string) {
    const res: ApiResponseModel<Stalls> = {} as any;
    try {
      res.data = await this.stallService.delete(stallId);
      res.success = true;
      res.message = `Stall ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
