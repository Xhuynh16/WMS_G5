import { ShareModule } from './../../shared/share-module/index'
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import {
  NzFormatEmitEvent,
  NzTreeComponent,
  NzTreeNodeOptions,
} from 'ng-zorro-antd/tree'
import { ListTablesService } from '../../services/business/list-table.service'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { GlobalService } from '../../services/global.service'

@Component({
  selector: 'app-list-tables',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './list-tables.component.html',
  styleUrl: './list-tables.component.scss',
})
export class ListTablesComponent implements OnInit {
  @Input() mgCode: string = ''
  @Output() childEvent = new EventEmitter<any>()
  @ViewChild('treeCom', { static: false }) treeCom!: NzTreeComponent
  searchValue = ''
  nodes: any = []
  originalNodes: any[] = []
  visible: boolean = false
  edit: boolean = false
  nodeCurrent!: any
  titleParent: string = ''

  validateForm: FormGroup = this.fb.group({
    code: [''],
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    pId: ['', [Validators.required]],
    children: [null],
    orderNumber: [null],
    mgCode: [''],
  })

  constructor(
    private _service: ListTablesService,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh mục bảng biểu',
        path: 'business/list-table',
      },
    ])
  }

  ngOnInit(): void {
    this.getLtbWithMgCode()
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mgCode'] && this.mgCode) {
      this.getLtbWithMgCode()
    }
  }

  getLtbWithMgCode() {
    this._service.GetLtbTreeWithMgCode(this.mgCode).subscribe((res) => {
      this.nodes = [res]
      this.originalNodes = [res]
    })
  }

  nzEvent(event: NzFormatEmitEvent): void {
    // console.log(event);
  }

  onDrop(event: any) {}

  onDragStart(event: any) {}

  onClick(node: any) {
    this.edit = true
    this.visible = true
    this.nodeCurrent = node?.origin
    this.titleParent = node.parentNode?.origin?.title || ''
    this.validateForm.setValue({
      code: this.nodeCurrent?.code,
      id: this.nodeCurrent?.id,
      name: this.nodeCurrent?.name,
      pId: this.nodeCurrent?.pId,
      children: [],
      orderNumber: this.nodeCurrent?.orderNumber,
      mgCode: this.nodeCurrent?.mgCode || this.mgCode,
    })
    console.log(this.validateForm.value)
  }

  close() {
    this.visible = false
    this.resetForm()
  }

  reset() {
    this.searchValue = ''
    this.getLtbWithMgCode()
    this.nodes = [...this.originalNodes]
  }

  resetForm() {
    this.validateForm.reset()
  }

  openCreateChild(node: any) {
    this.close()
    this.edit = false
    this.visible = true
    this.validateForm.get('pId')?.setValue(node?.origin.id)
    this.validateForm.get('orderNumber')?.setValue(null)
    this.validateForm.get('children')?.setValue([])
    this.validateForm.get('mgCode')?.setValue(this.mgCode)
  }

  openCreate() {
    this.close()
    this.edit = false
    this.visible = true
    this.validateForm.get('pId')?.setValue(this.nodeCurrent?.id || 'R')
    this.validateForm.get('children')?.setValue([])
    this.validateForm.get('orderNumber')?.setValue(null)
    this.validateForm.get('mgCode')?.setValue(this.mgCode)
  }

  submitForm() {
    if (!this.validateForm.valid) {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty()
          control.updateValueAndValidity({ onlySelf: true })
        }
      })
      return
    }
    const formData = this.validateForm.getRawValue()
    if (this.edit) {
      this._service.Update(formData).subscribe({
        next: (data) => {
          this.getLtbWithMgCode()
        },
        error: (response) => {
          console.log(response)
        },
      })
    } else {
      formData.code = this.generateUUID()
      this._service.Insert(formData).subscribe({
        next: (data) => {
          this.getLtbWithMgCode()
          console.log(data)
        },
        error: (response) => {
          console.log(response)
        },
      })
    }
  }

  updateOrderTree() {
    const treeData = this.treeCom
      .getTreeNodes()
      .map((node) => this.mapNode(node))
    const updatedTreeData = {
      ...treeData[0],
      mgCode: this.mgCode,
    }
    this._service.UpdateOrderTree(updatedTreeData).subscribe({
      next: (data) => {
        this.getLtbWithMgCode()
      },
      error: (response) => {
        console.log(response)
      },
    })
  }

  private mapNode(node: any): any {
    const children = node.children
      ? node.children.map((child: any) => this.mapNode(child))
      : []
    return {
      code: node.origin.code,
      id: node.origin.id,
      pId: node.parentNode?.key || '-',
      name: node.origin.name,
      children: children,
      mgCode: this.mgCode,
    }
  }

  deleteItem(node: any) {
    this._service.Delete(node.origin.code).subscribe({
      next: (data) => {
        this.getLtbWithMgCode()
      },
      error: (response) => {
        console.log(response)
      },
    })
  }
  generateUUID(): string {
    let d = new Date().getTime()
    if (window.performance && typeof window.performance.now === 'function') {
      d += performance.now() // Thêm độ chính xác của thời gian
    }
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      (c) => {
        const r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
      },
    )
    return uuid
  }
  searchTables(searchValue: string) {
    const filterNode = (node: NzTreeNodeOptions): boolean => {
      if (node.title.toLowerCase().includes(searchValue.toLowerCase())) {
        return true
      } else if (node.children) {
        node.children = node.children.filter((child) => filterNode(child))
        return node.children.length > 0
      }
      return false
    }

    if (!searchValue) {
      this.nodes = [...this.originalNodes]
    } else {
      this.nodes = this.originalNodes
        .map((node) => ({ ...node }))
        .filter((node) => filterNode(node))
    }
  }
}
