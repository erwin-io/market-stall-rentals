import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { TenantRentContract } from "./TenantRentContract";
import { ContractPayment } from "./ContractPayment";

@Index("ContractBilling_pkey", ["contractBillingId"], { unique: true })
@Entity("ContractBilling", { schema: "dbo" })
export class ContractBilling {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ContractBillingId" })
  contractBillingId: string;

  @Column("character varying", { name: "ContractBillingCode", nullable: true })
  contractBillingCode: string | null;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("timestamp with time zone", {
    name: "DateCreated",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateCreated: Date;

  @Column("timestamp with time zone", {
    name: "DateBilled",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateBilled: Date;

  @Column("numeric", { name: "BillAmount", default: () => "0" })
  billAmount: string;

  @Column("numeric", { name: "OtherCharges", default: () => "0" })
  otherCharges: string;

  @Column("numeric", { name: "TotalBillAmount", default: () => "0" })
  totalBillAmount: string;

  @Column("numeric", { name: "PaymentAmount", default: () => "0" })
  paymentAmount: string;

  @Column("character varying", { name: "Status", default: () => "'PENDING'" })
  status: string;

  @ManyToOne(() => Users, (users) => users.contractBillings)
  @JoinColumn([{ name: "AssignedCollectorId", referencedColumnName: "userId" }])
  assignedCollector: Users;

  @ManyToOne(
    () => TenantRentContract,
    (tenantRentContract) => tenantRentContract.contractBillings
  )
  @JoinColumn([
    {
      name: "TenantRentContractId",
      referencedColumnName: "tenantRentContractId",
    },
  ])
  tenantRentContract: TenantRentContract;

  @ManyToOne(() => Users, (users) => users.contractBillings2)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @OneToMany(
    () => ContractPayment,
    (contractPayment) => contractPayment.contractBilling
  )
  contractPayments: ContractPayment[];
}
