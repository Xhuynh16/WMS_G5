import { Component } from '@angular/core'
import { ShareModule } from '../../shared/share-module'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { AuditPeriodFilter } from '../../models/master-data/audit-period.model'
import { PaginationResult } from '../../models/base.model'
import { AUDITPERIOD_RIGHTS } from '../../shared/constants'
import { AuditPeriodService } from '../../services/master-data/audit-period.service'
import { GlobalService } from '../../services/global.service'

@Component({
  selector: 'app-audit-period',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './audit-period.component.html',
  styleUrl: './audit-period.component.scss',
})
export class AuditPeriodComponent {
  validateForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    auditPeriod: ['', [Validators.required]],
    isActive: [true, [Validators.required]],
  })
  isSubmit: boolean = false
  visible: boolean = false
  edit: boolean = false
  filter = new AuditPeriodFilter()
  paginationResult = new PaginationResult()
  loading: boolean = false
  AUDITPERIOD_RIGHTS = AUDITPERIOD_RIGHTS
  constructor(
    private _service: AuditPeriodService,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách đợt kiểm toán',
        path: 'master-data/audit-period',
      },
    ])
    this.globalService.getLoading().subscribe((value) => {
      this.loading = value
    })
  }
  ngOnDestroy() {
    this.globalService.setBreadcrumb([])
  }

  ngOnInit(): void {
    this.search()
  }

  onSortChange(name: string, value: any) {
    this.filter = {
      ...this.filter,
      SortColumn: name,
      IsDescending: value === 'descend',
    }
    this.search()
  }

  search() {
    this.isSubmit = false
    this._service.searchAuditPeriod(this.filter).subscribe({
      next: (data) => {
        this.paginationResult = data
      },
      error: (response) => {
        console.log(response)
      },
    })
  }

  exportExcel() {
    return this._service
      .exportExcelAuditPeriod(this.filter)
      .subscribe((result: Blob) => {
        const blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = window.URL.createObjectURL(blob)
        var anchor = document.createElement('a')
        anchor.download = 'danh-sach-dot-kiem-toan.xlsx'
        anchor.href = url
        anchor.click()
      })
  }

  submitForm(): void {
    this.isSubmit = true
    if (this.validateForm.valid) {
      if (this.edit) {
        this._service
          .updateAuditPeriod(this.validateForm.getRawValue())
          .subscribe({
            next: (data) => {
              this.search()
            },
            error: (response) => {
              console.log(response)
            },
          })
      } else {
        this._service
          .createAuditPeriod(this.validateForm.getRawValue())
          .subscribe({
            next: (data) => {
              this.search()
            },
            error: (response) => {
              console.log(response)
            },
          })
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      })
    }
  }

  close() {
    this.visible = false
    this.resetForm()
  }

  reset() {
    this.filter = new AuditPeriodFilter()
    this.search()
  }

  openCreate() {
    this.edit = false
    this.visible = true
  }

  resetForm() {
    this.validateForm.reset()
    this.isSubmit = false
  }

  deleteItem(code: string) {
    this._service.deleteAuditPeriod(code).subscribe({
      next: (data) => {
        this.search()
      },
      error: (response) => {
        console.log(response)
      },
    })
  }

  openEdit(data: { code: string; auditPeriod: number; isActive: boolean }) {
    this.validateForm.setValue({
      code: data.code,
      auditPeriod: data.auditPeriod,
      isActive: data.isActive,
    })
    setTimeout(() => {
      this.edit = true
      this.visible = true
    }, 200)
  }

  pageSizeChange(size: number): void {
    this.filter.currentPage = 1
    this.filter.pageSize = size
    this.search()
  }

  pageIndexChange(index: number): void {
    this.filter.currentPage = index
    this.search()
  }
}
