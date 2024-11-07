import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { ShareModule } from '../../../shared/share-module'
import { TEMPLATE_OPINION_RIGHTS } from '../../../shared/constants'
import {
  NzFormatEmitEvent,
  NzTreeComponent,
  NzTreeNode,
  NzTreeNodeOptions,
} from 'ng-zorro-antd/tree'
import { TemplateOpinionDataService } from '../../../services/master-data/template-opinion-data.service'
import { NzMessageService } from 'ng-zorro-antd/message'
import { generate } from 'ng-zorro-antd/core/color'
import { forkJoin } from 'rxjs'

@Component({
  selector: 'app-template-opinion-edit',
  standalone: true,
  imports: [ShareModule],
  templateUrl: './template-opinion-edit.component.html',
  styleUrl: './template-opinion-edit.component.scss',
})
export class TemplateOpinionEditComponent {
  @Input() temDetail!: any
  @Output() childEvent = new EventEmitter<any>()
  @ViewChild('treeOrganize') treeOrganize!: NzTreeComponent
  @ViewChild('treeOpinionList') treeOpinionList!: NzTreeComponent
  organizeNodes: any[] = []
  opinionNodes: any[] = []
  loading: boolean = false
  searchValue: string = ''
  searchValueOpinion: string = ''
  previouslyCheckedOrgs: string[] = []
  newlyCheckedOrg: string | null = null
  TEMPLATE_OPINION_RIGHTS = TEMPLATE_OPINION_RIGHTS
  selectedOrgCode: string | null = null
  currentSelectedOrgCode: string | null = null
  originalOpinionNodes: any[] = []
  originalOrganizeNodes: any[] = []
  recentlyUncheckedOpinions: Set<string> = new Set()
  constructor(
    private templateOpinionDataService: TemplateOpinionDataService,
    private message: NzMessageService,
  ) {}
  ngOnInit() {
    // Khởi tạo các organize đã được chọn trước đó
    this.previouslyCheckedOrgs = this.temDetail.treeOrgannize.children
      .filter((org: any) => org.isChecked)
      .map((org: any) => org.id)
    this.originalOpinionNodes = [...this.opinionNodes]
    this.originalOrganizeNodes = [...this.organizeNodes]
  }
  nzEvent(event: NzFormatEmitEvent): void {}

  getCheckedNodes(nodes: any[]): any[] {
    //lấy danh sách các node đã được chọn
    let checkedNodes: any[] = []
    for (let node of nodes) {
      if (node.checked) {
        checkedNodes.push(node)
        if (node.children) {
          checkedNodes = checkedNodes.concat(
            this.getCheckedNodes(node.children),
          )
        }
      }
    }
    return checkedNodes
  }
  onOpinionCheckChange(event: NzFormatEmitEvent): void {
    const opinionNode = event.node!
    if (!opinionNode.isChecked) {
      this.recentlyUncheckedOpinions.add(opinionNode.key)
    } else {
      this.recentlyUncheckedOpinions.delete(opinionNode.key)
    }
    console.log(this.recentlyUncheckedOpinions.values().next().value)
  }
  deleteUncheckedOpinion(): void {
    const orgCode = this.selectedOrgCode ?? ''
    const templateCode = this.temDetail.code

    const opinionCode = this.recentlyUncheckedOpinions.values().next().value

    this.loading = true // Lấy ý kiến đầu tiên bị bỏ chọn

    this.templateOpinionDataService
      .deleteTemplateOpinionData({
        orgCode: orgCode,
        opinionCode: opinionCode,
        templateCode: templateCode,
      })
      .subscribe({
        next: (response) => {
          this.message.success('Xóa thành công')
          this.sendDataToParent()
          this.loading = false
        },
        error: (error) => {
          this.message.error('Xóa thất bại: ' + error.message)
          console.log(error)
          this.loading = false
        },
      })
  }

