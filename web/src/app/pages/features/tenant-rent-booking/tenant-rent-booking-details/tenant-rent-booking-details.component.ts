import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { Subscription, forkJoin } from 'rxjs';
import { TenantRentBooking } from 'src/app/model/tenant-rent-booking.model';
import { TenantRentBookingService } from 'src/app/services/tenant-rent-booking.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';

@Component({
  selector: 'app-tenant-rent-booking-details',
  templateUrl: './tenant-rent-booking-details.component.html',
  styleUrls: ['./tenant-rent-booking-details.component.scss']
})
export class TenantRentBookingDetailsComponent {
  tenantRentBookingCode;
  isNew = false;
  error;
  isLoading = true;
  tenantRentBookingForm: FormGroup;
  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  tenantRentBooking: TenantRentBooking;
  schoolId;
  currentUserCode;

  constructor(
    private formBuilder: FormBuilder,
    private tenantRentBookingService: TenantRentBookingService,
    private storageService: StorageService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private spinner: SpinnerVisibilityService,
    public dialogRef: MatDialogRef<TenantRentBookingDetailsComponent>) {
      this.tenantRentBookingForm = this.formBuilder.group(
        {
          userName: new FormControl(null),
          fullName: new FormControl(null),
          mobileNumber: new FormControl(null),
        }
      );
  }
  get f() {
    return this.tenantRentBookingForm.controls;
  }
  get formIsValid() {
    return this.tenantRentBookingForm.valid;
  }
  get formIsReady() {
    return this.tenantRentBookingForm.valid && this.tenantRentBookingForm.dirty;
  }
  get formData() {
    return this.tenantRentBookingForm.value;
  }

  async initDetails() {
    try {

      forkJoin([
        this.tenantRentBookingService.getByCode(this.tenantRentBookingCode).toPromise()
      ]).subscribe(([tenantRentBooking])=> {
        if (tenantRentBooking.success) {
          this.tenantRentBooking = tenantRentBooking.data;
          this.tenantRentBookingForm.updateValueAndValidity();
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(tenantRentBooking.message) ? tenantRentBooking.message[0] : tenantRentBooking.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
        }
        this.tenantRentBookingForm.disable();
      });
    } catch(ex) {
      this.isLoading = false;
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
    }
  }

  getError(key: string) {
    return this.f[key].errors;
  }
}
