import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContractBilling } from "./ContractBilling";
import { RentContractHistory } from "./RentContractHistory";
import { Stalls } from "./Stalls";
import { Users } from "./Users";

@Index("TenantRentContracts_pkey", ["tenantRentContractId"], { unique: true })
@Entity("TenantRentContract", { schema: "dbo" })
export class TenantRentContract {
  @PrimaryGeneratedColumn({ type: "bigint", name: "TenantRentContractId" })
  tenantRentContractId: string;

  @Column("character varying", {
    name: "TenantRentContractCode",
    nullable: true,
  })
  tenantRentContractCode: string | null;

  @Column("timestamp with time zone", {
    name: "DateCreated",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateCreated: Date;

  @Column("timestamp with time zone", {
    name: "DateLastUpdated",
    nullable: true,
  })
  dateLastUpdated: Date | null;

  @Column("timestamp with time zone", {
    name: "DateStart",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateStart: Date;

  @Column("timestamp with time zone", { name: "DateRenew", nullable: true })
  dateRenew: Date | null;

  @Column("numeric", { name: "StallRentAmount", default: () => "0" })
  stallRentAmount: string;

  @Column("numeric", { name: "OtherCharges", default: () => "0" })
  otherCharges: string;

  @Column("numeric", { name: "TotalRentAmount", default: () => "0" })
  totalRentAmount: string;

  @Column("character varying", { name: "Status", default: () => "'ACTIVE'" })
  status: string;

  @Column("character varying", { name: "RenewStatus", nullable: true })
  renewStatus: string | null;

  @OneToMany(
    () => ContractBilling,
    (contractBilling) => contractBilling.tenantRentContract
  )
  contractBillings: ContractBilling[];

  @OneToMany(
    () => RentContractHistory,
    (rentContractHistory) => rentContractHistory.tenantRentContract
  )
  rentContractHistories: RentContractHistory[];

  @ManyToOne(() => Stalls, (stalls) => stalls.tenantRentContracts)
  @JoinColumn([{ name: "StallId", referencedColumnName: "stallId" }])
  stall: Stalls;

  @ManyToOne(() => Users, (users) => users.tenantRentContracts)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;
}
