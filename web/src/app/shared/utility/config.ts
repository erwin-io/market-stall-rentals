import { AccessPages } from "src/app/model/access.model";
import { ColumnDefinition } from "./table"

export interface AppConfig {
    appName: string;
    reservationConfig: {
      maxCancellation: string;
      daysCancellationLimitReset: string;
      timeSlotHours: {
        start: string;
        end: string;
      };
      timeSlotNotAvailableHours: string[];
      dayOfWeekNotAvailable: string[];
    };
    tableColumns: {
      users: ColumnDefinition[];
      access: ColumnDefinition[];
      stallClassification: ColumnDefinition[];
      stall: ColumnDefinition[];
      tenantRentBooking: ColumnDefinition[];
      tenantRentContract: ColumnDefinition[];
      billing: ColumnDefinition[];
    };
    sessionConfig: {
      sessionTimeout: string;
    };
    lookup: {
      accessPages: AccessPages[];
    };
    apiEndPoints: {
      auth: {
        login: string;
        registerTenant: string;
      };
      user: {
        getByCode: string;
        createUsers: string;
        updateProfile: string;
        updateUsers: string;
        getUsersByAdvanceSearch: string;
        resetUserPassword: string;
        approveAccessRequest: string;
      };
      access: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        delete: string;
      };
      stallClassification: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        delete: string;
      };
      stall: {
        getByAdvanceSearch: string;
        getById: string;
        getByCode: string;
        create: string;
        update: string;
        delete: string;
        updateStatus: string;
      };
      tenantRentContract: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        createFromBooking: string;
        update: string;
        updateStatus: string;
      },
      tenantRentBooking: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
        update: string;
        updateStatus: string;
      },
      notifications: {
        getByAdvanceSearch: string;
        getUnreadByUser: string;
        marAsRead: string;
      };
      contractPayment: {
        getByAdvanceSearch: string;
        getByCode: string;
        create: string;
      },
      dashboard: {};
      message: { create: string };
    };
  }
