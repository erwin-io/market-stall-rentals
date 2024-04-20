import { Files } from './files.model';
import { Stalls } from './stalls.model';
export class StallClassifications {
  stallClassificationsCode: string;
  stallClassificationId: string;
  name: string;
  location: string;
  active: boolean;
  dateAdded: Date;
  dateLastUpdated: Date;
  stalls: Stalls[];
  thumbnailFile: Files;
}
