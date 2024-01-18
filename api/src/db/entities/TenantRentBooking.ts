import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { Stalls } from "./Stalls";

@Entity("TenantRentBooking", { schema: "dbo" })
export class TenantRentBooking {
  @PrimaryGeneratedColumn({ type: "bigint", name: "TenantRentBookingId" })
  tenantRentBookingId: string;

  @Column("character varying", {
    name: "TenantRentBookingCode",
    nullable: true,
  })
  tenantRentBookingCode: string | null;

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
    name: "DatePreferedStart",
    default: () => "(now() AT TIME ZONE 'Asia/Manila')",
  })
  datePreferedStart: string;

  @Column("character varying", { name: "Status", default: () => "'PENDING'" })
  status: string;

  @ManyToOne(() => Users, (users) => users.tenantRentBookings)
  @JoinColumn([{ name: "RequestedByUserId", referencedColumnName: "userId" }])
  requestedByUser: Users;

  @ManyToOne(() => Stalls, (stalls) => stalls.tenantRentBookings)
  @JoinColumn([{ name: "StallId", referencedColumnName: "stallId" }])
  stall: Stalls;
}
