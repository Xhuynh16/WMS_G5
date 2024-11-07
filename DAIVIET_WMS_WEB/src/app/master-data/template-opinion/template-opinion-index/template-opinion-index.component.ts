import { Component, ViewChild } from '@angular/core'
import { ShareModule } from '../../../shared/share-module'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { TemplateOpinitonFilter } from '../../../models/master-data/template-opininion.model'
import { BaseFilter, PaginationResult } from '../../../models/base.model'
import { TEMPLATE_OPINION_RIGHTS } from '../../../shared/constants'
import { TemplateOpinionService } from '../../../services/master-data/template-opinion.service'
import { GlobalService } from '../../../services/global.service'
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree'
import { PeriodTime } from '../../../shared/constants/period-time.constants'
import { TemplateOpinionEditComponent } from '../template-opinion-edit/template-opinion-edit.component'
import { AccountService } from '../../../services/system-manager/account.service'
import { AccountFilter } from '../../../models/system-manager/account.model'
import { OrganizeService } from '../../../services/system-manager/organize.service'

@Component({
  selector: 'app-template-opinion-index',
  standalone: true,
  imports: [ShareModule, TemplateOpinionEditComponent],
  templateUrl: './template-opinion-index.component.html',
  styleUrl: './template-opinion-index.component.scss',
})
export class TemplateOpinionIndexComponent {
  isSubmit: boolean = false
  visible: boolean = false
  edit: boolean = false
  username = ''
  tabIndex: number = 0
  temDetail: any
  nodeCurrent!: any
  optionsPeriodTime = PeriodTime
  accountsfilter = new AccountFilter()
  account: any[] = []
  organize: any = []
  filter = new TemplateOpinitonFilter()
  paginationResult = new PaginationResult()
  loading: boolean = false
  validateForm: FormGroup = this.fb.group({
    code: ['', [Validators.required]],
    name: ['', [Validators.required]],
    note: [''],
    orgCode: [''],
    timeYear: ['', [Validators.required]],
    isActive: [true, [Validators.required]],
  })
  TEMPLATE_OPINION_RIGHTS = TEMPLATE_OPINION_RIGHTS

  constructor(
    private _service: TemplateOpinionService,
    private _acs: AccountService,
    private _orgs: OrganizeService,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh sách template ý kiến',
        path: 'master-data/TemplateOpinion',
      },
    ])
    this.globalService.getLoading().subscribe((value) => {
      this.loading = value
    })
    const UserInfo = this.globalService.getUserInfo()
    this.username = UserInfo?.userName
  }
  ngOnDestroy() {
    this.globalService.setBreadcrumb([])
  }

  ngOnInit(): void {
    this.search()
    this.getAllAccount()
    this.getOrg()
  }

  onDragStart(event: any): void {
    // Handle drag start event
  }

  nzEvent(event: NzFormatEmitEvent): void {}
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
    this._service.searchTemplateOpinion(this.filter).subscribe({
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
      .exportExcelTemplateOpinion(this.filter)
      .subscribe((result: Blob) => {
        const blob = new Blob([result], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const url = window.URL.createObjectURL(blob)
        var anchor = document.createElement('a')
        anchor.download = 'danh-sach-template-y-kien.xlsx'
        anchor.href = url
        anchor.click()
      })
  }

  submitForm(): void {
    this.isSubmit = true
    if (this.validateForm.valid) {
      this.validateForm.patchValue({
        orgCode: this.username,
      })
      if (this.edit) {
        this._service
          .updateTemplateOpinion(this.validateForm.getRawValue())
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
          .createTemplateOpinion(this.validateForm.getRawValue())
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
    this.filter = new TemplateOpinitonFilter()
    this.search()
  }
  getFullName(createBy: string) {
    if (!this.account) {
      return null
    }
    return this.account.find(
      (x: { userName: string }) => x.userName == createBy,
    )?.fullName
  }

  getOrgName(createBy: string) {
    if (!this.account || !this.organize) {
      return null
    }
    const accountOrg = this.account.find(
      (x: { userName: string; organizeCode: string }) =>
        x.userName === createBy,
    )

    if (!accountOrg) {
      return null
    }
    return this.organize.find(
      (x: { id: string; name: string }) => x.id === accountOrg.organizeCode,
    )?.name
  }
  getOrg() {
    this._orgs.GetOrgTree().subscribe((res) => {
      this.organize = [res]
    })
  }
  getAllAccount() {
    this._acs.search(this.accountsfilter).subscribe({
      next: ({ data }) => {
        this.account = data
      },
      error: (response) => {
        console.log(response)
      },
    })
  }

  openCreate() {
    this.edit = false
    this.visible = true
    console.log('Visibility:', this.visible)
  }

  resetForm() {
    this.validateForm.reset()
    this.isSubmit = false
  }

  deleteItem(code: string | number) {
    this._service.deleteTemplateOpinion(code).subscribe({
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
    timeYear: number
    note: string
    orgCode: string
    isActive: boolean
  }) {
    this._service.GetTemWithTreee(data.code).subscribe((res) => {
      this.nodeCurrent = res
      this.validateForm.patchValue({
        code: data.code,
        name: data.name,
        timeYear: data.timeYear,
        note: data.note,
        orgCode: data.orgCode,
        isActive: data.isActive,
      })
      setTimeout(() => {
        this.edit = true
        this.visible = true
        console.log('Visibility:', this.visible)
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

  onSelectedTab(event: any) {
    this.tabIndex = event
  }
  handleChildEvent(data: any) {
    this.temDetail = data
  }
}