  onOrganizeNodeClick(event: NzFormatEmitEvent): void {
    //Khi click vào một organize, cập nhật danh sách (opinionNodes) tương ứng.
    if (event && event.node) {
      this.selectedOrgCode = event.node?.key ?? null
      this.currentSelectedOrgCode = event.node.key
      this.updateOpinionList(event.node)
    } else {
      if (event.node) {
        this.selectedOrgCode = event.node.key
        this.updateOpinionList(event.node)
      }
    }
  }
  sendDataToParent() {
    const organizeChecked = this.getCheckedNodes(this.organizeNodes)
    const opinionChecked = this.getCheckedNodes(this.opinionNodes)
    this.childEvent.emit({
      organizeChecked,
      opinionChecked,
    })
  }

  onCheckChange() {
    //Khi checked của organize thay đổi, ktra xem có chọn 1 organize hay ko.
    const selectedOrganize = this.treeOrganize.getCheckedNodeList()
    if (selectedOrganize.length > 1) {
      this.message.error('Vui lòng chỉ chọn một đơn vị')
      // Reset check state
      this.treeOrganize.nzCheckedKeys = [selectedOrganize[0].key]
    }
    this.sendDataToParent()
  }
  updateOpinionList(orgNode: NzTreeNode): void {
    //Cập nhật orgNode dựa trên organize được chọn.
    // Nếu organize có giá trị opinion trên (treeOpinionList), nó sẽ sử dụng dữ liệu này,
    // nếu không, nó sẽ sử dụng dữ liệu mặc định từ temDetail.
    if (!orgNode) return

    // Tìm dữ liệu của organize node từ dữ liệu gốc
    const orgData = this.temDetail.treeOrgannize.children.find(
      (org: any) => org.id === orgNode.key,
    )

    if (orgData && orgData.treeOpinionList) {
      this.opinionNodes = this.mapTreeNodes({
        children: orgData.treeOpinionList,
      })
    } else {
      this.opinionNodes = this.mapTreeNodes(this.temDetail.treeOpinionList)
    }

    this.updateOpinionCheckedStatus(
      this.opinionNodes,
      orgData ? orgData.treeOpinionList : [],
    )

    if (this.treeOpinionList) {
      this.treeOpinionList.nzTreeService.initTree(this.opinionNodes)
      this.expandAllNodes(this.opinionNodes)
    }
  }
  expandAllNodes(nodes: any[]): void {
    //Mở rộng tất cả các node trong cây để chúng hiển thị hết.
    nodes.forEach((node) => {
      node.expanded = true
      if (node.children && node.children.length > 0) {
        this.expandAllNodes(node.children)
      }
    })
  }
  updateOpinionCheckedStatus(nodes: any[], dbOpinions: any[]): void {
    nodes.forEach((node) => {
      const dbOpinion = dbOpinions.find((op: any) => op.id === node.key)
      if (dbOpinion) {
        node.checked = dbOpinion ? dbOpinion.isChecked : false
      }
      if (node.children) {
        this.updateOpinionCheckedStatus(node.children, dbOpinions)
      }
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['temDetail'] && changes['temDetail'].currentValue) {
      const temDetail = changes['temDetail'].currentValue
      if (temDetail.treeOrgannize) {
        this.organizeNodes = this.mapTreeNodes(temDetail.treeOrgannize)
      }
      if (temDetail.treeOpinionList) {
        this.opinionNodes = this.mapTreeNodes(temDetail.treeOpinionList)
      }

      this.sendDataToParent()
    }
  }

  mapTreeNodes(data: any): any[] {
    if (!data || !data.children) return []

    return data.children.map((node: any) => {
      const mappedNode = {
        id: node.id,
        name: node.name,
        pId: node.pId,
        title: node.title,
        key: node.id,
        checked: node.isChecked,
        isLeaf: !node.children || node.children.length === 0,
        children: [],
      }

      if (node.children && node.children.length > 0) {
        ;(mappedNode as any).children = this.mapTreeNodes(node)
        // Truyền trạng thái checked xuống các node con
        if (mappedNode.checked) {
          this.setAllChildrenChecked(mappedNode.children)
        }
      }

      return mappedNode
    })
  }
  setAllChildrenChecked(nodes: any[]): void {
    //Set checked cho tất cả các node con khi node cha được chọn
    nodes.forEach((node) => {
      node.checked = true
      if (node.children) {
        this.setAllChildrenChecked(node.children)
      }
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
  submitFormData() {
    const selectedOrganize = this.treeOrganize.getCheckedNodeList()
    const selectedOpinions = this.getAllCheckedNodes(
      this.treeOpinionList.getTreeNodes(),
    )
    const leafOpinions = selectedOpinions.filter(
      (node) => !node.children || node.children.length === 0,
    )
    if (selectedOrganize.length === 0 && leafOpinions.length === 0) {
      this.message.error('Vui lòng chọn ít nhất một đơn vị')
      return
    }

    if (leafOpinions.length === 0) {
      this.message.error('Vui lòng chọn ít nhất một kiến nghị')
      return
    }

    const templateCode = this.temDetail.code

    let dataToSave: any[] = []

    if (this.newlyCheckedOrg) {
      // Chỉ lưu dữ liệu cho organize mới được chọn
      const newOrg = selectedOrganize.find(
        (org) => org.key === this.newlyCheckedOrg,
      )
      if (newOrg) {
        dataToSave = selectedOpinions.map((opinion) => ({
          code: this.generateUUID(),
          orgCode: newOrg.key,
          opinionCode: opinion.key,
          templateCode: templateCode,
          isActive: true,
        }))
      }
    } else {
      // Trường hợp thêm mới opinion cho organize đã tồn tại
      const existingOrg = selectedOrganize.find((org) =>
        this.previouslyCheckedOrgs.includes(org.key),
      )
      console.log('exiting', existingOrg)

      if (existingOrg) {
        const existingOpinions = this.getExistingOpinions(existingOrg.key)
        const newOpinions = selectedOpinions.filter(
          (opinion) => !existingOpinions.some((eo) => eo.id === opinion.key),
        )
        console.log('old', existingOpinions)

        console.log('new', newOpinions)

        dataToSave = newOpinions.map((opinion) => ({
          code: this.generateUUID(),
          orgCode: existingOrg.key,
          opinionCode: opinion.key,
          templateCode: templateCode,
          isActive: true,
        }))
      }
    }
    console.log('newcheck', this.newlyCheckedOrg)
    if (dataToSave.length === 0) {
      this.message.info('Không có dữ liệu mới để lưu')
      return
    }

    this.templateOpinionDataService
      .createTemplateOpinionData(dataToSave)
      .subscribe({
        next: (response) => {
          this.message.success('Lưu thành công')
          // Cập nhật danh sách các organize đã được chọn
          if (this.newlyCheckedOrg) {
            this.previouslyCheckedOrgs.push(this.newlyCheckedOrg)
            this.newlyCheckedOrg = null
          }
          this.sendDataToParent()
          // Cập nhật lại dữ liệu local sau khi lưu thành công
          this.updateLocalData(dataToSave)
        },
        error: (error) => {
          this.message.error('Lưu thất bại: ' + error.message)
          console.log(error)
        },
      })
  }

  getExistingOpinions(orgCode: string): any[] {
    const org = this.temDetail.treeOrgannize.children.find(
      (org: any) => org.id === orgCode,
    )

    const getCheckedOpinions = (opinions: any[]): any[] => {
      let result: any[] = []
      opinions.forEach((op) => {
        if (op.isChecked) {
          result.push({
            id: op.id,
            title: op.title,
            isChecked: op.isChecked,
          })
        }
        if (op.children && op.children.length > 0) {
          result = result.concat(getCheckedOpinions(op.children))
        }
      })
      return result
    }

    if (org && org.treeOpinionList) {
      return getCheckedOpinions(org.treeOpinionList)
    }
    return []
  }

  resetAfterSave(): void {
    this.newlyCheckedOrg = null
    this.previouslyCheckedOrgs = this.treeOrganize
      .getCheckedNodeList()
      .map((node) => node.key)
  }

  updateLocalData(newData: any[]): void {
    newData.forEach((item) => {
      const orgIndex = this.temDetail.treeOrgannize.children.findIndex(
        (org: any) => org.id === item.orgCode,
      )
      if (orgIndex === -1) {
        // Nếu organize chưa tồn tại, thêm mới
        this.temDetail.treeOrgannize.children.push({
          id: item.orgCode,
          isChecked: true,
          treeOpinionList: [{ id: item.opinionCode, isChecked: true }],
        })
      } else {
        // Nếu organize đã tồn tại, thêm opinion mới
        const org = this.temDetail.treeOrgannize.children[orgIndex]
        if (!org.treeOpinionList) {
          org.treeOpinionList = []
        }
        if (
          !org.treeOpinionList.some((op: any) => op.id === item.opinionCode)
        ) {
          org.treeOpinionList.push({ id: item.opinionCode, isChecked: true })
        }
      }
    })
    if (this.selectedOrgCode) {
      const node = this.treeOrganize.getTreeNodeByKey(this.selectedOrgCode)
      if (node) {
        this.updateOpinionList(node)
      }
    }
  }
  onOrganizeCheckChange(event: NzFormatEmitEvent): void {
    const checkedNode = event.node!
    if (this.previouslyCheckedOrgs.includes(checkedNode.key)) {
      if (!checkedNode.isChecked) {
        checkedNode.isChecked = true
        this.treeOrganize.nzTreeService.setCheckedNodeList(checkedNode)
        return
      }
    }
    if (checkedNode.isChecked) {
      if (!this.previouslyCheckedOrgs.includes(checkedNode.key)) {
        if (this.newlyCheckedOrg) {
          const previousNewNode = this.treeOrganize.getTreeNodeByKey(
            this.newlyCheckedOrg,
          )
          if (previousNewNode) {
            previousNewNode.isChecked = false
            this.treeOrganize.nzTreeService.setCheckedNodeList(previousNewNode)
          }
        }
        this.newlyCheckedOrg = checkedNode.key
      }
    } else {
      if (checkedNode.key === this.newlyCheckedOrg) {
        this.newlyCheckedOrg = null
      }
    }

    this.treeOrganize.nzTreeService.setCheckedNodeList(checkedNode)
  }

  getAllCheckedNodes(nodes: NzTreeNode[]): NzTreeNode[] {
    let checkedNodes: NzTreeNode[] = []
    for (let node of nodes) {
      if (node.isChecked || node.isHalfChecked) {
        checkedNodes.push(node)
      }
      if (node.children) {
        checkedNodes = checkedNodes.concat(
          this.getAllCheckedNodes(node.children),
        )
      }
    }
    return checkedNodes
  }

  searchOpinionList(searchValueOpinion: string) {
    const filterNode = (node: NzTreeNodeOptions): boolean => {
      if (node.title.toLowerCase().includes(searchValueOpinion.toLowerCase())) {
        return true
      } else if (node.children) {
        node.children = node.children.filter((child) => filterNode(child))
        return node.children.length > 0
      }
      return false
    }

    if (!searchValueOpinion) {
      this.opinionNodes = [...this.originalOpinionNodes]
    } else {
      this.opinionNodes = this.originalOpinionNodes
        .map((node) => ({ ...node }))
        .filter((node) => filterNode(node))
    }
  }

  searchOrganize(searchValue: string) {
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
      this.organizeNodes = [...this.originalOrganizeNodes]
    } else {
      this.organizeNodes = this.originalOrganizeNodes
        .map((node) => ({ ...node }))
        .filter((node) => filterNode(node))
    }
  }
}
