import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  password: boolean = true;
  confirmPassword: boolean = true;
  signupForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>
  ) {}

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
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
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  validatePassword() {
    if (
      this.signupForm.controls['password'].value !=
      this.signupForm.controls['confirmPassword'].value
    )
      return true;
    else return false;
  }

  handleSubmit() {
    const formData = this.signupForm.value;
    const data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      password: formData.password,
    };
    if (formData.name.length == 0)
      this.snackBarService.openSnackBar('Please Enter Name!', 'warn');
    else {
      this.userService.onSignup(data).subscribe(
        (response: any) => {
          this.dialogRef.close();
          this.responseMessage = response.message;
          this.snackBarService.openSnackBar(this.responseMessage, 'success');
          this.router.navigate(['/']);
        },
        (error: any) => {
          if (error.error?.message) this.responseMessage = error.error?.message;
          else this.responseMessage = GlobalConstants.genericError;
          this.snackBarService.openSnackBar(this.responseMessage, 'error');
        }
      );
    }
  }
}
