import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import {
  DELETE_SUCCESS,
  SAVING_SUCCESS,
  UPDATE_SUCCESS,
} from "src/common/constant/api-response.constant";
import { CreateTenantRentBookingDto } from "src/core/dto/tenant-rent-booking/tenant-rent-booking.create.dto";
import {
  UpdateTenantRentBookingDto,
  UpdateTenantRentBookingStatusDto,
} from "src/core/dto/tenant-rent-booking/tenant-rent-booking.update.dto";
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { TenantRentBooking } from "src/db/entities/TenantRentBooking";
import { TenantRentBookingService } from "src/services/tenant-rent-booking.service";

@ApiTags("tenant-rent-booking")
@Controller("tenant-rent-booking")
export class TenantRentBookingController {
  constructor(
    private readonly tenantRentBookingService: TenantRentBookingService
  ) {}

  @Get("/:tenantRentBookingCode")
  //   @UseGuards(JwtAuthGuard)
  async getDetails(
    @Param("tenantRentBookingCode") tenantRentBookingCode: string
  ) {
    const res = {} as ApiResponseModel<TenantRentBooking>;
    try {
      res.data = await this.tenantRentBookingService.getByCode(
        tenantRentBookingCode
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
      results: TenantRentBooking[];
      total: number;
    }> = {} as any;
    try {
      res.data = await this.tenantRentBookingService.getPagination(params);
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
  async create(@Body() tenantRentBookingDto: CreateTenantRentBookingDto) {
    const res: ApiResponseModel<TenantRentBooking> = {} as any;
    try {
      res.data = await this.tenantRentBookingService.create(
        tenantRentBookingDto
      );
      res.success = true;
      res.message = `Tenant Rent Booking ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/:tenantRentBookingCode")
  //   @UseGuards(JwtAuthGuard)
  async update(
    @Param("tenantRentBookingCode") tenantRentBookingCode: string,
    @Body() dto: UpdateTenantRentBookingDto
  ) {
    const res: ApiResponseModel<TenantRentBooking> = {} as any;
    try {
      res.data = await this.tenantRentBookingService.update(
        tenantRentBookingCode,
        dto
      );
      res.success = true;
      res.message = `Tenant Rent Booking ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/updateStatus/:tenantRentBookingCode")
  //   @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param("tenantRentBookingCode") tenantRentBookingCode: string,
    @Body() dto: UpdateTenantRentBookingStatusDto
  ) {
    const res: ApiResponseModel<TenantRentBooking> = {} as any;
    try {
      res.data = await this.tenantRentBookingService.updateStatus(
        tenantRentBookingCode,
        dto
      );
      res.success = true;
      res.message = `Tenant Rent Booking status ${UPDATE_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
