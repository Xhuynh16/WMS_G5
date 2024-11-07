import { Routes } from '@angular/router'
import { CurrencyComponent } from './currency/currency.component'
import { UnitComponent } from './unit/unit.component'
import { LocalComponent } from './local/local.component'
import { AreaComponent } from './area/area.component'
import { OpinionTypeComponent } from './opinion-type/opinion-type.component'
import { PeriodTimeComponent } from './period-time/period-time.component'
import { TemplateOpinionIndexComponent } from './template-opinion/template-opinion-index/template-opinion-index.component'
import { AuditPeriodComponent } from './audit-period/audit-period.component'
import { MgListTablesComponent } from './mg-list-tables/mg-list-tables.component'
import { ProductComponent } from './product/product.component'
import { SupplierComponent } from './supplier/supplier.component'
export const masterDataRoutes: Routes = [
  { path: 'currency', component: CurrencyComponent },
  { path: 'unit', component: UnitComponent },
  { path: 'local', component: LocalComponent },
  { path: 'area', component: AreaComponent },
  { path: 'opinion-type', component: OpinionTypeComponent },
  { path: 'audit-year', component: PeriodTimeComponent },
  { path: 'template-opinion', component: TemplateOpinionIndexComponent },
  { path: 'audit-period', component: AuditPeriodComponent },
  { path: 'mg-list-tables', component: MgListTablesComponent },
  { path: 'product', component: ProductComponent},
  { path: 'supplier', component: SupplierComponent},

]
