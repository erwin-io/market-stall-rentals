import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { TenantRentContract } from 'src/app/model/tenant-rent-contract.model';
import { TenantRentContractService } from 'src/app/services/tenant-rent-contract.service';
import { getContract } from 'src/app/shared/utility/contract';
import { generateDates } from 'src/app/shared/utility/date';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { AppConfigService } from 'src/app/services/app-config.service';
import { Users } from 'src/app/model/users';
import { StorageService } from 'src/app/services/storage.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { ContractPaymentService } from 'src/app/services/contract-payment.service';
import { PusherService } from 'src/app/services/pusher.service';
import { ContractPayment } from 'src/app/model/contract-payment.model';

export class Billing extends TenantRentContract {
  dueAmount: any;
  overdueMonths: number;
  overdueWeeks: number;
  overdueDays: number;
  overdueCharge: string;
  totalDueAmount: any;
}

@Component({
  selector: 'app-bill-details',
  templateUrl: './bill-details.component.html',
  styleUrls: ['./bill-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class BillDetailsComponent implements AfterViewInit {
  isLoading = false;
  error;
  tenantRentContract: Billing;
  numberOfMonthsToPay = 0;
  isDuePaymentMode = true;
  displayedColumns: string[] = [ 'periodNumber', 'dueDate', 'dueAmount'];
  dataSource = new MatTableDataSource([]);
  tenantRentContractCode;
  currentUserProfile: Users;
  isProcessing = false;
  @ViewChild('referenceNumberFormDialog') referenceNumberFormDialog: TemplateRef<any>;
  referenceNumber = new FormControl(null, [Validators.required]);
  constructor(
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public router: Router,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private pontractPaymentService: ContractPaymentService,
    private pusherService: PusherService,
    private tenantRentContractService: TenantRentContractService) {
    this.tenantRentContractCode = this.route.snapshot.paramMap.get('tenantRentContractCode');
    this.currentUserProfile = this.storageService.getLoginProfile();
  }
  ngAfterViewInit(): void {
    this.initBill();

    const channel = this.pusherService.init(this.currentUserProfile.userId);
    channel.bind('paymentChanges', (res: ContractPayment) => {
      console.log(res);
      if(res?.tenantRentContract?.tenantRentContractId === this.tenantRentContract.tenantRentContractId) {
        this.snackBar.open("Someone has updated this document.", "",{
          announcementMessage: "Someone has updated this document.",
          verticalPosition: "top"
        });
        setTimeout(()=> {
          this.initBill();
        }, 3000);
      }
    });
  }

  get today() {
    return new Date();
  }

  async initBill() {
    this.isLoading = true;
    try {
      this.tenantRentContractService.getByCode(this.tenantRentContractCode).subscribe(res=> {
        if (res.success) {
          this.tenantRentContract = getContract(res.data);
          console.log(this.tenantRentContract);
          const dueList = this.generateDueList();
          console.log(dueList);
          let dueListDataSource = dueList.map((x, i)=> {
            return {
              rowType: null,
              label: null,
              periodNumber: i + 1,
              dueDate: x,
              dueAmount: Number(this.tenantRentContract.totalRentAmount),
            };
          });
          if(dueList.length > 1) {
            dueListDataSource.push({
              rowType: 'sum', label: 'Total due', dueAmount: dueList.length * Number(this.tenantRentContract.totalRentAmount),
              periodNumber: null,
              dueDate: null
            });
          }
          if(dueList.length > 1 && this.tenantRentContract.overdueDays > 0) {
            dueListDataSource.push({
              rowType: 'sum', label: 'Over due charge', dueAmount: Number(this.tenantRentContract.overdueCharge),
              periodNumber: null,
              dueDate: null
            });
            dueListDataSource.push({
              rowType: 'sum', label: 'Total amount to pay', dueAmount: (dueList.length * Number(this.tenantRentContract.totalRentAmount)) + Number(this.tenantRentContract.overdueCharge),
              periodNumber: null,
              dueDate: null
            });
          } else if(this.tenantRentContract.overdueDays >= 0) {
            dueListDataSource.push({
              rowType: 'sum', label: 'Total amount to pay', dueAmount: (dueList.length * Number(this.tenantRentContract.totalRentAmount)),
              periodNumber: null,
              dueDate: null
            });
          }
          this.dataSource = new MatTableDataSource(dueListDataSource);
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/billing/']);
        }
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/billing/']);
      this.isLoading = false;
    }
  }

  generateDueList() {
    try {
      const dueList = [];
      let type: 'MONTH' | 'WEEK' | 'DAY';
      let numberOfDue = 0;
      if(!this.isDuePaymentMode && this.numberOfMonthsToPay > 0) {
        numberOfDue = this.numberOfMonthsToPay;
      } else {
        if(this.tenantRentContract.stallRateCode === 'MONTHLY') {
          numberOfDue = this.tenantRentContract.overdueMonths;
        } else if(this.tenantRentContract.stallRateCode === 'WEEKLY') {
          numberOfDue = this.tenantRentContract.overdueWeeks;
        } else {
          numberOfDue = this.tenantRentContract.overdueDays;
        }
      }
      if(this.tenantRentContract.stallRateCode === 'MONTHLY') {
        type = 'MONTH';
      } else if(this.tenantRentContract.stallRateCode === 'WEEKLY') {
        type = 'WEEK';
      } else {
        type = 'DAY';
      }
      const dates = generateDates(this.tenantRentContract.currentDueDate, (numberOfDue), type);
      dates.forEach(x=> {
        const from = new Date(moment(x).format('YYYY-MM-DD'));
        let to;
        if(type === 'MONTH') {
          to = new Date(from.getFullYear(), from.getMonth() + 1, from.getDate());
        } else if(type === 'WEEK') {
          to = new Date(from.getFullYear(), from.getMonth(), from.getDate() +  7);
        } else {
          to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1);
        }
        if(to < new Date()) {
          dueList.push(to);
        }
      });
      if(dueList.length === 0 && this.tenantRentContract.overdueDays === 0) {
        dueList.push(new Date(this.tenantRentContract.currentDueDate));
      }
      return dueList;
    } catch(ex) {
      throw ex;
    }
  }

  async onShowPaymentReferenceNumber() {
    try {
      this.dialog.open(this.referenceNumberFormDialog, {
        disableClose: true,
        width: '100%',
        maxWidth: '720px'
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
    }
  }

  async onPay() {
    const dueList = this.dataSource.data.filter(x=>x.rowType !== 'sum').map(x=>x.dueDate);
    const dueDateStart = dueList[0];
    const dueDateEnd = dueList[dueList.length - 1];
    const params = {
      paidByUserId: this.currentUserProfile.userId,
      tenantRentContractCode: this.tenantRentContract.tenantRentContractCode,
      referenceNumber: this.referenceNumber.value,
      datePaid: moment().format('YYYY-MM-DD'),
      dueDateStart: moment(dueDateStart).format('YYYY-MM-DD'),
      dueDateEnd: moment(dueDateEnd).format('YYYY-MM-DD'),
      dueAmount: this.tenantRentContract.dueAmount,
      overDueAmount: this.tenantRentContract.overdueCharge,
      totalDueAmount: this.tenantRentContract.totalDueAmount,
      paymentAmount: this.tenantRentContract.totalDueAmount,
    };
    console.log(params);
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm payment';
    dialogData.message = 'Are you sure you want submit a payment?';
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
      color: 'primary',
    };
    dialogData.dismissButton = {
      visible: true,
      text: 'cancel',
    };
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
    });
    dialogRef.componentInstance.alertDialogConfig = dialogData;

    dialogRef.componentInstance.conFirm.subscribe(async (data: any) => {
      this.isProcessing = true;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      try {
        let res = await this.pontractPaymentService.create(params).toPromise();
        if (res.success) {
          this.snackBar.open('Payment Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/billing/' + this.tenantRentContractCode + '/details']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          await this.ngAfterViewInit();
          dialogRef.close();
          this.dialog.closeAll();
        } else {
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.error = Array.isArray(res.message)
            ? res.message[0]
            : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          dialogRef.close();
        }
      } catch (e) {
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        this.error = Array.isArray(e.message) ? e.message[0] : e.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    });
  }

  async onPrint() {
    const element: HTMLDivElement = document.querySelector("div.printable");

    html2canvas((element as any)).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      // console.log(contentDataURL);
      let pdfWindow = window.open("")
      pdfWindow.document.write(
        `
        <div style="display:flex;width:100%;flex-direction:column;align-items: center;">
        <img style="width: 100%;max-width: 720px;" src=${contentDataURL}></div>
        `
      );
      pdfWindow.document.title = `${this.tenantRentContract.tenantRentContractCode}-${this.tenantRentContract.tenantUser.fullName}`;
      setTimeout(()=> {
        pdfWindow.print();
        window.location.reload();
      }, 1000)
      // let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      // var position = 0;
      // pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      // pdf.output("dataurl", { filename: `${this.tenantRentContract.tenantRentContractCode}-${this.tenantRentContract.tenantUser.fullName}`});
    });
  }
}
