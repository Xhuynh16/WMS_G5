import {Routes} from '@angular/router';
import { ExportComponent } from './export/export.component';
import { ImportComponent } from './import/import.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ImportDetailsComponent } from './import/import-details/import-details/import-details.component';
import { ExportDetailsComponent } from './export/export-details/export-details.component';

export const businessRoutes: Routes = [
    {path: 'export', component: ExportComponent},
    {path: 'import', component: ImportComponent},
    {path: 'inventory', component: InventoryComponent},
    {
        path: 'import-details/:id',
        component: ImportDetailsComponent,
      },
      {
        path: 'export-details/:id',
        component: ExportDetailsComponent,
      }
];
