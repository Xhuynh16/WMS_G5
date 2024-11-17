import { Component } from '@angular/core';
import { ShareModule } from '../../shared/share-module';
import { ImportFilter } from '../../models/business/import.model';
import {GlobalService} from '../../services/global.service';
import { ImportService } from '../../services/business/import.service';
import {PaginationResult} from '../../models/base.model';
import {FormGroup, Validators, NonNullableFormBuilder} from '@angular/forms';
import { ProductService } from '../../services/master-data/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
@Component({
  selector: 'app-export',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './export.component.html',
  styleUrl: './export.component.scss'
})
export class ExportComponent {
  validateForm: FormGroup = this.fb.group({
    id: [''],
    name: ['', [Validators.required]],
    status: ['', [Validators.required]],
    type: [''],
    address: ['', Validators.required],
    note: ['', [Validators.required]],
    details: [[]],
    isActive: [true, [Validators.required]],
  });
  value: string = ''
  totalAmount: number = 0;
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
    private message: NzMessageService,
    private router: Router,
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách phiếu xuất',
        path: 'business/export',
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
        this.lstProduct = data
      }
    })
  }
  getNameStatus(value: string): string {
    switch (value) {
        case "01":
            return "Khởi tạo";
        case "02":
            return "Chờ xác nhận";
        case "03":
            return "Đã phê duyệt";
        case "04":
            return "Từ chối";
        case "05":
            return "Đã hoàn thành";
        default:
            return "Chưa hoàn thành";
    }
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
    this._service.searchEx(this.filter).subscribe({
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
    let formData = this.validateForm.value;
    formData.details = this.selectedProducts.map(product => ({
      product_id: product.code|| '', 
      quantity_Change: product.quantity_Change || '1', 
      note: product.note || ''
    })),
    formData.status = '01';
    formData.type = 'N';
    if (this.validateForm.valid) {
      if (this.edit) {
        this._service.updateImport(formData).subscribe({
          next: (data) => {
            this.search();
          },
          error: (response) => {
            console.log(response);
          },
        });
      } else {
        console.log(formData)
        this._service.createImport(formData).subscribe({
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
  calculateTotalAmount() {
    this.totalAmount = this.selectedProducts.reduce((sum, product) => {
      return sum + (product.quantity * product.sellingPrice);
    }, 0);
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

  openEdit(data: {id: string}) {
    this._service.getDataDetails(data.id).subscribe({
      next: (result) => {
        if (result) { // Log toàn bộ kết quả trả về từ API
          this.router.navigate(['/business/export-details', data.id], {
            state: { ListData: result },  // Pass the whole object
          });
        } else {
          console.warn("No data found for the given code.");
        }
      },
      error: (error) => {
        console.error("API call failed: ", error);  // Log chi tiết lỗi
      },
    });
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
    if (existingProduct) {
      // Nếu sản phẩm đã tồn tại, chỉ tăng số lượng
      if (existingProduct.quantity < product.stock) {
        existingProduct.quantity += 1;
        this.calculateTotalAmount();
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
        sellingPrice: product.sellingPrice,
        quantity: 1
      });
      this.calculateTotalAmount();
    }
  }

  // Tăng giảm số lượng
  onQuantityChange(product: any, change: number) {
    const newQuantity = product.quantity + change;
    // Kiểm tra số lượng mới không vượt quá tồn kho và không nhỏ hơn 1
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      product.quantity = newQuantity;
      this.calculateTotalAmount();
    }
  }

  // Xóa sản phẩm khỏi phiếu xuất
  removeProduct(index: number) {
    this.selectedProducts.splice(index, 1);
    this.calculateTotalAmount();
  }
}
