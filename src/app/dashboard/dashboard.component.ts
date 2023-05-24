import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  responseMessage: any;
  data: any;

  ngAfterViewInit() {}

  constructor(
    private dashboardService: DashboardService,
    private snackBarService: SnackbarService
  ) {
    this.getDashboardData();
  }

  getDashboardData() {
    this.dashboardService.getDetails().subscribe(
      (response: any) => {
        this.data = response;
      },
      (error: any) => {
        if (error.error?.message) this.responseMessage = error.error?.message;
        this.responseMessage = GlobalConstants.genericError;
        this.snackBarService.openSnackBar(this.responseMessage, 'error');
      }
    );
  }
}
