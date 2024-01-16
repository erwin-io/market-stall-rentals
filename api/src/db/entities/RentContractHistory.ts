import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TenantRentContract } from "./TenantRentContract";

@Index("RentContractHistory_pkey", ["rentContractHistoryId"], { unique: true })
@Entity("RentContractHistory", { schema: "dbo" })
export class RentContractHistory {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RentContractHistoryId" })
  rentContractHistoryId: string;

  @Column("timestamp with time zone", {
    name: "DateChanged",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateChanged: Date;

  @Column("timestamp with time zone", {
    name: "Date",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  date: Date;

  @Column("timestamp with time zone", {
    name: "DateRenew",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateRenew: Date;

  @Column("numeric", { name: "StallRentAmount", default: () => "0" })
  stallRentAmount: string;

  @Column("numeric", { name: "OtherCharges", default: () => "0" })
  otherCharges: string;

  @Column("numeric", { name: "TotalRentAmount", default: () => "0" })
  totalRentAmount: string;

  @Column("character varying", { name: "Status" })
  status: string;

  @Column("character varying", { name: "RenewStatus" })
  renewStatus: string;

  @ManyToOne(
    () => TenantRentContract,
    (tenantRentContract) => tenantRentContract.rentContractHistories
  )
  @JoinColumn([
    {
      name: "TenantRentContractId",
      referencedColumnName: "tenantRentContractId",
    },
  ])
  tenantRentContract: TenantRentContract;
}
