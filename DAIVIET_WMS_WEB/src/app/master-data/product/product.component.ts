import { Component } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { ProductFilter } from '../../models/master-data/product.model';
import { GlobalService } from '../../services/global.service';
import { ProductService } from '../../services/master-data/product.service';
import { PaginationResult } from '../../models/base.model';
import { FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms';
import { DropdownService } from '../../services/dropdown/dropdown.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  validateForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    type: ['', [Validators.required]],
    stock: ['', [Validators.required]],
    currency: ['', [Validators.required]],
    basePrice: ['', [Validators.required, Validators.min(0)]],
    sellingPrice: ['', [Validators.required, Validators.min(0)]],
    minQuantity: ['', [Validators.required, Validators.min(1)]],
    maxQuantity: ['', [Validators.required, Validators.min(1)]],
    description: ['', [Validators.maxLength(255)]],
    isActive: [true, [Validators.required]],
  });

  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new ProductFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;
  optionsType: any[] = [];
  optionsCurrency: any[] = [];
  
  constructor(
    private _service: ProductService,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
    private dropDownService: DropdownService
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách hàng hóa',
        path: 'master-data/product',
      },
    ]);
    this.globalService.getLoading().subscribe((value) => {
      this.loading = value;
    });
  }

  ngOnInit(): void {
    this.search();
    this.getListType();
    this.getListCurrency();
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
    console.log(this.filter);
    this._service.searchProduct(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getListType() {
    this.dropDownService.getAllCurrency().subscribe({
      next: (data) => {
        this.optionsType = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  getListCurrency() {
    this.dropDownService.getAllUnit().subscribe({
      next: (data) => {
        this.optionsCurrency = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  exportExcel() {
    return this._service.exportExcelProduct(this.filter).subscribe((result: Blob) => {
      const blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.download = 'danh-sach-hang-hoa.xlsx';
      anchor.href = url;
      anchor.click();
    });
  }

  submitForm(): void {
    this.isSubmit = true;
    if (this.validateForm.valid) {
      if (this.edit) {
        this._service.updateProduct(this.validateForm.getRawValue()).subscribe({
          next: () => {
            this.search();
          },
          error: (response) => {
            console.log(response);
          },
        });
      } else {
        const formValue = this.validateForm.getRawValue();
        delete formValue.id;
        this._service.createProduct(formValue).subscribe({
          next: () => {
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
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  close() {
    this.visible = false;
    this.resetForm();
  }

  reset() {
    this.filter = new ProductFilter();
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

  deleteItem(id: string | number) {
    this._service.deleteProduct(id).subscribe({
      next: () => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  openEdit(data: { code: string; name: string; type: string; stock: string; currency: string; basePrice: number; sellingPrice: number; minQuantity: number; maxQuantity: number; description: string; isActive: boolean }) {
    this.validateForm.setValue({
      code: data.code,
      name: data.name,
      type: data.type,
      stock: data.stock,
      currency: data.currency,
      basePrice: data.basePrice,
      sellingPrice: data.sellingPrice,
      minQuantity: data.minQuantity,
      maxQuantity: data.maxQuantity,
      description: data.description || '',
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
