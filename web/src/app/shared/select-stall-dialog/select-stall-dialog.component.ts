import { filter } from 'rxjs';
import { Component, EventEmitter, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { StallService } from 'src/app/services/stalls.service';
import { StallTableColumn } from '../utility/table';

export class SelectStallDialogTableColumn extends StallTableColumn {
  selected?: boolean;
}

@Component({
  selector: 'app-select-stall-dialog',
  templateUrl: './select-stall-dialog.component.html',
  styleUrls: ['./select-stall-dialog.component.scss']
})
export class  SelectStallDialogComponent {
  displayedColumns = ["selected", "name", "areaName", "monthlyRate", "weeklyRate", "dailyRate", "stallClassification"  ]
  dataSource = new MatTableDataSource<SelectStallDialogTableColumn>();
  selected: SelectStallDialogTableColumn;
  doneSelect = new EventEmitter();
  total = 0;
  pageIndex = 0;
  pageSize = 10
  order = { name: "ASC" } as any;
  filterName = "";
  filterAreaName = "";
  filterMonthlyRate = "";
  filterWeeklyRate = "";
  filterDailyRate = "";
  filterStallClassification = "";
  schoolCode;
  @ViewChild('paginator', {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private stallsService: StallService,
    private spinner: SpinnerVisibilityService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SelectStallDialogComponent>
    ) {
  }

  ngAfterViewInit(): void {
    this.init();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe((event: PageEvent)=> {
      const { pageIndex, pageSize } = event;
      this.pageIndex = pageIndex;
      this.pageSize = pageSize;
      this.init();
    });
    this.dataSource.sort.sortChange.subscribe((event: MatSort)=> {
      const { active, direction } = event;
      if(active === "areaName") {
        this.order = { areaName: direction.toUpperCase()}
      }
      else if(active === "monthlyRate") {
        this.order = { monthlyRate: direction.toUpperCase()}
      }
      else if(active === "weeklyRate") {
        this.order = { weeklyRate: direction.toUpperCase()}
      }
      else if(active === "dailyRate") {
        this.order = { dailyRate: direction.toUpperCase()}
      }
      else if(active === "stallClassification") {
        this.order = { stallClassification:  { name: direction.toUpperCase()} }
      } else {
        this.order = { name: direction.toUpperCase()}
      }
      this.init();
    });
  }

  init() {
    const filter: any[] = [
      {
        apiNotation: "name",
        filter: this.filterName,
      },
      {
        apiNotation: "areaName",
        filter: this.filterAreaName,
      },
      {
        apiNotation: "status",
        filter: "AVAILABLE",
      },
      {
        apiNotation: "stallClassification.name",
        filter: this.filterStallClassification,
      },
    ];
    const monthlyRate = this.filterMonthlyRate && !isNaN(Number(this.filterMonthlyRate)) ? Number(this.filterMonthlyRate) : 0;
    const weeklyRate = this.filterWeeklyRate && !isNaN(Number(this.filterWeeklyRate)) ? Number(this.filterWeeklyRate) : 0;
    const dailyRate = this.filterDailyRate && !isNaN(Number(this.filterDailyRate)) ? Number(this.filterDailyRate) : 0;
    if(monthlyRate > 0) {
      filter.push({
        apiNotation: "monthlyRate",
        filter: monthlyRate,
        type: "number"
      });
    }
    if(weeklyRate > 0) {
      filter.push({
        apiNotation: "weeklyRate",
        filter: weeklyRate,
        type: "number"
      });
    }
    if(dailyRate > 0) {
      filter.push({
        apiNotation: "dailyRate",
        filter: dailyRate,
        type: "number"
      });
    }
    try {
      this.stallsService.getByAdvanceSearch({
        order: this.order,
        columnDef: filter,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).subscribe(res=> {
        this.dataSource = new MatTableDataSource(res.data.results.map(x=> {
          return {
            stallCode: x.stallCode,
            name:  x.name,
            areaName:  x.areaName,
            monthlyRate: x.monthlyRate,
            weeklyRate: x.weeklyRate,
            dailyRate: x.dailyRate,
            stallClassification:  x.stallClassification.name,
            selected: this.selected?.stallCode === x.stallCode
          }
        }));
        this.total = res.data.total;
      });
    }catch(ex) {

    }
  }

  isSelected(item: SelectStallDialogTableColumn) {
    return this.dataSource.data.find(x=>x.stallCode === item.stallCode && x.selected) ? true : false;
  }

  selectionChange(currentItem: SelectStallDialogTableColumn, selected) {
    const items = this.dataSource.data;
    if(selected) {
      for(var item of items) {
        item.selected = currentItem.stallCode === item.stallCode;
      }
    }
    else {
      const items = this.dataSource.data;
      for(var item of items) {
        item.selected = false;
      }
    }
    this.dataSource = new MatTableDataSource<SelectStallDialogTableColumn>(items);
    this.selected = this.dataSource.data.find(x=>x.selected);
  }

  async doneSelection() {
    try {
      this.spinner.show();
      const res = await this.stallsService.getByCode(this.selected.stallCode).toPromise();
      this.spinner.hide();
      if(res.success) {
        this.dialogRef.close(res.data);
      } else {
        const error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.snackBar.open(error, 'close', {panelClass: ['style-error']});
      }
    } catch(ex) {
      const error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(error, 'close', {panelClass: ['style-error']});
      this.spinner.hide();
    }
  }
}
