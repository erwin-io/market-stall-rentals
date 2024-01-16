import { Component } from '@angular/core';
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

@Component({
  selector: 'app-tenant-rent-booking',
  templateUrl: './tenant-rent-booking.component.html',
  styleUrls: ['./tenant-rent-booking.component.scss'],
  host: {
    class: "page-component"
  }
})
export class TenantRentBookingComponent  {
  currentUserCode:string;
  error:string;
  dataSource = new MatTableDataSource<TenantRentBookingTableColumn>();
  columnDefs = [];
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  order: any = { tenantRentBookingCode: "DESC" };

  filter: {
    apiNotation: string;
    filter: any;
    name?: string;
    type: string;
  }[] = [];

  constructor(
    private tenantRentBookingsService: TenantRentBookingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router) {
      this.dataSource = new MatTableDataSource([]);
      if(this.route.snapshot.data) {
      }
      this.appConfig.config.tableColumns.tenantRentBooking.forEach(x=> {
        if(x.name === "menu") {
          const menu = [{
            "name": "details",
            "label": "Details"
          }];
          x["controlsMenu"] = menu;
        }
        this.columnDefs.push(x)
      });
    }

  ngOnInit(): void {
    const profile = this.storageService.getLoginProfile();
    this.currentUserCode = profile["userCode"];
  }

  async ngAfterViewInit() {
    Promise.all([
      this.getTenantRentBookingPaginated(),
    ]).then(([tenantRentBooking])=> {});

  }

  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[]) {
    this.filter = event;
    this.getTenantRentBookingPaginated();
  }

  async pageChange(event: { pageIndex: number, pageSize: number }) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    await this.getTenantRentBookingPaginated();
  }

  async sortChange(event: { active: string, direction: string }) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.tenantRentBooking.find(x=>x.name === active);
    this.order = convertNotationToObject(apiNotation, direction.toUpperCase());
    this.getTenantRentBookingPaginated()
  }

  getTenantRentBookingPaginated(){
    try{
      this.isLoading = true;
      this.tenantRentBookingsService.getByAdvanceSearch({
        order: this.order,
        columnDef: this.filter,
        pageIndex: this.pageIndex, pageSize: this.pageSize
      })
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              tenantRentBookingCode: d.tenantRentBookingCode,
              dateCreated: d.dateCreated.toString(),
              datePreferedStart: d.datePreferedStart.toString(),
              stall: d.stall.name,
              requestedBy: d.user.fullName,
              status: d.status,
            } as TenantRentBookingTableColumn
          });
          this.total = res.data.total;
          this.dataSource = new MatTableDataSource(data);
          this.isLoading = false;
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          this.isLoading = false;
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isLoading = false;
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
    }

  }

  controlMenuItemSelected(type: "details", data: TenantRentBookingTableColumn) {
    console.log(type, data);
    if(type === "details") {
      const dialogRef = this.dialog.open(TenantRentBookingDetailsComponent, {
        maxWidth: '720px',
        width: '720px',
        disableClose: true,
        panelClass: "form-dialog"
      });
      dialogRef.componentInstance.tenantRentBookingCode = data.tenantRentBookingCode;
      dialogRef.componentInstance.currentUserCode = this.currentUserCode;
      dialogRef.componentInstance.initDetails();
      dialogRef.afterClosed().subscribe(res=> {
        this.getTenantRentBookingPaginated();
      });
    }
  }

}
