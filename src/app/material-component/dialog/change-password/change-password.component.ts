import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  hideOldPassword: boolean = true;
  hideNewPassword: boolean = true;
  hideConfirmPassword: boolean = true;
  changePassForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private snackBarService: SnackbarService,
    private router: Router,
    private userService: UserService,
    private dialogRef: MatDialogRef<ChangePasswordComponent>
  ) {}

  ngOnInit(): void {
    this.changePassForm = this.formBuilder.group({
      oldPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  handleChangePassword() {
    const formData = this.changePassForm.value;
    const data = {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmPassword,
    };
    this.userService.changePassword(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        if (response.error) {
          this.responseMessage = response.error;
          this.snackBarService.openSnackBar(this.responseMessage, 'error');
        } else {
          this.responseMessage = response.message;
          this.snackBarService.openSnackBar(this.responseMessage, 'success');
        }
      },
      (error: any) => {
        if (error.error?.message) this.responseMessage = error.error?.message;
        this.responseMessage = GlobalConstants.genericError;
        this.snackBarService.openSnackBar(this.responseMessage, 'error');
      }
    );
  }

  validatePassword() {
    if (
      this.changePassForm.controls['newPassword'].value !=
      this.changePassForm.controls['confirmPassword'].value
    )
      return true;
    return false;
  }
}
