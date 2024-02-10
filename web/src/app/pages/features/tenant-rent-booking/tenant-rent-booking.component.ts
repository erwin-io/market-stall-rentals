import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TenantRentBookingService } from 'src/app/services/tenant-rent-booking.service';
import { TenantRentBookingTableColumn } from 'src/app/shared/utility/table';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { TenantRentBookingDetailsComponent } from './tenant-rent-booking-details/tenant-rent-booking-details.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { Title } from '@angular/platform-browser';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Users } from 'src/app/model/users';
import { PusherService } from 'src/app/services/pusher.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tenant-rent-booking',
  templateUrl: './tenant-rent-booking.component.html',
  styleUrls: ['./tenant-rent-booking.component.scss'],
  host: {
    class: "page-component"
  }
})
export class TenantRentBookingComponent  {
  tabIndex = 0;
  currentUserProfile: Users;
  error:string;
  dataSource = {
    pending: new MatTableDataSource<any>([]),
    leased: new MatTableDataSource<any>([]),
    rejected: new MatTableDataSource<any>([]),
    cancelled: new MatTableDataSource<any>([]),
  }
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = {
    pending: 0,
    leased: 0,
    rejected: 0,
    cancelled: 0,
  };
  pageSize = {
    pending: 10,
    leased: 10,
    rejected: 10,
    cancelled: 10,
  };
  total = {
    pending: 0,
    leased: 0,
    rejected: 0,
    cancelled: 0,
  };
  order = {
    pending: { tenantRentBookingId: "ASC" },
    leased: { tenantRentBookingId: "DESC" },
    rejected: { tenantRentBookingId: "DESC" },
    cancelled: { tenantRentBookingId: "DESC" },
  };

  filter = {
    pending: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    leased: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    rejected: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    cancelled: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[]
  };
  // pageTenantRentBooking: TenantRentBooking = {
  //   view: true,
  //   modify: false,
  // };

  @ViewChild('tenantRentBookingFormDialog') tenantRentBookingFormDialogTemp: TemplateRef<any>;
  constructor(
    private spinner: SpinnerVisibilityService,
    private tenantRentBookingService: TenantRentBookingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private titleService: Title,
    private _location: Location,
    public router: Router,
    private pusherService: PusherService) {
      this.currentUserProfile = this.storageService.getLoginProfile();
      this.tabIndex = this.route.snapshot.data["tab"];
      if(this.route.snapshot.data) {
        // this.pageTenantRentBooking = {
        //   ...this.pageTenantRentBooking,
        //   ...this.route.snapshot.data["tenantRentBooking"]
        // };
      }
      this.onSelectedTabChange({index: this.tabIndex}, false);
    }

  ngOnInit(): void {
    const channel = this.pusherService.init("all");
    channel.bind("reSync", (res: any) => {
      const { type, data } = res;
      console.log(type);
      if(type && type === "TENANT_RENT_BOOKING") {
        setTimeout(()=> {
          this.getTenantRentBookingPaginated("pending", false);
          this.getTenantRentBookingPaginated("leased", false);
          this.getTenantRentBookingPaginated("rejected", false);
          this.getTenantRentBookingPaginated("cancelled", false);
        }, 3000)
      }
    });
  }

  ngAfterViewInit() {
    this.getTenantRentBookingPaginated("pending");
    this.getTenantRentBookingPaginated("leased");
    this.getTenantRentBookingPaginated("rejected");
    this.getTenantRentBookingPaginated("cancelled");

  }

  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[], table: string) {
    this.filter[table] = event;
    this.getTenantRentBookingPaginated(table as any);
  }

  async pageChange(event: { pageIndex: number, pageSize: number }, table: string) {
    this.pageIndex[table] = event.pageIndex;
    this.pageSize[table] = event.pageSize;
    await this.getTenantRentBookingPaginated(table as any);
  }

  async sortChange(event: { active: string, direction: string }, table: string) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.tenantRentBooking.find(x=>x.name === active);
    this.order[table] = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.getTenantRentBookingPaginated(table as any)
  }

  async getTenantRentBookingPaginated(table: "pending" | "leased" | "rejected" | "cancelled", showProgress = true){
    try{
      const findIndex = this.filter[table].findIndex(x=>x.apiNotation === "status");
      if(findIndex >= 0) {
        this.filter[table][findIndex] = {
          "apiNotation": "status",
          "filter": table.toUpperCase(),
          "name": "status",
          "type": "text"
        };
      } else {
        this.filter[table].push({
          "apiNotation": "status",
          "filter": table.toUpperCase(),
          "name": "status",
          "type": "text"
        });
      }

      this.isLoading = true;
      if(showProgress === true) {
        this.spinner.show();
      }
      await this.tenantRentBookingService.getByAdvanceSearch({
        order: this.order[table],
        columnDef: this.filter[table],
        pageIndex: this.pageIndex[table],
        pageSize: this.pageSize[table]
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              tenantRentBookingCode: d.tenantRentBookingCode,
              dateCreated: d.dateCreated.toString(),
              datePreferedStart: d.datePreferedStart.toString(),
              stall: d.stall.name,
              requestedByUser: d.requestedByUser.fullName,
              status: d.status,
              url: `/tenant-rent-booking/${d.tenantRentBookingCode}/details`,
            } as TenantRentBookingTableColumn
          });
          this.total[table] = res.data.total;
          this.dataSource[table] = new MatTableDataSource(data);
          this.isLoading = false;
          this.spinner.hide();
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          this.isLoading = false;
          this.spinner.hide();
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isLoading = false;
        this.spinner.hide();
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      this.isLoading = false;
      this.spinner.hide();
    }

  }

  showAddDialog() {
    this.dialog.open(this.tenantRentBookingFormDialogTemp)
  }

  onSelectedTabChange({ index }, redirect = true) {
    if(index === 1) {
      if(redirect) {
        this._location.go("/tenant-rent-booking/leased");
      }
      this.titleService.setTitle(`Leased | ${this.appConfig.config.appName}`);
    } else if(index === 2) {
      if(redirect) {
        this._location.go("/tenant-rent-booking/rejected");
      }
      this.titleService.setTitle(`Rejected | ${this.appConfig.config.appName}`);
    } else if(index === 3) {
      if(redirect) {
        this._location.go("/tenant-rent-booking/cancelled");
      }
      this.titleService.setTitle(`Cancelled | ${this.appConfig.config.appName}`);
    } else {
      if(redirect) {
        this._location.go("/tenant-rent-booking/pending");
      }
      this.titleService.setTitle(`Pending | ${this.appConfig.config.appName}`);
    }
  }
}
