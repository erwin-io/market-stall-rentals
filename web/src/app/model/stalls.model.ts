import { StallClassifications } from "./stall-classifications.model";

export class Stalls {
  stallId: string;
  stallCode: string;
  name: string;
  areaName: string;
  stallRentAmount: string;
  status: string;
  active: boolean;
  dateAdded: Date;
  dateLastUpdated: Date;
  stallClassification: StallClassifications;
}
