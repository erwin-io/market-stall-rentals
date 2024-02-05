import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TenantRentContract } from "./TenantRentContract";
import { Users } from "./Users";

@Index("ContractPayment_pkey", ["contractPaymentId"], { unique: true })
@Entity("ContractPayment", { schema: "dbo" })
export class ContractPayment {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ContractPaymentId" })
  contractPaymentId: string;

  @Column("character varying", { name: "ContractPaymentCode", nullable: true })
  contractPaymentCode: string | null;

  @Column("timestamp with time zone", {
    name: "DateCreated",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateCreated: Date;

  @Column("timestamp with time zone", {
    name: "DatePaid",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  datePaid: Date;

  @Column("numeric", { name: "TotalDueAmount", default: () => "0" })
  totalDueAmount: string;

  @Column("numeric", { name: "PaymentAmount", default: () => "0" })
  paymentAmount: string;

  @Column("character varying", { name: "Status" })
  status: string;

  @Column("numeric", { name: "OverDueAmount", default: () => "0" })
  overDueAmount: string;

  @ManyToOne(
    () => TenantRentContract,
    (tenantRentContract) => tenantRentContract.contractPayments
  )
  @JoinColumn([
    {
      name: "TenantRentContractId",
      referencedColumnName: "tenantRentContractId",
    },
  ])
  tenantRentContract: TenantRentContract;

  @ManyToOne(() => Users, (users) => users.contractPayments)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;
}
