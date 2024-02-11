import { Component, TemplateRef, ViewChild } from '@angular/core';
import { TenantRentContractService } from 'src/app/services/tenant-rent-contract.service';
import { BillingTableColumn } from 'src/app/shared/utility/table';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
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
import * as moment from 'moment';
import { getContract } from 'src/app/shared/utility/contract';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  host: {
    class: "page-component"
  }
})
export class BillingComponent  {
  tabIndex = 0;
  currentUserProfile: Users;
  error:string;
  dataSource = {
    dueToday: new MatTableDataSource<any>([]),
    overDue: new MatTableDataSource<any>([]),
  }
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = {
    dueToday: 0,
    overDue: 0,
  };
  pageSize = {
    dueToday: 10,
    overDue: 10,
  };
  total = {
    dueToday: 0,
    overDue: 0,
  };
  order = {
    dueToday: { currentDueDate: "DESC" },
    overDue: { currentDueDate: "DESC" },
  };

  filter = {
    dueToday: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type?: string;
    }[],
    overDue: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type?: string;
    }[]
  };

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
        // this.pageBilling = {
        //   ...this.pageBilling,
        //   ...this.route.snapshot.data["tenantRentContract"]
        // };
      }
      this.onSelectedTabChange({index: this.tabIndex}, false);
    }

  ngOnInit(): void {
    const channel = this.pusherService.init("all");
    channel.bind("reSync", (res: any) => {
      const { type, data } = res;
      if(type && type === "TENANT_RENT_CONTRACT_PAYMENT") {
        this.getBillingPaginated("dueToday", false);
        this.getBillingPaginated("overDue", false);
      }
    });
  }

  ngAfterViewInit() {
    this.getBillingPaginated("dueToday");
    this.getBillingPaginated("overDue");

  }

  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[], table: string) {
    this.filter[table] = event;
    this.getBillingPaginated(table as any);
  }

  async pageChange(event: { pageIndex: number, pageSize: number }, table: string) {
    this.pageIndex[table] = event.pageIndex;
    this.pageSize[table] = event.pageSize;
    await this.getBillingPaginated(table as any);
  }

  async sortChange(event: { active: string, direction: string }, table: string) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.billing.find(x=>x.name === active);
    this.order[table] = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.getBillingPaginated(table as any)
  }

  async getBillingPaginated(table: "dueToday" | "overDue", showProgress = true){
    try{
      if(table === "dueToday") {
        const findIndex = this.filter[table].findIndex(x=>x.apiNotation === "currentDueDate");
        if(findIndex >= 0) {
          this.filter[table][findIndex] = {
            "apiNotation": "currentDueDate",
            "filter": moment().format("YYYY-MM-DD"),
            "name": "currentDueDate",
            "type": "date"
          };
        } else {
          this.filter[table].push({
            "apiNotation": "currentDueDate",
            "filter": moment().format("YYYY-MM-DD"),
            "name": "currentDueDate",
            "type": "date"
          });
        }
      } else {
        const findIndex = this.filter[table].findIndex(x=>x.apiNotation === "currentDueDate");
        if(findIndex >= 0) {
          this.filter[table][findIndex] = {
            "apiNotation": "currentDueDate",
            "filter": moment().format("YYYY-MM-DD"),
            "name": "status",
            "type": "date-less-than"
          };
        } else {
          this.filter[table].push({
            "apiNotation": "currentDueDate",
            "filter": moment().format("YYYY-MM-DD"),
            "name": "status",
            "type": "date-less-than"
          });
        }
      }

      if(!this.filter[table].some(x=>x.apiNotation === "status")) {
        this.filter[table].push({
          "apiNotation": "status",
          "filter": 'ACTIVE',
          "name": "status"
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
            const { overdueMonths, overdueWeeks, overdueDays, overdueCharge, dueAmount, totalDueAmount } = getContract(d);
            return {
              tenantRentContractCode: d.tenantRentContractCode,
              currentDueDate: `${moment(d.currentDueDate).format("MMM DD, YYYY")} ${
                overdueMonths > 1 ? '(' + overdueMonths + ' months Over due)' : '' ||
                overdueMonths === 1 ? '(' + overdueMonths + ' month Over due)' : '' ||
                overdueWeeks > 1 ? '(' + overdueWeeks + ' weeks Over due)' : '' ||
                overdueWeeks === 1 ? '(' + overdueWeeks + ' week Over due)' : '' ||
                overdueDays > 1 ? '(' + overdueDays + ' days Over due)' : ''
              }`,
              stall: d.stall.name,
              tenantUser: d.tenantUser.fullName,
              assignedCollectorUser: d.assignedCollectorUser.fullName,
              dueAmount,
              overDueAmount: overdueCharge,
              totalDueAmount,
              url: `/billing/${d.tenantRentContractCode}/details`,
            } as BillingTableColumn
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
        this._location.go("/billing/over-due");
      }
      this.titleService.setTitle(`Over due - Billing | ${this.appConfig.config.appName}`);
    } else {
      if(redirect) {
        this._location.go("/billing/due-today");
      }
      this.titleService.setTitle(`Due today - Billing | ${this.appConfig.config.appName}`);
    }
  }
}
