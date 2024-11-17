import {Routes} from '@angular/router';
import { Report01Component } from './report-01/report-01.component';
import { Report02Component } from './report-02/report-02.component';
import { Report03Component } from './report-03/report-03.component';

export const reportRoutes: Routes = [
    { path: 'report-01', component: Report01Component },
    { path: 'report-02', component: Report02Component },
    { path: 'report-03', component: Report03Component },
];
