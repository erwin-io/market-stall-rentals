import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { TenantRentContract } from "./TenantRentContract";

@Index("ContractBilling_pkey", ["contractBillingId"], { unique: true })
@Entity("ContractBilling", { schema: "dbo" })
export class ContractBilling {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ContractBillingId" })
  contractBillingId: string;

  @Column("character varying", { name: "ContractBillingCode", nullable: true })
  contractBillingCode: string | null;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("date", {
    name: "DateCreated",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateCreated: string;

  @Column("date", {
    name: "DueDate",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dueDate: string;

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
}
