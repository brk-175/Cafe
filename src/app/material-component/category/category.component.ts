import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryActionsComponent } from '../category-actions/category-actions.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'edit'];
  dataSource: any;
  responseMessage: any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private snackBarService: SnackbarService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.getTableData();
  }

  getTableData() {
    this.categoryService.getAllCategories().subscribe(
      (response: any) => {
        this.dataSource = new MatTableDataSource(response);
      },
      (error: any) => {
        if (error.error?.message) this.responseMessage = error.error?.message;
        else this.responseMessage = GlobalConstants.genericError;
        return this.snackBarService.openSnackBar(this.responseMessage, 'error');
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddCategory() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'add',
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(CategoryActionsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe(
      (response: any) => {
        this.getTableData();
        dialogRef.close();
      }
    );
  }

  handleEditAction(element: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'edit',
      data: element,
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(CategoryActionsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe(
      (response: any) => {
        this.getTableData();
        dialogRef.close();
      }
    );
  }
}
