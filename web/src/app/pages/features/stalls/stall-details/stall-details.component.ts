import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Stalls } from 'src/app/model/stalls.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { StallFormComponent } from '../stall-form/stall-form.component';
import { StallService } from 'src/app/services/stalls.service';

@Component({
  selector: 'app-stall-details',
  templateUrl: './stall-details.component.html',
  styleUrls: ['./stall-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class StallDetailsComponent {
  id;
  isNew = false;
  // pageStall: Stall = {
  //   view: true,
  //   modify: false,
  // };

  isReadOnly = true;

  error;
  isLoading = false;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;
  stall: Stalls;

  @ViewChild('stallForm', { static: true}) stallForm: StallFormComponent;

  constructor(
    private stallService: StallService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew;
    this.id = this.route.snapshot.paramMap.get('stallId');
    this.isReadOnly = !edit && !isNew;
    if (this.route.snapshot.data) {
      // this.pageStall = {
      //   ...this.pageStall,
      //   ...this.route.snapshot.data['stall'],
      // };
    }
  }

  get pageRights() {
    let rights = {};
    // for(var right of this.pageStall.rights) {
    //   rights[right] = this.pageStall.modify;
    // }
    return rights;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initDetails();
  }

  initDetails() {
    this.stallService.getById(this.id).subscribe(res=> {
      if (res.success) {
        this.stall = res.data;
        this.stallForm.init(res.data);

        if (this.isReadOnly) {
          this.stallForm.form.disable();
          this.stallForm.stallClassificationSearchCtrl.disable();
        }
      } else {
        this.error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
      }
    })
  }

  onDelete() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Delete stall?';
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
        let res = await this.stallService.delete(this.id).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/stalls/']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
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

  onUpdate(formData) {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Update stall?';
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
        let res = await this.stallService.update(this.id, formData).toPromise();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/stalls/' + res.data.stallId]);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
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

  updateStatus(status: "AVAILABLE" | "INMAINTENANCE" | "UNAVAILABLE") {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    if(status === "AVAILABLE") {
      dialogData.message = 'Mark stall status as Available?';
    } else if(status === "INMAINTENANCE") {
      dialogData.message = 'Maintenance this stall?';
    } else {
      dialogData.message = 'Mark stall status as Unavailable?';
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
        let res = await this.stallService.updateStatus(this.id, { status }).toPromise();
        if (res.success) {
          res = await this.stallService.getByCode(this.stall.stallCode).toPromise();
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });

          this.stall = res.data;
          this.router.navigate(['/stalls/' + res.data.stallId]);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
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
