import { Component } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { ImportFilter } from '../../models/business/import.model';
import {GlobalService} from '../../services/global.service';
import { ImportService } from '../../services/business/import.service';
import {PaginationResult} from '../../models/base.model';
import {FormGroup, Validators, NonNullableFormBuilder} from '@angular/forms';
import { ProductService } from '../../services/master-data/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-import',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './import.component.html',
  styleUrl: './import.component.scss'
})
export class ImportComponent {
  validateForm: FormGroup = this.fb.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    status: ['', [Validators.required]],
    productCode: ['', [Validators.required]],
    isActive: [true, [Validators.required]],
  });
  lstProduct: any[] =[]
  selectedProducts: any[] = [];
  isSubmit: boolean = false;
  visible: boolean = false;
  edit: boolean = false;
  filter = new ImportFilter();
  paginationResult = new PaginationResult();
  loading: boolean = false;
  constructor(
    private _service:  ImportService ,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
    private _productSv: ProductService,
    private message: NzMessageService
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách phiếu nhập',
        path: 'business/import',
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
    this.getAllProduct();
  }
  getAllProduct(){
    this._productSv.getall().subscribe({
      next: (data) => {
        console.log(data)
        this.lstProduct = data
      }

    })
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
    this._service.searchImport(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  exportExcel() {
    return this._service.exportExcelImport(this.filter).subscribe((result: Blob) => {
      const blob = new Blob([result], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      const url = window.URL.createObjectURL(blob);
      var anchor = document.createElement('a');
      anchor.download = 'danh-sach-phieu-nhap.xlsx';
      anchor.href = url;
      anchor.click();
    });
  }

  submitForm(): void {
    this.isSubmit = true;
    if (this.validateForm.valid) {
      if (this.edit) {
        this._service.updateImport(this.validateForm.getRawValue()).subscribe({
          next: (data) => {
            this.search();
          },
          error: (response) => {
            console.log(response);
          },
        });
      } else {
        this._service.createImport(this.validateForm.getRawValue()).subscribe({
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
    this.filter = new ImportFilter();
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
    this._service.deleteImport(code).subscribe({
      next: (data) => {
        this.search();
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  openEdit(data: {code: string; name: string;status: string; productCode: string; isActive: boolean}) {
    this.validateForm.setValue({
      code: data.code,
      name: data.name,
      status: data.status,
      productCode: data.productCode,
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
  onProductDoubleClick(product: any) {
    // Tìm sản phẩm trong danh sách đã chọn
    const existingProduct = this.selectedProducts.find(p => p.code === product.code);
    console.log(existingProduct)
    if (existingProduct) {
      // Nếu sản phẩm đã tồn tại, chỉ tăng số lượng
      if (existingProduct.quantity < product.stock) {
        existingProduct.quantity += 1;
      } else {
        // Có thể thêm thông báo khi vượt quá số lượng tồn
        this.message.warning('Số lượng không thể vượt quá tồn kho!');
      }
    } else {
      // Nếu là sản phẩm mới, thêm một dòng mới vào phiếu xuất
      this.selectedProducts.push({
        code: product.code,
        name: product.name,
        type: product.type,
        stock: product.stock,
        currency: product.currency,
        quantity: 1
      });
    }
  }

  // Tăng giảm số lượng
  onQuantityChange(product: any, change: number) {
    const newQuantity = product.quantity + change;
    // Kiểm tra số lượng mới không vượt quá tồn kho và không nhỏ hơn 1
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      product.quantity = newQuantity;
    }
  }

  // Xóa sản phẩm khỏi phiếu xuất
  removeProduct(index: number) {
    this.selectedProducts.splice(index, 1);
  }
}

