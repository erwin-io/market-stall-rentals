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
import { PaginationParamsDto } from "src/core/dto/pagination-params.dto";
import { ApiResponseModel } from "src/core/models/api-response.model";
import { ContractPaymentService } from "src/services/contract-payment.service";
import { ContractPayment } from "src/db/entities/ContractPayment";
import { CreateContractPaymentDto } from "src/core/dto/contract-payment/contract-payment.create.dto";
import { UpdateContractPaymentStatusDto } from "src/core/dto/contract-payment/contract-payment.update.create.dto";

@ApiTags("contract-payment")
@Controller("contract-payment")
export class ContractPaymentController {
  constructor(
    private readonly contractPaymentService: ContractPaymentService
  ) {}

  @Get("getByCode/:contractPaymentCode")
  //   @UseGuards(JwtAuthGuard)
  async getByCode(@Param("contractPaymentCode") contractPaymentCode: string) {
    const res = {} as ApiResponseModel<ContractPayment>;
    try {
      res.data = await this.contractPaymentService.getByCode(
        contractPaymentCode
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
    const res: ApiResponseModel<{ results: ContractPayment[]; total: number }> =
      {} as any;
    try {
      res.data = await this.contractPaymentService.getPagination(params);
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
  async create(@Body() contractPaymentDto: CreateContractPaymentDto) {
    const res: ApiResponseModel<ContractPayment> = {} as any;
    try {
      res.data = await this.contractPaymentService.create(contractPaymentDto);
      res.success = true;
      res.message = `Contract payment ${SAVING_SUCCESS}`;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  // @Put("updateStatus/:contractPaymentCode")
  // //   @UseGuards(JwtAuthGuard)
  // async update(
  //   @Param("contractPaymentCode") contractPaymentCode: string,
  //   @Body() dto: UpdateContractPaymentStatusDto
  // ) {
  //   const res: ApiResponseModel<ContractPayment> = {} as any;
  //   try {
  //     res.data = await this.contractPaymentService.update(
  //       contractPaymentId,
  //       dto
  //     );
  //     res.success = true;
  //     res.message = `Stall ${UPDATE_SUCCESS}`;
  //     return res;
  //   } catch (e) {
  //     res.success = false;
  //     res.message = e.message !== undefined ? e.message : e;
  //     return res;
  //   }
  // }
}
