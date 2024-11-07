import { Component } from '@angular/core';
import { ShareModule } from '../shared/share-module';
import { DashboardchartComponent } from './dashboard/dashboardchart/dashboardchart.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ShareModule, DashboardchartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
