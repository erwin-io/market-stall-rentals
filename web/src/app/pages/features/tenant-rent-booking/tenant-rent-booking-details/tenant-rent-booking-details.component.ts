import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';
import { TenantRentBookingService } from 'src/app/services/tenant-rent-booking.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { TenantRentBookingFormComponent } from '../tenant-rent-booking-form/tenant-rent-booking-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { Users } from 'src/app/model/users';
import { PusherService } from 'src/app/services/pusher.service';
import { AccessPages } from 'src/app/model/access.model';
import { TenantRentBooking } from 'src/app/model/tenant-rent-booking.model';
@Component({
  selector: 'app-tenant-rent-booking-details',
  templateUrl: './tenant-rent-booking-details.component.html',
  styleUrls: ['./tenant-rent-booking-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class TenantRentBookingDetailsComponent {
  currentUserProfile:Users;
  tenantRentBookingCode;
  isReadOnly = true;
  error;
  isLoading = true;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  @ViewChild('tenantRentBookingForm', { static: true}) tenantRentBookingForm: TenantRentBookingFormComponent;

  canAddEdit = false;

  tenantRentBooking: TenantRentBooking;

  pageAccess: AccessPages = {
    view: true,
    modify: false,
  } as any;

  constructor(
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
    this.tenantRentBookingCode = this.route.snapshot.paramMap.get('tenantRentBookingCode');
    this.isReadOnly = !edit && !isNew;
    if (this.route.snapshot.data) {
      this.pageAccess = {
        ...this.pageAccess,
        ...this.route.snapshot.data['access'],
      };
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
    channel.bind('rentBookingChanges', (res: TenantRentBooking) => {
      console.log(res);
      if(res.tenantRentBookingId === this.tenantRentBooking.tenantRentBookingId) {
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
    this.initDetails();
  }

  initDetails() {
    this.isLoading = true;
    try {
      this.tenantRentBookingService.getByCode(this.tenantRentBookingCode).subscribe(res=> {
        if (res.success) {
          this.tenantRentBooking = res.data;
          this.tenantRentBookingForm.setFormValue(this.tenantRentBooking);

          if (this.isReadOnly) {
            this.tenantRentBookingForm.form.disable();
          }
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/tenant-rent-booking/']);
        }
      });
    } catch(ex) {
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/tenant-rent-booking/']);
      this.isLoading = false;
    }
  }

  updateStatus(status: "REJECTED"
  | "LEASED"
  | "CANCELLED") {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    if(status === "CANCELLED") {
      dialogData.message = 'Are you sure you want to cancel tenant rent booking?';
    } else if(status === "REJECTED") {
      dialogData.message = 'Are you sure you want to reject tenant rent booking?';
    } else if(status === "LEASED") {
      dialogData.message = 'Are you sure you want to complete tenant rent booking?';
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

      if(status === "LEASED") {
        this.dialog.closeAll();
        this.router.navigate(['/tenant-rent-contract/' + this.tenantRentBookingCode + '/from-booking' ]);
      } else {
        this.isProcessing = true;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        try {
          let res = await this.tenantRentBookingService.updateStatus(this.tenantRentBookingCode, { status }).toPromise();
          if (res.success) {
            this.snackBar.open('Saved!', 'close', {
              panelClass: ['style-success'],
            });
            this.router.navigate(['/tenant-rent-booking/' + this.tenantRentBookingCode + '/details']);
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
      }
    });
  }
}
