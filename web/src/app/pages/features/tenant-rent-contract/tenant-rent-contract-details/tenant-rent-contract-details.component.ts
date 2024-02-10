import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TenantRentContractService } from 'src/app/services/tenant-rent-contract.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { TenantRentContractFormComponent } from '../tenant-rent-contract-form/tenant-rent-contract-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { Users } from 'src/app/model/users';
import { PusherService } from 'src/app/services/pusher.service';
import { AccessPages } from 'src/app/model/access.model';
import { TenantRentContract } from 'src/app/model/tenant-rent-contract.model';
import * as moment from 'moment';
import { TenantRentBooking } from 'src/app/model/tenant-rent-booking.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { TenantRentBookingService } from 'src/app/services/tenant-rent-booking.service';
@Component({
  selector: 'app-tenant-rent-contract-details',
  templateUrl: './tenant-rent-contract-details.component.html',
  styleUrls: ['./tenant-rent-contract-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class TenantRentContractDetailsComponent {
  currentUserProfile:Users;
  tenantRentContractCode;
  tenantRentBookingCode;
  isNew = false;
  isReadOnly = true;
  error;
  isLoading = true;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  @ViewChild('tenantRentContractForm', { static: true}) tenantRentContractForm: TenantRentContractFormComponent;

  canAddEdit = false;
  isNewFromBooking = false;

  tenantRentContract: TenantRentContract;

  pageAccess: AccessPages = {
    view: true,
    modify: false,
  } as any;

  constructor(
    private tenantRentContractService: TenantRentContractService,
    private tenantRentBookingService: TenantRentBookingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private pusherService: PusherService
  ) {
    this.currentUserProfile = this.storageService.getLoginProfile();
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew;
    this.tenantRentContractCode = this.route.snapshot.paramMap.get('tenantRentContractCode');
    this.tenantRentBookingCode = this.route.snapshot.paramMap.get('tenantRentBookingCode');
    this.isReadOnly = !edit && !isNew && !this.tenantRentBookingCode;
    if (this.route.snapshot.data) {
      this.pageAccess = {
        ...this.pageAccess,
        ...this.route.snapshot.data['access'],
      };
    }
    if(this.tenantRentBookingCode && this.tenantRentBookingCode !== "") {
      this.isNewFromBooking = true;
    }
  }

  get pageRights() {
    let rights = {};
    for(var right of this.pageAccess.rights) {
      rights[right] = this.pageAccess.modify;
    }
    return rights;
  }

  ngOnInit(): void {
    const channel = this.pusherService.init(this.currentUserProfile.userId);
    channel.bind('rentContractChanges', (res: TenantRentContract) => {
      console.log(res);
      if(res.tenantRentContractId === this.tenantRentContract.tenantRentContractId) {
        this.snackBar.open("Someone has updated this document.", "",{
          announcementMessage: "Someone has updated this document.",
          verticalPosition: "top"
        });
        setTimeout(()=> {
          if(this.isReadOnly) {
            this.initDetails();
          }
        }, 3000);
      }
    });
  }

  async ngAfterViewInit() {
    // await Promise.all([
    // ])
    if(!this.isNew) {
      this.initDetails();
    } else if(this.isNewFromBooking) {
      this.initBookingDetails();
      this.canAddEdit = true;
      this.isLoading = false;
    } else {
      this.canAddEdit = true;
      this.isLoading = false;
      // this.tenantRentContractForm.form.controls["dateCreated"].setValue(moment().format("YYYY-MM-DD"));
      // this.tenantRentContractForm.form.controls["dateCreated"].setValidators([Validators.required]);
      // this.tenantRentContractForm.form.controls["dateCreated"].setValidators([Validators.required]);
      // this.tenantRentContractForm.form.controls["dateStart"].setValue(value?.dateStart ? moment(value?.dateStart).format("MMM DD, YYYY") : "");
      // this.tenantRentContractForm.form.controls["stallCode"].setValue(value?.stall?.stallCode ? value?.stall?.stallCode : "");
      // this.tenantRentContractForm.form.controls["otherCharges"].setValue(value?.otherCharges ? value?.otherCharges : "");
      // this.tenantRentContractForm.form.controls["tenantUserCode"].setValue(value?.tenantUser?.userCode ? value?.tenantUser?.userCode : "");
    }
  }

  initDetails() {
    this.isLoading = true;
    try {
      this.tenantRentContractService.getByCode(this.tenantRentContractCode).subscribe(res=> {
        if (res.success) {
          this.tenantRentContract = res.data;
          this.tenantRentContractForm.setFormValue(this.tenantRentContract);

          if (this.isReadOnly) {
            this.tenantRentContractForm.form.disable();
          }
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/tenant-rent-contract/']);
        }
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/tenant-rent-contract/']);
      this.isLoading = false;
    }
  }

  initBookingDetails() {
    this.isLoading = true;
    try {
      this.tenantRentBookingService.getByCode(this.tenantRentBookingCode).subscribe((res: ApiResponse<TenantRentBooking>)=> {
        if (res.success && res.data) {

          this.tenantRentContractForm.stall = res.data.stall;
          this.tenantRentContractForm.tenant = res.data.requestedByUser;

          this.tenantRentContractForm.form.controls["dateCreated"].setValue(moment().format("MMMM DD, YYYY") );
          this.tenantRentContractForm.form.controls["dateStart"].setValue(res.data.datePreferedStart ? moment(res.data.datePreferedStart).format("MMMM DD, YYYY") : "");
          this.tenantRentContractForm.form.controls["stallCode"].setValue(res.data.stall && res.data.stall?.stallCode ? res.data.stall?.stallCode : "");
          this.tenantRentContractForm.form.controls["otherCharges"].setValue(0);
          this.tenantRentContractForm.form.controls["tenantUserCode"].setValue(res.data.requestedByUser?.userCode);

          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/tenant-rent-contract/']);
        }
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/tenant-rent-contract/']);
      this.isLoading = false;
    }
  }
  updateStatus(status: "CLOSED"
  | "CANCELLED") {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    if(status === "CANCELLED") {
      dialogData.message = 'Are you sure you want to cancel tenant rent booking?';
    } else if(status === "CLOSED") {
      dialogData.message = 'Are you sure you want to closed tenant rent booking?';
    }
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
        let res = await this.tenantRentContractService.updateStatus(this.tenantRentContractCode, { status }).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/tenant-rent-contract/' + this.tenantRentContractCode + '/details']);
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

  onSubmit() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Save contract?';
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
        const formData = this.tenantRentContractForm?.getFormData;
        let res;
        if(this.isNewFromBooking) {
          res = await this.tenantRentContractService.createFromBooking({
            tenantRentBookingCode: this.tenantRentBookingCode,
            ...formData
          }).toPromise();
        } else {
          res = await this.tenantRentContractService.create(formData).toPromise();
        }
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/tenant-rent-contract/' + res.data.tenantRentContractCode + '/details']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          this.tenantRentContractCode = res.data.tenantRentContractCode;
          this.tenantRentContract = res.data;
          this.isReadOnly = true;
          this.isNew = false;
          this.canAddEdit = true;
          await this.ngAfterViewInit();
          dialogRef.close();
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
}
