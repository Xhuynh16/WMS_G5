import {Component} from '@angular/core';
import {ShareModule} from '../../shared/share-module';
import { CurrencyFilter } from '../../models/master-data/currency.model';
import {GlobalService} from '../../services/global.service';
import { CurrencyService } from '../../services/master-data/currency.service';
import {PaginationResult} from '../../models/base.model';
import {FormGroup, Validators, NonNullableFormBuilder} from '@angular/forms';
import { CURRENCY_RIGHTS } from '../../shared/constants';
@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './currency.component.html',
  styleUrl: './currency.component.scss'
})
export class CurrencyComponent {

  validateForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    isActive: [true, [Validators.required]],
  });

  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new CurrencyFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;
  CURRENCY_RIGHTS = CURRENCY_RIGHTS;
  constructor(
    private _service:  CurrencyService ,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách loại hàng hóa',
        path: 'master-data/currency',
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
    this._service.searchCurrency(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  exportExcel() {
    return this._service.exportExcelCurrency(this.filter).subscribe((result: Blob) => {
      const blob = new Blob([result], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = window.URL.createObjectURL(blob);
      var anchor = document.createElement('a');
      anchor.download = 'danh-sach-loai-hang-hoa.xlsx';
      anchor.href = url;
      anchor.click();
    });
  }

  submitForm(): void {
    this.isSubmit = true;
    if (this.validateForm.valid) {
      if (this.edit) {
        this._service.updateCurrency(this.validateForm.getRawValue()).subscribe({
          next: (data) => {
            this.search();
          },
          error: (response) => {
            console.log(response);
          },
        });
      } else {
        this._service.createCurrency(this.validateForm.getRawValue()).subscribe({
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
    this.filter = new CurrencyFilter();
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
    this._service.deleteCurrency(code).subscribe({
      next: (data) => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  openEdit(data: {code: string; name: string; isActive: boolean}) {
    this.validateForm.setValue({
      code: data.code,
      name: data.name, 
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
