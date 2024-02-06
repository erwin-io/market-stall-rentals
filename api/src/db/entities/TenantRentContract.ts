import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContractPayment } from "./ContractPayment";
import { RentContractHistory } from "./RentContractHistory";
import { Users } from "./Users";
import { Stalls } from "./Stalls";

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

  @Column("date", {
    name: "DateStart",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateStart: string;

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

  @Column("character varying", { name: "StallRateCode" })
  stallRateCode: string;

  @Column("date", {
    name: "CurrentDueDate",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  currentDueDate: string;

  @OneToMany(
    () => ContractPayment,
    (contractPayment) => contractPayment.tenantRentContract
  )
  contractPayments: ContractPayment[];

  @OneToMany(
    () => RentContractHistory,
    (rentContractHistory) => rentContractHistory.tenantRentContract
  )
  rentContractHistories: RentContractHistory[];

  @ManyToOne(() => Users, (users) => users.tenantRentContracts)
  @JoinColumn([
    { name: "AssignedCollectorUserId", referencedColumnName: "userId" },
  ])
  assignedCollectorUser: Users;

  @ManyToOne(() => Stalls, (stalls) => stalls.tenantRentContracts)
  @JoinColumn([{ name: "StallId", referencedColumnName: "stallId" }])
  stall: Stalls;

  @ManyToOne(() => Users, (users) => users.tenantRentContracts2)
  @JoinColumn([{ name: "TenantUserId", referencedColumnName: "userId" }])
  tenantUser: Users;
}
