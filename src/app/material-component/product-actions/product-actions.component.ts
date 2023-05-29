import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-product-actions',
  templateUrl: './product-actions.component.html',
  styleUrls: ['./product-actions.component.scss'],
})
export class ProductActionsComponent implements OnInit {
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  productForm: any = FormGroup;
  dialogAction: any = 'add';
  action: any = 'Add';
  categories: any = [];
  responseMessage: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductComponent>,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      categoryId: [null, [Validators.required]],
      description: [null, [Validators.required]],
      price: [null, [Validators.required]],
    });
    if (this.dialogData.action === 'edit') {
      this.dialogAction = 'edit';
      this.action = 'Update';
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe(
      (response: any) => {
        this.categories = response;
      },
      (error: any) => {
        if (error.error?.message) this.responseMessage = error.error?.message;
        else this.responseMessage = GlobalConstants.genericError;
        this.snackBarService.openSnackBar(this.responseMessage, 'error');
      }
    );
  }

  handleSubmit() {
    if (this.dialogAction == 'add') this.add();
    else this.edit();
  }

  edit() {
    const formData = this.productForm.value;
    const data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      description: formData.description,
      price: formData.price,
    };
    this.productService.updateProduct(data).subscribe(
      (response: any) => {
        this.onEditCategory.emit();
        this.responseMessage = response.message;
        this.snackBarService.openSnackBar(this.responseMessage, 'success');
      },
      (error: any) => {
        if (error.error?.message) this.responseMessage = error.error?.message;
        else this.responseMessage = GlobalConstants.genericError;
        this.snackBarService.openSnackBar(this.responseMessage, 'error');
      }
    );
  }

  add() {
    const formData = this.productForm.value;
    const data = {
      name: formData.name,
      categoryId: formData.categoryId,
      description: formData.description,
      price: formData.price,
    };
    this.productService.addProduct(data).subscribe(
      (response: any) => {
        this.onAddCategory.emit();
        this.responseMessage = response.message;
        this.snackBarService.openSnackBar(this.responseMessage, 'success');
      },
      (error: any) => {
        if (error.error?.message) this.responseMessage = error.error?.message;
        else this.responseMessage = GlobalConstants.genericError;
        this.snackBarService.openSnackBar(this.responseMessage, 'error');
      }
    );
  }
}
