import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  loginForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private snackBarService: SnackbarService,
    private userService: UserService,
    private router: Router,
    private dialogRef: MatDialogRef<LoginComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)],
      ],
      password: [null, [Validators.required]],
    });
  }

  onLogin() {
    const formData = this.loginForm.value;
    const data = {
      email: formData.email,
      password: formData.password,
    };
    this.userService.onLogin(data).subscribe(
      (response: any) => {
        this.dialogRef.close();
        localStorage.setItem('token', response.token);
        this.responseMessage = response.message;
        this.snackBarService.openSnackBar(this.responseMessage, 'success');
        this.router.navigate(['/cafe/dashboard']);
      },
      (error: any) => {
        if (error.error?.message) this.responseMessage = error.error?.message;
        else this.responseMessage = GlobalConstants.genericError;
        this.snackBarService.openSnackBar(this.responseMessage, 'error');
      }
    );
  }
}
