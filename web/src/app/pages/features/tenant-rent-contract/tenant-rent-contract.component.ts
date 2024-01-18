import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TenantRentContractService } from 'src/app/services/tenant-rent-contract.service';
import { TenantRentContractTableColumn } from 'src/app/shared/utility/table';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { TenantRentContractDetailsComponent } from './tenant-rent-contract-details/tenant-rent-contract-details.component';
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
  selector: 'app-tenant-rent-contract',
  templateUrl: './tenant-rent-contract.component.html',
  styleUrls: ['./tenant-rent-contract.component.scss'],
  host: {
    class: "page-component"
  }
})
export class TenantRentContractComponent  {
  tabIndex = 0;
  currentUserProfile: Users;
  error:string;
  dataSource = {
    active: new MatTableDataSource<any>([]),
    closed: new MatTableDataSource<any>([]),
    cancelled: new MatTableDataSource<any>([]),
  }
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = {
    active: 0,
    closed: 0,
    cancelled: 0,
  };
  pageSize = {
    active: 10,
    closed: 10,
    cancelled: 10,
  };
  total = {
    active: 0,
    closed: 0,
    cancelled: 0,
  };
  order = {
    active: { tenantRentContractId: "ASC" },
    closed: { tenantRentContractId: "DESC" },
    cancelled: { tenantRentContractId: "DESC" },
  };

  filter = {
    active: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    closed: [] as {
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
  // pageTenantRentContract: TenantRentContract = {
  //   view: true,
  //   modify: false,
  // };

  @ViewChild('tenantRentContractFormDialog') tenantRentContractFormDialogTemp: TemplateRef<any>;
  constructor(
    private spinner: SpinnerVisibilityService,
    private tenantRentContractService: TenantRentContractService,
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
        // this.pageTenantRentContract = {
        //   ...this.pageTenantRentContract,
        //   ...this.route.snapshot.data["tenantRentContract"]
        // };
      }
      this.onSelectedTabChange({index: this.tabIndex}, false);
    }

  ngOnInit(): void {
    const channel = this.pusherService.init("all");
    channel.bind("reSync", (res: any) => {
      const { type, data } = res;
      if(type && type === "TENANTRENTCONTRACT") {
        this.getTenantRentContractPaginated("active", false);
        this.getTenantRentContractPaginated("closed", false);
        this.getTenantRentContractPaginated("cancelled", false);
      }
    });
  }

  ngAfterViewInit() {
    this.getTenantRentContractPaginated("active");
    this.getTenantRentContractPaginated("closed");
    this.getTenantRentContractPaginated("cancelled");

  }

  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[], table: string) {
    this.filter[table] = event;
    this.getTenantRentContractPaginated(table as any);
  }

  async pageChange(event: { pageIndex: number, pageSize: number }, table: string) {
    this.pageIndex[table] = event.pageIndex;
    this.pageSize[table] = event.pageSize;
    await this.getTenantRentContractPaginated(table as any);
  }

  async sortChange(event: { active: string, direction: string }, table: string) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.tenantRentContract.find(x=>x.name === active);
    this.order[table] = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.getTenantRentContractPaginated(table as any)
  }

  async getTenantRentContractPaginated(table: "active" | "closed" | "cancelled", showProgress = true){
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
      await this.tenantRentContractService.getByAdvanceSearch({
        order: this.order[table],
        columnDef: this.filter[table],
        pageIndex: this.pageIndex[table],
        pageSize: this.pageSize[table]
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              tenantRentContractCode: d.tenantRentContractCode,
              dateCreated: d.dateCreated.toString(),
              dateStart: d.dateStart.toString(),
              stall: d.stall.name,
              tenantUser: d.tenantUser.fullName,
              status: d.status,
              totalRentAmount: d.totalRentAmount,
              otherCharges: d.otherCharges,
              url: `/tenant-rent-contract/${d.tenantRentContractCode}/details`,
            } as TenantRentContractTableColumn
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
    this.dialog.open(this.tenantRentContractFormDialogTemp)
  }

  onSelectedTabChange({ index }, redirect = true) {
    if(index === 1) {
      if(redirect) {
        this._location.go("/tenant-rent-contract/closed");
      }
      this.titleService.setTitle(`Closed | ${this.appConfig.config.appName}`);
    } else if(index === 2) {
      if(redirect) {
        this._location.go("/tenant-rent-contract/cancelled");
      }
      this.titleService.setTitle(`Cancelled | ${this.appConfig.config.appName}`);
    } else {
      if(redirect) {
        this._location.go("/tenant-rent-contract/active");
      }
      this.titleService.setTitle(`Active | ${this.appConfig.config.appName}`);
    }
  }
}
