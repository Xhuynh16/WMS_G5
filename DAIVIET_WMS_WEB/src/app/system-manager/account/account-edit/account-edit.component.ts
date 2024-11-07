import { Component, Input, HostListener } from '@angular/core'
import { ShareModule } from '../../../shared/share-module'
import { FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms'
import { DropdownService } from '../../../services/dropdown/dropdown.service'
import { AccountService } from '../../../services/system-manager/account.service'
import { RightService } from '../../../services/system-manager/right.service'
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree'
import { UserTypeCodes } from '../../../shared/constants/account.constants'
import { ActivatedRoute } from '@angular/router'
import { AuthService } from '../../../services/auth.service'
import { GlobalService } from '../../../services/global.service'

@Component({
  selector: 'app-account-edit',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.scss',
})
export class AccountEditComponent {
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.widthDeault =
      window.innerWidth <= 767
        ? `${window.innerWidth}px`
        : `${window.innerWidth * 0.7}px`
  }

  @Input() reset: () => void = () => {}
  @Input() visible: boolean = false
  @Input() close: () => void = () => {}
  @Input() userName: string | number = ''

  optionsGroup: any[] = []
  widthDeault: string = '0px'
  heightDeault: number = 0

  validateForm: FormGroup = this.fb.group({
    userName: ['', [Validators.required]],
    fullName: ['', [Validators.required]],
    address: [''],
    phoneNumber: ['', [Validators.pattern('^0\\d{9,10}$')]],
    email: ['', [Validators.email]],
    isActive: [true],
    accountType: ['', [Validators.required]],
    partnerId: [''],
  })

  nodes: any[] = []
  nodesConstant: any[] = []
  initialCheckedNodes: any[] = []
  searchValue = ''
  listPartnerCustomer: any[] = []
  UserTypeCodes = UserTypeCodes
  isShowSelectPartner: boolean = false

  constructor(
    private _service: AccountService,
    private fb: NonNullableFormBuilder,
    private dropdownService: DropdownService,
    private rightService: RightService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private globalService: GlobalService,
  ) {
    this.widthDeault =
      window.innerWidth <= 767
        ? `${window.innerWidth}px`
        : `${window.innerWidth * 0.7}px`
    this.heightDeault = window.innerHeight - 200
  }

  ngOnInit(): void {
    this.loadInit()
  }

  loadInit() {
    this.getAllPartner()
    this.getRight()
  }

  changeSaleType(value: string) {}
  getRight() {
    this.rightService.GetRightTree().subscribe((res) => {
      this.nodes = this.mapTreeNodes(res)
    })
  }
  mapTreeNodes(data: any): any[] {
    return data.children
      ? data.children.map((node: any) => ({
          title: node.id + '-' + node.name,
          key: node.id,
          checked: node.isChecked,
          expanded: true,
          children: this.mapTreeNodes(node),
        }))
      : []
  }

  onCheckBoxChange(event: any): void {
    const checkedNode = event.node
    const nodes = this.flattenKeys(this.nodesConstant)
    if (checkedNode.isChecked) {
      if (nodes.includes(checkedNode.key)) {
        checkedNode.origin.InChecked = false
        checkedNode.origin.OutChecked = false
      } else {
        checkedNode.origin.InChecked = true
      }
    } else {
      if (nodes.includes(checkedNode.key)) {
        checkedNode.origin.OutChecked = true
        checkedNode.origin.InChecked = false
      } else {
        checkedNode.origin.OutChecked = false
        checkedNode.origin.InChecked = false
      }
    }
  }

  flattenKeys(data: any) {
    return data.reduce((keys: any, item: any) => {
      if (item.checked) {
        keys.push(item.key)
      }
      if (item.children && item.children.length > 0) {
        keys.push(...this.flattenKeys(item.children))
      }
      return keys
    }, [])
  }

  onNodeCheckChange(node: any): void {
    node.checked = !node.checked
  }

  getCheckedNodes(nodes: any[]): any[] {
    let checkedNodes: any[] = []
    for (let node of nodes) {
      if (node.checked) {
        checkedNodes.push(node)
      }
      if (node.children) {
        checkedNodes = checkedNodes.concat(this.getCheckedNodes(node.children))
      }
    }
    return checkedNodes
  }

  nzEvent(event: NzFormatEmitEvent): void {
    console.log(event)
  }

  getAllGroup(listGroup: any = []) {
    this.dropdownService.getAllAccountGroup().subscribe({
      next: (data) => {
        this.optionsGroup = data.map((item: any) => {
          return {
            ...item,
            title: item?.name,
            direction: listGroup.some(
              (group: any) => group?.groupId === item?.id,
            )
              ? 'right'
              : 'left',
          }
        })
      },
      error: (response) => {
        console.log(response)
      },
    })
  }

  getDetail(userName: string = '') {
    this._service
      .getDetail({
        userName: userName,
      })
      .subscribe({
        next: (data) => {
          this.getAllGroup(data?.account_AccountGroups)
          this.validateForm.setValue({
            userName: data.userName,
            fullName: data.fullName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            email: data.email,
            isActive: data.isActive,
            accountType: data.accountType,
            partnerId: data.partnerId || '',
          })
          this.isShowSelectPartner = data.accountType === 'KH' ? true : false
          this.initialCheckedNodes = data?.listAccountGroupRight?.map(
            (node: any) => node.rightId,
          )
          this.nodes = this.mapTreeNodes(data.treeRight)
          this.nodesConstant = [...this.mapTreeNodes(data.treeRight)]
        },
        error: (response) => {
          console.log(response)
        },
      })
  }
  onUserTypeChange(value: string) {
    let partnerIdControl = this.validateForm.get('partnerId')
    if (value === 'KH') {
      this.isShowSelectPartner = true
      partnerIdControl!.setValidators([Validators.required])
    } else {
      this.isShowSelectPartner = false
      partnerIdControl!.setValidators([])
    }
    partnerIdControl!.updateValueAndValidity()
  }

  getAllPartner() {
    this.dropdownService
      .getAllPartner({
        IsCustomer: true,
        SortColumn: 'name',
        IsDescending: true,
      })
      .subscribe({
        next: (data) => {
          this.listPartnerCustomer = data
        },
        error: (response) => {
          console.log(response)
        },
      })
  }

  submitForm(): void {
    const listAccountGroupRight = this.getCheckedNodes(this.nodes).map(
      (element: any) => ({
        rightId: element.key,
      }),
    )
    const account_AccountGroups = this.optionsGroup?.reduce(
      (result: any, item: any) => {
        if (item?.direction == 'right') {
          return [
            ...result,
            {
              groupId: item?.id,
            },
          ]
        }
        return result
      },
      [],
    )
    if (this.validateForm.valid) {
      const formValue = this.validateForm.value
      const { partnerId, ...rest } = formValue
      let insertObj = {}
      if (this.isShowSelectPartner) {
        insertObj = formValue
      } else {
        insertObj = rest
      }
      this._service
        .update({
          ...insertObj,
          accountRights: listAccountGroupRight,
          account_AccountGroups,
        })
        .subscribe({
          next: (data) => {
            if (this.globalService.getUserInfo().userName) {
              this.authService
                .getRightOfUser({
                  userName: this.globalService.getUserInfo().userName,
                })
                .subscribe({
                  next: (rights) => {
                    this.globalService.setRightData(
                      JSON.stringify(rights || []),
                    )
                  },
                  error: (error) => {
                    console.error('Get right of user failed:', error)
                  },
                })
            }
            this.reset()
          },
          error: (response) => {
            console.log(response)
          },
        })
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      })
    }
  }
  onDrop(event: any): void {
    // Handle drop event
  }
  onClick(event: any): void {}
  closeDrawer() {
    this.close()
    this.resetForm()
  }

  resetForm() {
    this.validateForm.reset()
    const partnerIdControl = this.validateForm.get('partnerId')
    partnerIdControl!.setValidators([])
  }
}
