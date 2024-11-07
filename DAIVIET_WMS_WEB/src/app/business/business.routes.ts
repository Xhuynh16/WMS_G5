import {Routes} from '@angular/router';
import { ExportComponent } from './export/export.component';
import { ImportComponent } from './import/import.component';
import { InventoryComponent } from './inventory/inventory.component';

export const businessRoutes: Routes = [
    {path: 'export', component: ExportComponent},
    {path: 'import', component: ImportComponent},
    {path: 'inventory', component: InventoryComponent},
];
