import { ShareModule } from './../../shared/share-module/index'
import { Component, OnInit, ViewChild } from '@angular/core'
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree'
import { OpinionListService } from '../../services/business/opinion-list.service'
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms'
import { GlobalService } from '../../services/global.service'

@Component({
  selector: 'app-opinion-list',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './opinion-list.component.html',
  styleUrl: './opinion-list.component.scss',
})
export class OpinionListComponent implements OnInit {
  @ViewChild('treeCom', { static: false }) treeCom!: NzTreeComponent
  searchValue = ''
  nodes: any = []
  visible: boolean = false
  edit: boolean = false
  nodeCurrent!: any
  titleParent: string = ''

  validateForm: FormGroup = this.fb.group({
    id: ['', [Validators.required]],
    name: ['', [Validators.required]],
    pId: ['', [Validators.required]],
    children: [null],
    orderNumber: [null],
  })

  constructor(
    private _service: OpinionListService,
    private fb: NonNullableFormBuilder,
    private globalService: GlobalService,
  ) {
    this.globalService.setBreadcrumb([
      {
        name: 'Danh mục kiến nghị',
        path: 'business/opinion-list',
      },
    ])
  }

  ngOnInit(): void {
    this.getOpl()
  }

  getOpl() {
    this._service.GetOplTree().subscribe((res) => {
      this.nodes = [res]
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
      id: this.nodeCurrent?.id,
      name: this.nodeCurrent?.name,
      pId: this.nodeCurrent?.pId,
      children: [],
      orderNumber: this.nodeCurrent?.orderNumber,
    })
  }

  close() {
    this.visible = false
    this.resetForm()
  }

  reset() {
    this.searchValue = ''
    this.getOpl()
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
  }

  openCreate() {
    this.close()
    this.edit = false
    this.visible = true
    this.validateForm.get('pId')?.setValue(this.nodeCurrent?.id || 'R')
    this.validateForm.get('children')?.setValue([])
    this.validateForm.get('orderNumber')?.setValue(null)
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
    if (this.edit) {
      this._service.Update(this.validateForm.getRawValue()).subscribe({
        next: (data) => {
          this.getOpl()
        },
        error: (response) => {
          console.log(response)
        },
      })
    } else {
      console.log('data', this.validateForm.getRawValue())
      this._service.Insert(this.validateForm.getRawValue()).subscribe({
        next: (data) => {
          this.getOpl()
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
    this._service.UpdateOrderTree(treeData[0]).subscribe({
      next: (data) => {
        this.getOpl()
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
      id: node.origin.id,
      pId: node.parentNode?.key || '-',
      name: node.origin.name,
      children: children,
    }
  }

  deleteItem(node: any) {
    this._service.Delete(node.origin.id).subscribe({
      next: (data) => {
        this.getOpl()
      },
      error: (response) => {
        console.log(response)
      },
    })
  }
}
