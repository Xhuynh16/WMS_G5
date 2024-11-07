import {Component} from '@angular/core';
import {ShareModule} from '../../shared/share-module';
import { PeriodTimeFilter } from '../../models/master-data/period-time.model';
import {GlobalService} from '../../services/global.service';
import { PeriodTimeService } from '../../services/master-data/period-time.service';
import {PaginationResult} from '../../models/base.model';
import {FormGroup, Validators, NonNullableFormBuilder} from '@angular/forms';
import { PERIODTIME_RIGHTS } from '../../shared/constants';
  @Component({
  selector: 'app-period-time',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './period-time.component.html',
  styleUrl: './period-time.component.scss'
})
export class PeriodTimeComponent {

  validateForm: FormGroup = this.fb.group({
    timeyear: ['', [Validators.required]],
    isDefault: [false, [Validators.required]],
  });

  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new PeriodTimeFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;
  PERIODTIME_RIGHTS  = PERIODTIME_RIGHTS ;
  constructor(
    private _service:  PeriodTimeService ,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách năm kế hoạch',
        path: 'master-data/PeriodTime',
      },
    ]);
     this.globalService.getLoading().subscribe((value) => {
      this.loading = value;
    });
  }

  ngOnDestroy() {
    this.globalService.setBreadcrumb([]);
  }

  ngOnInit(): void {
    this.search();
  }

  onSortChange(name: string, value: any) {
    this.filter = {
      ...this.filter,
      SortColumn: name,
      IsDescending: value === 'descend',
    };
    this.search();
  }

  search() {
    this.isSubmit = false;
    this._service.searchPeriodTime(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  

  submitForm(): void {
    this.isSubmit = true;
    if (this.validateForm.valid) {
      if (this.edit) {
        this._service.updatePeriodTime(this.validateForm.getRawValue()).subscribe({
          next: (data) => {
            this.search();
          },
          error: (response) => {
            console.log(response);
          },
        });
      } else {
        this._service.createPeriodTime(this.validateForm.getRawValue()).subscribe({
          next: (data) => {
            this.search();
          },
          error: (response) => {
            console.log(response);
          },
        });
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  close() {
    this.visible = false;
    this.resetForm();
  }

  reset() {
    this.filter = new PeriodTimeFilter();
    this.search();
  }

  openCreate() {
    this.edit = false;
    this.visible = true;
  }

  resetForm() {
    this.validateForm.reset();
    this.isSubmit = false;
  }

  deleteItem(code: string | number) {
    this._service.deletePeriodTime(code).subscribe({
      next: (data) => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
  
  changeDefaultStatus(timeyear: string | number) {
    this._service.ChangeDefaultStatus(timeyear).subscribe({
      next: (data) => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }


  changeIsClosedStatus(timeyear: string | number) {
    this._service.ChangeIsClosedStatus(timeyear).subscribe({
      next: (data) => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  openEdit(data: {timeyear: number; isActive: boolean}) {
    this.validateForm.setValue({
      timeyear: data.timeyear,
      isActive: data.isActive,
    });
    setTimeout(() => {
      this.edit = true;
      this.visible = true;
    }, 200);
  }

  pageSizeChange(size: number): void {
    this.filter.currentPage = 1;
    this.filter.pageSize = size;
    this.search();
  }

  pageIndexChange(index: number): void {
    this.filter.currentPage = index;
    this.search();
  }
}
