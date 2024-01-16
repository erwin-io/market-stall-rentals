import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ContractBilling } from "./ContractBilling";
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

  @Column("numeric", { name: "TotalBillAmount", default: () => "0" })
  totalBillAmount: string;

  @Column("numeric", { name: "PaymentAmount", default: () => "0" })
  paymentAmount: string;

  @Column("character varying", { name: "Status" })
  status: string;

  @ManyToOne(
    () => ContractBilling,
    (contractBilling) => contractBilling.contractPayments
  )
  @JoinColumn([
    { name: "ContractBillingId", referencedColumnName: "contractBillingId" },
  ])
  contractBilling: ContractBilling;

  @ManyToOne(() => Users, (users) => users.contractPayments)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;
}
