import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { TenantRentBooking } from 'src/app/model/tenant-rent-booking.model';

@Component({
  selector: 'app-tenant-rent-booking-form',
  templateUrl: './tenant-rent-booking-form.component.html',
  styleUrls: ['./tenant-rent-booking-form.component.scss']
})
export class TenantRentBookingFormComponent {
  tenantRentBooking!: TenantRentBooking;
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      tenantRentBookingCode: new FormControl(),
      dateCreated: new FormControl(),
      datePreferedStart: new FormControl(),
      stallCode: new FormControl(),
      stall: new FormControl(),
      requestedByUser: new FormControl(),
    });
  }

  public setFormValue(value: TenantRentBooking) {
    this.tenantRentBooking = value;
    if(this.form) {
      this.form.controls["tenantRentBookingCode"].setValue(value?.tenantRentBookingCode ? value?.tenantRentBookingCode : "");
      this.form.controls["dateCreated"].setValue(value?.dateCreated ? moment(value?.dateCreated).format("MMM DD, YYYY") : "");
      this.form.controls["datePreferedStart"].setValue(value?.datePreferedStart ? moment(value?.datePreferedStart).format("MMM DD, YYYY") : "");
      this.form.controls["stall"].setValue(value?.stall?.name ? value?.stall?.name : "");
      this.form.controls["stallCode"].setValue(value?.stall?.name ? value?.stall?.stallCode : "");
      this.form.controls["requestedByUser"].setValue(value?.requestedByUser?.fullName ? value?.requestedByUser?.fullName : "");
    }
  }

  public get getFormData() {
    return this.form.value;
  }

  public get valid() {
    return this.form.valid;
  }

  public get ready() {
    return this.form.valid;
  }

  getError(key: string) {
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }
}
