import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiQuery, ApiTags } from "@nestjs/swagger";
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import {
  CreateTenantRentContracFromBookingtDto,
  CreateTenantRentContractDto,
} from "src/core/dto/tenant-rent-contract/tenant-rent-contract.create.dto";
import {
  UpdateTenantRentContractDto,
  UpdateTenantRentContractStatusDto,
} from "src/core/dto/tenant-rent-contract/tenant-rent-contract.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { TenantRentContract } from "src/db/entities/TenantRentContract";
import { TenantRentContractService } from "src/services/tenant-rent-contract.service";

@ApiTags("tenant-rent-contract")
@Controller("tenant-rent-contract")
export class TenantRentContractController {
  constructor(
    private readonly tenantRentContractService: TenantRentContractService
  ) {}

  @Get("/getAllByCollectorUserCode")
  @ApiQuery({
    name: "collectorUserCode",
    description: "Collector user code",
    required: true,
    type: String,
  })
  @ApiQuery({
    name: "date",
    description: "Date",
    required: true,
    type: Date,
  })
  async getAllByCollectorUserCode(
    @Query("collectorUserCode") collectorUserCode,
    @Query("date") date
  ) {
    const res = {} as ApiResponseModel<any[]>;
    try {
      res.data = await this.tenantRentContractService.getAllByCollectorUserCode(
        collectorUserCode,
        date
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("/getAllByTenantUserCode/:tenantUserCode")
  async getAllByTenantUserCode(
    @Param("tenantUserCode") tenantUserCode: string
  ) {
    const res = {} as ApiResponseModel<any[]>;
    try {
      res.data = await this.tenantRentContractService.getAllByTenantUserCode(
        tenantUserCode
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("/:tenantRentContractCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(
    @Param("tenantRentContractCode") tenantRentContractCode: string
  ) {
    const res = {} as ApiResponseModel<TenantRentContract>;
    try {
      res.data = await this.tenantRentContractService.getByCode(
        tenantRentContractCode
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
      results: TenantRentContract[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.tenantRentContractService.getPagination(params);
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
  async create(@Body() dto: CreateTenantRentContractDto) {
    const res: ApiResponseModel<TenantRentContract> = {} as any;
    try {
      res.data = await this.tenantRentContractService.create(dto);
      res.success = true;
      res.message = `Tenant Rent Contract ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/createFromBooking")
  //   @UseGuards(JwtAuthGuard)
  async createFromBooking(@Body() dto: CreateTenantRentContracFromBookingtDto) {
    const res: ApiResponseModel<TenantRentContract> = {} as any;
    try {
      res.data = await this.tenantRentContractService.createFromBooking(dto);
      res.success = true;
      res.message = `Tenant Rent Contract ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateStatus/:tenantRentContractCode")
  //   @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("tenantRentContractCode") tenantRentContractCode: string,
    @Body() dto: UpdateTenantRentContractStatusDto
  ) {
    const res: ApiResponseModel<TenantRentContract> = {} as any;
    try {
      res.data = await this.tenantRentContractService.updateStatus(
        tenantRentContractCode,
        dto
      );
      res.success = true;
      res.message = `Tenant Rent Contract status ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
