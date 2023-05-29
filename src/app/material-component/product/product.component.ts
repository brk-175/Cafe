import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ProductActionsComponent } from '../product-actions/product-actions.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'categoryName',
    'description',
    'price',
    'actions',
  ];
  dataSource: any;
  responseMessage: any;
  length1: any;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private snackBarService: SnackbarService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getTableData();
  }

  getTableData() {
    this.productService.getAllProducts().subscribe(
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

  handleEditAction(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'edit',
      data: data,
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(ProductActionsComponent, dialogConfig);
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

  handleAddAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'add',
    };
    dialogConfig.width = '850px';
    const dialogRef = this.dialog.open(ProductActionsComponent, dialogConfig);
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

  handleDeleteAction(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'Delete a Product?',
      confirmation: true,
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe(
      (response: any) => {
        dialogRef.close();
        this.productService.deleteProduct(data.id).subscribe(
          (response: any) => {
            this.getTableData();
            this.responseMessage = response.message;
            this.snackBarService.openSnackBar(this.responseMessage, 'success');
          },
          (error: any) => {
            if (error.error?.message)
              this.responseMessage = error.error?.message;
            else this.responseMessage = GlobalConstants.genericError;
            return this.snackBarService.openSnackBar(
              this.responseMessage,
              'error'
            );
          }
        );
      }
    );
  }

  handleChangeStatus(status: any, id: any) {
    const data = {
      status: status.toString(),
      id: id,
    };
    this.productService.changeProductStatus(data).subscribe(
      (response: any) => {
        this.getTableData();
        this.responseMessage = response.message;
        this.snackBarService.openSnackBar(this.responseMessage, 'success');
      },
      (error: any) => {
        if (error.error?.message) this.responseMessage = error.error?.message;
        else this.responseMessage = GlobalConstants.genericError;
        return this.snackBarService.openSnackBar(this.responseMessage, 'error');
      }
    );
  }
}
