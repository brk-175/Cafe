import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'category',
    'quantity',
    'price',
    'total',
    'edit',
  ];
  dataSource: any = [];
  responseMessage: any;
  orderForm: any = FormGroup;
  categories: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private snackBarService: SnackbarService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllProducts();
    this.orderForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)],
      ],
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      contactNumber: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.contactRegex)],
      ],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    });
  }

  getAllCategories() {
    this.categoryService.getFilteredCategories().subscribe(
      (response: any) => {
        this.categories = response;
      },
      (error: any) => {
        if (error.error?.message) this.responseMessage = error.error?.message;
        else this.responseMessage = GlobalConstants.genericError;
        return this.snackBarService.openSnackBar(this.responseMessage, 'error');
      }
    );
  }

  getAllProducts() {
    this.productService.getAllProducts().subscribe(
      (response: any) => {
        this.products = response;
      },
      (error: any) => {
        if (error.error?.message) this.responseMessage = error.error?.message;
        else this.responseMessage = GlobalConstants.genericError;
        return this.snackBarService.openSnackBar(this.responseMessage, 'error');
      }
    );
  }

  getProductByCategory(value: any) {
    this.productService.getProductByCategory(value.id).subscribe(
      (response: any) => {
        this.products = response;
        this.orderForm.controls.price.setValue('');
        this.orderForm.controls.quantity.setValue('');
        this.orderForm.controls.total.setValue('');
      },
      (error: any) => {
        if (error.error?.message) this.responseMessage = error.error?.message;
        else this.responseMessage = GlobalConstants.genericError;
        return this.snackBarService.openSnackBar(this.responseMessage, 'error');
      }
    );
  }

  getProductDetails(value: any) {
    this.productService.getProductById(value.id).subscribe(
      (response: any) => {
        this.orderForm.controls.price.setValue(response.price);
        this.orderForm.controls.quantity.setValue('1');
        this.orderForm.controls.total.setValue(response.price * 1);
      },
      (error: any) => {
        if (error.error?.message) this.responseMessage = error.error?.message;
        else this.responseMessage = GlobalConstants.genericError;
        return this.snackBarService.openSnackBar(this.responseMessage, 'error');
      }
    );
  }

  setQuantity(value: any) {
    let temp = this.orderForm.controls.quantity.value;
    if (temp > 0) {
      this.orderForm.controls.total.setValue(
        this.orderForm.controls.quantity.value *
          this.orderForm.controls.price.value
      );
    } else if (temp != '') {
      this.orderForm.controls.quantity.setValue('1');
      this.orderForm.controls.total.setValue(
        this.orderForm.controls.quantity.value *
          this.orderForm.controls.price.value
      );
    }
  }

  validateProductAdd() {
    if (
      this.orderForm.controls.total.value === 0 ||
      this.orderForm.controls.total.value === null
    ) {
      if (this.orderForm.controls.quantity.value <= 0) {
        return true;
      }
    }
    return false;
  }

  validateSubmit() {
    if (
      this.totalAmount === 0 ||
      this.orderForm.controls.name.value === null ||
      this.orderForm.controls.email.value === null ||
      this.orderForm.controls.contactNumber.value === null ||
      this.orderForm.controls.paymentMethod.value === null
    )
      return true;
    else return false;
  }

  add() {
    if (this.dataSource === undefined) {
      return;
    }
    const formData = this.orderForm.value;
    const productName = this.dataSource.find(
      (e: { id: number }) => e.id === formData.product.id
    );
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formData.total;
      const data = {
        id: formData.product.id,
        name: formData.product.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total,
      };
      this.dataSource.push({
        id: formData.product.id,
        name: formData.product.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total,
      });
      this.dataSource = [...this.dataSource];
      this.snackBarService.openSnackBar(
        'Product Added Successfully!',
        'success'
      );
    } else {
      this.snackBarService.openSnackBar('Product Already Exists!', 'error');
    }
  }

  handleDeleteAction(value: any, element: any) {
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }
}
