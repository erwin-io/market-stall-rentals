import { StallClassifications } from "./stall-classifications.model";

export class Stalls {
  stallId: string;
  stallCode: string;
  name: string;
  areaName: string;
  status: string;
  active: boolean;
  dateAdded: Date;
  dateLastUpdated: Date;
  monthlyRate: string;
  weeklyRate: string;
  dailyRate: string;
  stallClassification: StallClassifications;
}
