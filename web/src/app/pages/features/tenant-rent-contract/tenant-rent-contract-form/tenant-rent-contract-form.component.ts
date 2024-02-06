import { Component, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { Stalls } from 'src/app/model/stalls.model';
import { TenantRentContract } from 'src/app/model/tenant-rent-contract.model';
import { Users } from 'src/app/model/users';
import { SelectStallDialogComponent } from 'src/app/shared/select-stall-dialog/select-stall-dialog.component';
import { SelectUserDialogComponent } from 'src/app/shared/select-user-dialog/select-user-dialog.component';

@Component({
  selector: 'app-tenant-rent-contract-form',
  templateUrl: './tenant-rent-contract-form.component.html',
  styleUrls: ['./tenant-rent-contract-form.component.scss']
})
export class TenantRentContractFormComponent {
  tenantRentContract!: TenantRentContract;
  stall!: Stalls;
  tenant!: Users;
  collector!: Users;
  form: FormGroup;

  @Input() isNew = false;
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      dateCreated: new FormControl(moment().format("YYYY-MM-DD")),
      dateStart: new FormControl(moment().format("YYYY-MM-DD")),
      stallCode: new FormControl(),
      otherCharges: new FormControl(),
      tenantUserCode: new FormControl(),
      assignedCollectorUserCode: new FormControl(),
      stallRateCode: new FormControl()
    });
  }

  public setFormValue(value: TenantRentContract) {
    this.tenantRentContract = value;
    this.stall = value.stall;
    this.tenant = value.tenantUser;
    this.collector = value.assignedCollectorUser;
    if(this.form) {
      this.form.controls["dateCreated"].setValue(value?.dateCreated ? moment(value?.dateCreated).format("MMMM DD, YYYY") : "");
      this.form.controls["dateStart"].setValue(value?.dateStart ? moment(value?.dateStart).format("MMMM DD, YYYY") : "");
      this.form.controls["stallCode"].setValue(value?.stall?.stallCode ? value?.stall?.stallCode : "");
      this.form.controls["otherCharges"].setValue(value?.otherCharges ? value?.otherCharges : "");
      this.form.controls["tenantUserCode"].setValue(value?.tenantUser?.userCode ? value?.tenantUser?.userCode : "");
      this.form.controls["assignedCollectorUserCode"].setValue(value?.assignedCollectorUser?.userCode ? value?.assignedCollectorUser?.userCode : "");
      this.form.controls["stallRateCode"].setValue(value?.stallRateCode ? value?.stallRateCode : "");
    }
  }
  ngOnInit(): void {
    this.form.controls["dateCreated"].addValidators([Validators.required]);
    this.form.controls["dateCreated"].disable();
    this.form.controls["dateStart"].addValidators([Validators.required]);
    this.form.controls["stallCode"].addValidators([Validators.required]);
    this.form.controls["stallCode"].disable();
    this.form.controls["otherCharges"].addValidators([Validators.required]);
    this.form.controls["tenantUserCode"].addValidators([Validators.required]);
    this.form.controls["tenantUserCode"].disable();
    this.form.controls["assignedCollectorUserCode"].addValidators([Validators.required]);
    this.form.controls["assignedCollectorUserCode"].disable();
    this.form.updateValueAndValidity();
  }

  get totalRentAmount() {
    if(this.form.controls["stallRateCode"].value?.toUpperCase() === "MONTHLY") {
      return this.stall ? Number(this.stall?.monthlyRate) + Number(this.form.controls["otherCharges"].value) : 0;
    } else if(this.form.controls["stallRateCode"].value?.toUpperCase() === "WEEKLY") {
      return this.stall ? Number(this.stall?.weeklyRate) + Number(this.form.controls["otherCharges"].value) : 0;
    } else if(this.form.controls["stallRateCode"].value?.toUpperCase() === "DAILY") {
      return this.stall ? Number(this.stall?.dailyRate) + Number(this.form.controls["otherCharges"].value) : 0;
    } else {
      return Number(this.form.controls["otherCharges"].value);
    }
  }

  public get getFormData() {
    return {
      dateCreated: this.form.controls["dateCreated"].value,
      dateStart: this.form.controls["dateStart"].value,
      stallCode: this.form.controls["stallCode"].value,
      otherCharges: this.form.controls["otherCharges"].value,
      tenantUserCode: this.form.controls["tenantUserCode"].value,
      assignedCollectorUserCode: this.form.controls["assignedCollectorUserCode"].value,
      stallRateCode: this.form.controls["stallRateCode"].value,
    }
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

  getCleanNumberText(value: any) {
    return value && !isNaN(Number(value)) ? Number(value) : 0;
  }

  showSelectStall() {
    const dialogRef = this.dialog.open(SelectStallDialogComponent, {
        disableClose: true,
        panelClass: "select-stall-dialog"
    });
    dialogRef.componentInstance.selected = {
      stallCode: this.stall?.stallCode,
      name: this.stall?.name,
      selected: true
    }
    dialogRef.afterClosed().subscribe((res:Stalls)=> {
      if(res) {
        this.stall = res;
        this.form.controls["stallCode"].setValue(res.stallCode);
      }
      this.form.controls["stallCode"].markAllAsTouched();
      this.form.controls["stallCode"].markAsDirty();
      this.form.controls["stallCode"].updateValueAndValidity();
      this.form.controls["otherCharges"].setValue(0);
      this.form.controls["otherCharges"].addValidators([Validators.required]);
      this.form.updateValueAndValidity();
    })

  }

  showSelectTenant() {
    const dialogRef = this.dialog.open(SelectUserDialogComponent, {
        disableClose: true,
        panelClass: "select-stall-dialog"
    });
    dialogRef.componentInstance.selected = {
      userCode: this.tenant?.userCode,
      fullName: this.tenant?.fullName,
      selected: true
    },
    dialogRef.componentInstance.userType = "TENANT";
    dialogRef.afterClosed().subscribe((res: Users)=> {
      if(res) {
        this.tenant = res;
        this.form.controls["tenantUserCode"].setValue(res.userCode);
      }
      this.form.controls["tenantUserCode"].markAllAsTouched();
      this.form.controls["tenantUserCode"].markAsDirty();
      this.form.controls["tenantUserCode"].updateValueAndValidity();
      this.form.updateValueAndValidity();
    })

  }

  showSelectCollector() {
    const dialogRef = this.dialog.open(SelectUserDialogComponent, {
        disableClose: true,
        panelClass: "select-stall-dialog"
    });
    dialogRef.componentInstance.selected = {
      userCode: this.collector?.userCode,
      fullName: this.collector?.fullName,
      selected: true
    },
    dialogRef.componentInstance.userType = "COLLECTOR";
    dialogRef.afterClosed().subscribe((res: Users)=> {
      if(res) {
        this.collector = res;
        this.form.controls["assignedCollectorUserCode"].setValue(res.userCode);
      }
      this.form.controls["assignedCollectorUserCode"].markAllAsTouched();
      this.form.controls["assignedCollectorUserCode"].markAsDirty();
      this.form.controls["assignedCollectorUserCode"].updateValueAndValidity();
      this.form.updateValueAndValidity();
    })
  }

}
