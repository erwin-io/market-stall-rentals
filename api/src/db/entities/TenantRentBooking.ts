import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Stalls } from "./Stalls";
import { Users } from "./Users";

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

  @ManyToOne(() => Stalls, (stalls) => stalls.tenantRentBookings)
  @JoinColumn([{ name: "StallId", referencedColumnName: "stallId" }])
  stall: Stalls;

  @ManyToOne(() => Users, (users) => users.tenantRentBookings)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;
}
