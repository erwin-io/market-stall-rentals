import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Stalls } from "./Stalls";

@Index("StallRate_pkey", ["rateCode", "stallId"], { unique: true })
@Index("u_stallrate_stall", ["rateCode", "stallId"], { unique: true })
@Entity("StallRate", { schema: "dbo" })
export class StallRate {
  @Column("bigint", { primary: true, name: "StallId" })
  stallId: string;

  @Column("character varying", { primary: true, name: "RateCode" })
  rateCode: string;

  @Column("numeric", { name: "StallRentAmount", default: () => "0" })
  stallRentAmount: string;

  @ManyToOne(() => Stalls, (stalls) => stalls.stallRates)
  @JoinColumn([{ name: "StallId", referencedColumnName: "stallId" }])
  stall: Stalls;
}
