import { Component } from '@angular/core'
import { ShareModule } from '../../shared/share-module'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { MgListTablesFilter } from '../../models/master-data/mg-list-tables.model'
import { PaginationResult } from '../../models/base.model'
import { MGLISTTABLE_RIGHTS } from '../../shared/constants'
import { MgListTablesService } from '../../services/master-data/mg-list-tables.service'
import { GlobalService } from '../../services/global.service'
import { PeriodTimeService } from '../../services/master-data/period-time.service'
import { AuditPeriodService } from '../../services/master-data/audit-period.service'
import { AuditPeriodFilter } from '../../models/master-data/audit-period.model'
import { PeriodTimeFilter } from '../../models/master-data/period-time.model'
import { ListTablesComponent } from '../../business/list-tables/list-tables.component'
import { ListTablesService } from '../../services/business/list-table.service'

@Component({
  selector: 'app-mg-list-tables',
  standalone: true,
  imports: [ShareModule, ListTablesComponent],
  templateUrl: './mg-list-tables.component.html',
  styleUrl: './mg-list-tables.component.scss',
})
export class MgListTablesComponent {
  validateForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    description: [''],
    timeYear: ['', [Validators.required]],
    auditPeriod: ['', [Validators.required]],
    isActive: [true, [Validators.required]],
  })
  tabIndex: number = 0
  temTree: any
  nodeCurrent!: any
  isSubmit: boolean = false
  visible: boolean = false
  edit: boolean = false
  filter = new MgListTablesFilter()
  auditPeriodfilter = new AuditPeriodFilter()
  periodTimefilter = new PeriodTimeFilter()
  paginationResult = new PaginationResult()
  loading: boolean = false
  MGLISTTABLE_RIGHTS = MGLISTTABLE_RIGHTS
  timeyear: any[] = []
  auditPeriod: any[] = []
  constructor(
    private _service: MgListTablesService,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
    private _ps: PeriodTimeService,
    private _ap: AuditPeriodService,
    private _lts: ListTablesService,
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách bảng biểu',
        path: 'master-data/mg-list-tables',
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
    this.getAllAuditPeriod()
    this.getAllPeriodTime()
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
    this._service.searchMgListTables(this.filter).subscribe({
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
      .exportExcelMgListTables(this.filter)
      .subscribe((result: Blob) => {
        const blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = window.URL.createObjectURL(blob)
        var anchor = document.createElement('a')
        anchor.download = 'danh-sach-bang-bieu.xlsx'
        anchor.href = url
        anchor.click()
      })
  }

  submitForm(): void {
    this.isSubmit = true
    if (this.validateForm.valid) {
      if (this.edit) {
        this._service
          .updateMgListTables(this.validateForm.getRawValue())
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
          .createMgListTables(this.validateForm.getRawValue())
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
    this.filter = new MgListTablesFilter()
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

  deleteItem(code: string | number) {
    this._service.deleteMgListTables(code).subscribe({
      next: (data) => {
        this.search()
      },
      error: (response) => {
        console.log(response)
      },
    })
  }

  openEdit(data: {
    code: string
    name: string
    description: string
    timeYear: string
    auditPeriod: string
    isActive: boolean
  }) {
    this._lts.GetLtbTreeWithMgCode(data.code).subscribe((res) => {
      this.nodeCurrent = res
      this.validateForm.patchValue({
        code: data.code,
        name: data.name,
        description: data.description,
        timeYear: data.timeYear,
        auditPeriod: data.auditPeriod,
        isActive: data.isActive,
      })
      setTimeout(() => {
        this.edit = true
        this.visible = true
      }, 200)
    })
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
  getAllAuditPeriod() {
    this._ap.searchAuditPeriod(this.auditPeriodfilter).subscribe({
      next: ({ data }) => {
        this.auditPeriod = data
      },
      error: (response) => {
        console.log(response)
      },
    })
  }
  getAllPeriodTime() {
    this._ps.searchPeriodTime(this.periodTimefilter).subscribe({
      next: ({ data }) => {
        this.timeyear = data
      },
      error: (response) => {
        console.log(response)
      },
    })
  }
  getNameAuditPeriod(auditPeriod: string) {
    if (!this.auditPeriod) {
      return null
    }
    return this.auditPeriod.find((x: { code: string }) => x.code == auditPeriod)
      ?.auditPeriod
  }
  onSelectedTab(event: any) {
    this.tabIndex = event
  }
  handleChildEvent(data: any) {
    this.temTree = data
  }
}
