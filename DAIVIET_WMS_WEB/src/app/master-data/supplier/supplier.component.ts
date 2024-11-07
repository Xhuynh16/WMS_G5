import {Component} from '@angular/core';
import {ShareModule} from '../../shared/share-module';
import { SupplierFilter } from '../../models/master-data/supplier.model';
import {GlobalService} from '../../services/global.service';
import { SupplierService } from '../../services/master-data/supplier.service';
import {PaginationResult} from '../../models/base.model';
import {FormGroup, Validators, NonNullableFormBuilder} from '@angular/forms';

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent {

  validateForm: FormGroup = this.fb.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    contact: ['', [Validators.required]],
    address: ['', [Validators.required]],
    isActive: [true, [Validators.required]],
  });

  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new SupplierFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;
  constructor(
    private _service:  SupplierService ,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách nhà cung cấp',
        path: 'master-data/supplier',
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
  
    this._service.searchSupplier(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  exportExcel() {
    return this._service.exportExcelSupplier(this.filter).subscribe((result: Blob) => {
      const blob = new Blob([result], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = window.URL.createObjectURL(blob);
      var anchor = document.createElement('a');
      anchor.download = 'danh-sach-nha-cung-cap.xlsx';
      anchor.href = url;
      anchor.click();
    });
  }

  submitForm(): void {
    this.isSubmit = true;
    if (this.validateForm.valid) {
      if (this.edit) {
        this._service.updateSupplier(this.validateForm.getRawValue()).subscribe({
          next: (data) => {
            this.search();
          },
          error: (response) => {
            console.log(response);
          },
        });
      } else {
        this._service.createSupplier(this.validateForm.getRawValue()).subscribe({
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
    this.filter = new SupplierFilter();
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
    this._service.deleteSupplier(code).subscribe({
      next: (data) => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  openEdit(data: {id: string; name: string; contact: string; address: string; isActive: boolean}) {
    this.validateForm.setValue({
      code: data.id,
      name: data.name,
      contact: data.contact,
      address: data.address,
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


