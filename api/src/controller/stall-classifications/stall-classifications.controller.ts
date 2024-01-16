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
import { CreateStallClassificationDto } from "src/core/dto/stall-classifications/stall-classifications.create.dto";
import { UpdateStallClassificationDto } from "src/core/dto/stall-classifications/stall-classifications.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { StallClassifications } from "src/db/entities/StallClassifications";
import { StallClassificationsService } from "src/services/stall-classifications.service";

@ApiTags("stall-classifications")
@Controller("stall-classifications")
export class StallClassificationsController {
  constructor(
    private readonly stallClassificationsService: StallClassificationsService
  ) {}

  @Get("/:stallClassificationsCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(
    @Param("stallClassificationsCode") stallClassificationsCode: string
  ) {
    const res = {} as ApiResponseModel<StallClassifications>;
    try {
      res.data = await this.stallClassificationsService.getByCode(
        stallClassificationsCode
      );
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
    const res: ApiResponseModel<{
      results: StallClassifications[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.stallClassificationsService.getPagination(params);
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
  async create(@Body() stallClassificationsDto: CreateStallClassificationDto) {
    const res: ApiResponseModel<StallClassifications> = {} as any;
    try {
      res.data = await this.stallClassificationsService.create(
        stallClassificationsDto
      );
      res.success = true;
      res.message = `Stall Classifications ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:stallClassificationsCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("stallClassificationsCode") stallClassificationsCode: string,
    @Body() dto: UpdateStallClassificationDto
  ) {
    const res: ApiResponseModel<StallClassifications> = {} as any;
    try {
      res.data = await this.stallClassificationsService.update(
        stallClassificationsCode,
        dto
      );
      res.success = true;
      res.message = `Stall Classifications ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete("/:stallClassificationsCode")
  //   @UseGuards(JwtAuthGuard)
  async delete(
    @Param("stallClassificationsCode") stallClassificationsCode: string
  ) {
    const res: ApiResponseModel<StallClassifications> = {} as any;
    try {
      res.data = await this.stallClassificationsService.delete(
        stallClassificationsCode
      );
      res.success = true;
      res.message = `Stall Classifications ${DELETE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
