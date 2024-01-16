import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Files } from "./Files";
import { Stalls } from "./Stalls";

@Index("StallClassifications_pkey", ["stallClassificationId"], { unique: true })
@Entity("StallClassifications", { schema: "dbo" })
export class StallClassifications {
  @PrimaryGeneratedColumn({ type: "bigint", name: "StallClassificationId" })
  stallClassificationId: string;

  @Column("character varying", {
    name: "StallClassificationsCode",
    nullable: true,
  })
  stallClassificationsCode: string | null;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("character varying", { name: "Location" })
  location: string;

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

  @ManyToOne(() => Files, (files) => files.stallClassifications)
  @JoinColumn([{ name: "thumbnailFileId", referencedColumnName: "fileId" }])
  thumbnailFile: Files;

  @OneToMany(() => Stalls, (stalls) => stalls.stallClassification)
  stalls: Stalls[];
}
