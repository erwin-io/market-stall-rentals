import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { StallClassifications } from "./StallClassifications";
import { TenantRentBooking } from "./TenantRentBooking";
import { TenantRentContract } from "./TenantRentContract";

@Index("u_stallcode", ["active", "stallCode"], { unique: true })
@Index("u_stall", ["active", "name"], { unique: true })
@Index("Stalls_pkey", ["stallId"], { unique: true })
@Entity("Stalls", { schema: "dbo" })
export class Stalls {
  @PrimaryGeneratedColumn({ type: "bigint", name: "StallId" })
  stallId: string;

  @Column("character varying", { name: "StallCode", nullable: true })
  stallCode: string | null;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("character varying", { name: "AreaName" })
  areaName: string;

  @Column("numeric", { name: "StallRentAmount", default: () => "0" })
  stallRentAmount: string;

  @Column("character varying", { name: "Status", default: () => "'AVAILABLE'" })
  status: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @Column("timestamp with time zone", {
    name: "DateAdded",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  dateAdded: Date;

  @Column("timestamp with time zone", {
    name: "DateLastUpdated",
    nullable: true,
  })
  dateLastUpdated: Date | null;

  @ManyToOne(
    () => StallClassifications,
    (stallClassifications) => stallClassifications.stalls
  )
  @JoinColumn([
    {
      name: "StallClassificationId",
      referencedColumnName: "stallClassificationId",
    },
  ])
  stallClassification: StallClassifications;

  @OneToMany(
    () => TenantRentBooking,
    (tenantRentBooking) => tenantRentBooking.stall
  )
  tenantRentBookings: TenantRentBooking[];

  @OneToMany(
    () => TenantRentContract,
    (tenantRentContract) => tenantRentContract.stall
  )
  tenantRentContracts: TenantRentContract[];
}
