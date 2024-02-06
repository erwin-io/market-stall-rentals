export class ColumnDefinition {
  name: string;
  label: string;
  apiNotation?: string;
  sticky?: boolean;
  style?: ColumnStyle;
  controls?: boolean;
  disableSorting?: boolean;
  format?: {
    type: "currency" | "date" | "date-time" | "number" | "custom" | "image";
    custom: string;
  };
  hide?: boolean;
  type?: "string" | "boolean" | "date" | "number" = "string";
  filterOptions: ColumnDefinitionFilterOptions;
  urlPropertyName?: string;
  filter: any;
}

export class ColumnDefinitionFilterOptions {
  placeholder?: string;
  enable?: boolean;
  type?: "text" | "option" | "option-yes-no" | "date" | "date-range" | "number" | "number-range" | "precise";
};
export class ColumnStyle {
  width: string;
  left: string;
}

export class TableColumnBase {
  menu: any[] = [];
}

export class UsersTableColumn {
  userName: string;
  fullName: string;
  userType: string;
  mobileNumber: string;
  enable: boolean;
  userProfilePic?: string;
  url?: string;
}

export class UserTableColumn {
  userCode?: string;
  fullName?: string;
  mobileNumber?: string;
  userProfilePic?: string;
}

export class AccessTableColumn {
  accessId: string;
  accessCode: string;
  name?: string;
  url?: string;
}

export class StallClassificationsTableColumn {
  stallClassificationId: string;
  stallClassificationsCode: string;
  name?: string;
  location?: string;
  thumbnail?: string;
  url?: string;
}

export class StallTableColumn {
  stallCode: string;
  name?: string;
  areaName?: string;
  monthlyRate?: string;
  weeklyRate?: string;
  dailyRate?: string;
  stallClassification?: string;
  status?: string;
  url?: string;
}

export class TenantRentBookingTableColumn extends TableColumnBase{
  tenantRentBookingCode?: string;
  dateCreated?: string;
  datePreferedStart?: string;
  stall?: string;
  requestedByUser?: string;
  status?: string;
  url?: string;
}

export class TenantRentContractTableColumn {
  tenantRentContractCode?: string;
  dateCreated?: string;
  dateStart?: string;
  stall?: string;
  tenantUser?: string;
  assignedCollectorUser?: string;
  status?: string;
  totalRentAmount: string;
  otherCharges: string;
  url?: string;
}

export class BillingTableColumn {
  tenantRentContractCode?: string;
  currentDueDate?: string;
  stall?: string;
  tenantUser?: string;
  assignedCollectorUser?: string;
  dueAmount: string;
  overDueAmount: string;
  totalDueAmount: string;
  url?: string;
}
