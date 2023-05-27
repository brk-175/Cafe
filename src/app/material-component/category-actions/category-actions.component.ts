import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from 'src/app/services/category.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../category/category.component';

@Component({
  selector: 'app-category-actions',
  templateUrl: './category-actions.component.html',
  styleUrls: ['./category-actions.component.scss'],
})
export class CategoryActionsComponent implements OnInit {
  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm: any = FormGroup;
  dialogAction: any = 'Add';
  action: any = 'Add';
  responseMessage: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<CategoryComponent>,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required]],
    });
    if (this.dialogData.action === 'edit') {
      this.dialogAction = 'edit';
      this.action = 'Update';
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  handleSubmit() {
    if (this.dialogAction === 'edit') this.edit();
    else this.add();
  }

  edit() {
    const formData = this.categoryForm.value;
    const data = {
      id: this.dialogData.data.id,
      name: formData.name,
    };
    this.categoryService.updateCategory(data).subscribe(
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
    const formData = this.categoryForm.value;
    const data = {
      name: formData.name,
    };
    this.categoryService.addCategory(data).subscribe(
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
