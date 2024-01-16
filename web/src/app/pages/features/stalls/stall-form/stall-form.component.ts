import { StallClassificationsService } from 'src/app/services/stall-classifications.service';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Stalls } from 'src/app/model/stalls.model';
import { StallClassifications } from 'src/app/model/stall-classifications.model';

@Component({
  selector: 'app-stall-form',
  templateUrl: './stall-form.component.html',
  styleUrls: ['./stall-form.component.scss']
})
export class StallFormComponent {
  form: FormGroup;
  @Input() isReadOnly: any;
  stallClassificationSearchCtrl = new FormControl()
  isOptionsStallClassificationLoading = false;
  optionsStallClassification: { name: string; id: string; image: string}[] = [];
  @ViewChild('stallClassificationSearchInput', { static: true}) stallClassificationSearchInput: ElementRef<HTMLInputElement>;
  stall!: Stalls;
  stallClassifications!: any;
  stallClassificationsLoaded = false;
  constructor(
    private formBuilder: FormBuilder,
    private stallClassificationsService: StallClassificationsService
  ) {
    this.form = this.formBuilder.group({
      stallCode: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      name: ['',[Validators.required, Validators.pattern('^[a-zA-Z0-9\\-\\s]+$')]],
      areaName: ['',Validators.required],
      stallRentAmount: ['',
      [
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$'),
        Validators.required,
        Validators.compose([
          Validators.required, this.notBelowOne ])
      ],],
      stallClassificationId: ['',Validators.required],
    });
  }
  notBelowOne(control: any):{ [key: string]: any; } {
    if (Number(control.value) <= 0) {
      return {notBelowOne: true};
    } else {
      return null;
    }
  }

  async ngOnInit(): Promise<void> {
    await this.initStallClassificationsOptions();
    this.stallClassificationSearchCtrl.valueChanges
    .pipe(
        debounceTime(2000),
        distinctUntilChanged()
    )
    .subscribe(async value => {
        //your API call
        await this.initStallClassificationsOptions();
    });
  }

  async init(detais: Stalls) {
    this.stall = detais;
    if(this.form) {
      this.form.controls["stallCode"].setValue(detais.stallCode);
      this.form.controls["name"].setValue(detais.name);
      this.form.controls["areaName"].setValue(detais.areaName);
      this.form.controls["stallRentAmount"].setValue(detais.stallRentAmount);
      this.form.controls["stallClassificationId"].setValue(detais.stallClassification?.stallClassificationId);
      this.stallClassificationSearchCtrl.setValue(detais.stallClassification?.stallClassificationId);
    }
  }

  async initStallClassificationsOptions() {
    this.isOptionsStallClassificationLoading = true;
    const res = await this.stallClassificationsService.getByAdvanceSearch({
      order: {},
      columnDef: [{
        apiNotation: "name",
        filter: this.stallClassificationSearchInput.nativeElement.value
      }],
      pageIndex: 0,
      pageSize: 10
    }).toPromise();
    this.optionsStallClassification = res.data.results.map(a=> { return { name: a.name, id: a.stallClassificationId, image: a.thumbnailFile?.url }});
    this.mapSearchStallClassifications();
    this.isOptionsStallClassificationLoading = false;
  }

  mapSearchStallClassifications() {
    if(this.form.controls['stallClassificationId'] !== this.stallClassificationSearchCtrl.value){
      this.form.controls['stallClassificationId'].setErrors({ required: true});
      const selected = this.optionsStallClassification.find(x=>x.id === this.stallClassificationSearchCtrl.value);
      if(selected) {
        this.form.controls["stallClassificationId"].setValue(selected.id);
        this.form.controls['stallClassificationId'].markAsDirty();
        this.form.controls['stallClassificationId'].markAsTouched();
      } else {
        this.form.controls["stallClassificationId"].setValue(null);
      }
      if(!this.form.controls["stallClassificationId"].value) {
        this.form.controls["stallClassificationId"].setErrors({required: true});
      } else {
        this.form.controls['stallClassificationId'].setErrors(null);
        this.form.controls['stallClassificationId'].markAsPristine();
      }
    }
    this.stallClassificationSearchCtrl.setErrors(this.form.controls["stallClassificationId"].errors);
    if(this.form.controls["stallClassificationId"].value && this.form.controls["stallClassificationId"].value !== "") {
      this.stallClassifications = this.optionsStallClassification.find(x=>x.id === this.form.controls["stallClassificationId"].value);
    }
  }

  public get getFormData() {
    return this.form.value;
  }

  public get valid() {
    return this.form.valid && this.stallClassificationSearchCtrl.valid;
  }

  public get ready() {
    return (this.form.valid && this.form.dirty) || (this.stallClassificationSearchCtrl.valid && this.stallClassificationSearchCtrl.dirty);
  }

  getError(key: string) {
    if(key === "stallCode") {
      if(/\s/.test(this.form.controls[key].value)) {
        this.form.controls[key].setErrors({ whitespace: true})
      }
    }
    return this.form.controls && this.form.controls[key] ? this.form.controls[key].errors : null;
  }

  displayFn(value?: number) {
    return value ? this.optionsStallClassification.find(_ => _.id === value?.toString())?.name : undefined;
  }
}
