import { Component, OnInit } from '@angular/core';
import { ContractPayment } from 'src/app/core/model/contract-payment.model';
import { generateDates, getDateDifference } from 'src/app/core/utils/date';

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.page.html',
  styleUrls: ['./collection-details.page.scss'],
})
export class CollectionDetailsPage implements OnInit {
  modal;
  paymentDueList: Date[] = [];
  details: ContractPayment;
  constructor() { }

  ngOnInit() {
    if(this.details) {
      const { days, months, weeks } = getDateDifference(new Date(this.details?.dueDateStart), new Date(this.details.dueDateEnd));
      if(this.details.tenantRentContract?.stallRateCode === 'MONTHLY') {
        this.paymentDueList = generateDates(new Date(this.details.dueDateStart), (months + 1), 'MONTH');
      } else if(this.details.tenantRentContract.stallRateCode === 'WEEKLY') {
        this.paymentDueList = generateDates(new Date(this.details.dueDateStart), (weeks + 1), 'WEEK');
      } else {
        this.paymentDueList = generateDates(new Date(this.details.dueDateStart), (days + 1), 'DAY');
      }

      if(this.paymentDueList.length <= 0) {
        this.paymentDueList.push(new Date(this.details.dueDateEnd));
      }
    }
  }
  close() {
    this.modal.dismiss(null, 'cancel');
  }
}
