import { Component } from '@angular/core';
import { ShareModule } from '../../../shared/share-module';
import { ImportService } from '../../../services/business/import.service';
import { GlobalService } from '../../../services/global.service';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/master-data/product.service';
import { IMPORT_RIGHTS } from '../../../shared/constants';

@Component({
  selector: 'app-export-details',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './export-details.component.html',
  styleUrl: './export-details.component.scss'
})
export class ExportDetailsComponent {
  loading: boolean = false
  ticketId: string = ''
  validateForm: FormGroup = this.fb.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    status: ['', [Validators.required]],
    type: [''],
    address: ['', Validators.required],
    note: ['', [Validators.required]],
    details: [[]],
    isActive: [true, [Validators.required]],
  });
  constructor(
    private _service: ImportService,
    private globalService: GlobalService,
    private fb: NonNullableFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _product: ProductService,

  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách phiếu xuất hàng',
        path: 'business/import',
      },
    ])
    this.globalService.getLoading().subscribe((value) => {
      this.loading = value
    })
  }
  createBy = ''
  createDate = ''
  status = ''
  isVisible: boolean = false
  isSubmit: boolean = false;
  isVisibleModal = false
  inputValue: string = ''
  pageIndex = 1;
  lstProduct: any[] = []
  lstPrice: any[] = []
  printModalVisible = false;
  IMPORT_RIGHTS = IMPORT_RIGHTS;
  private populateListDataForm(data: any) {
    this.validateForm.patchValue({
      id: data.id,
      name: data.name,
      status: data.status,
      note: data.note,
      address: data.address
    })
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.ticketId = params['id']
      console.log(this.ticketId)
      const navigation = this.router.getCurrentNavigation()
      if (navigation?.extras.state) {
        const state = navigation.extras.state as { ListData: any }
        if (state.ListData) {
          this.populateListDataForm(state.ListData)
          console.log(state.ListData)
          this.lstProduct = state.ListData.details;
          this.createBy = state.ListData.createBy;
          this.createDate = state.ListData.createDate;
          this.status = state.ListData.status
        }
      }
    })
    this.getAllProduct();
  }
  onPageIndexChange(newPageIndex: number): void {
    this.pageIndex = newPageIndex;
  }
  getAllProduct() {
    this._product.getall().subscribe({
      next: (data) => {
        this.lstPrice = data
      },
      error: (response) => {
        console.log(response)
      },
    })
  }
  getPrice(id: string) {
    const price = this.lstPrice.find(x => x.code == id)?.sellingPrice;
    return price;
  }
  calculateTotalValue(): number {
    return this.lstProduct.reduce((total, row) => {
      return total + row.quantity_Change * this.getPrice(row.product_id);
    }, 0);
  }
  submitForm(): void {
    this.isSubmit = true;
    const statusCode =
    this.status === 'Khởi tạo'
      ? '01'
      : this.status === 'Chờ xác nhận'
        ? '02'
        : this.status === 'Đã phê duyệt'
          ? '03'
          : '04'
    let formData = this.validateForm.value;
    formData.status = statusCode;
    formData.type = 'N';
    formData.id = this.validateForm.get('id')?.value;
    if (this.validateForm.valid) {
      this._service.updateImport(formData).subscribe({
        next: (data) => {
        },
        error: (response) => {
          console.log(response);
        },
      });
    }
    else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  handleOk() {
    this.updateTicket()
    this.isVisible = false
  }
  updateTicket() {
    let formData = this.validateForm.value;
    formData.status = this.status;
    formData.type = 'N';
    formData.id = this.validateForm.get('id')?.value;
    formData.details = this.lstProduct
      this._service
        .updateImport(formData)
        .subscribe((res: any) => {  
          this._service.getDataDetails(this.validateForm.get('id')?.value).subscribe((data) => {
            this.populateListDataForm(data);
            this.status = data.status;
          });       
        })
    }
    handleCancel() {
      this.isVisible = false
      this.printModalVisible = false;
    }
    showModal(status: string) {
      if (status != '-') {
        this.status = status
      }
      this.isVisible = true
      this.validateForm.getRawValue().status = status
    }
    showPrintModal() {
      this.printModalVisible = true;
    }
    handlePrint() {
      // Thực hiện in phiếu tại đây
      this.printModalVisible = false;
    }
    getModalMessage() {
      switch (this.status) {
        case '01':
          return 'Bạn có chắc chắn yêu cầu chỉnh sửa thông tin này';
        case '02':
          return 'Bạn có chắc chắn trình duyệt thông tin này';
        case '03':
          return 'Bạn có chắc chắn phê duyệt thông tin này';
        case '04':
          return 'Bạn có chắc chắn từ chối thông tin này';
        default:
          return '';
      }
    }
}
