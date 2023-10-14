import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { API } from 'src/app/models/api';
import { Users } from 'src/app/models/users';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit {

  signInForm = this.formBuilder.group({
    mobileNumber: ['', Validators.required],
    password: ['', Validators.required]
});;
  loading = false;
  submitted = false;
  error: string;
  isProcessing = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private spinner: SpinnerVisibilityService,
    private snackBar: MatSnackBar,
    private router: Router) {
      // redirect to home if already logged in

      const user = localStorage.getItem("user");
      if (user && JSON.parse(user??"") !== null && JSON.parse(user??"") !== undefined) {
          this.router.navigate(['/']);
      }
    }

  ngOnInit() {
    this.signInForm.controls.password.errors
  }

  onSubmit() {
    if (this.signInForm.invalid) {
        return;
    }
    try{
      const params = this.signInForm.value;
      this.spinner.show();
      this.http.post<API>(environment.api.url + environment.api.users.login, params)
        .subscribe(async res => {
          if (res.success) {
            localStorage.setItem("user", JSON.stringify(res.data));
            this.spinner.hide();
            this.router.navigate(['/']);
          } else {
            this.spinner.hide();
            this.error = Array.isArray(res.message) ? res.message[0] : res.message;
            this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          }
        }, async (res) => {
          this.spinner.hide();
          this.error = res.error.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        });
    } catch (e){
      this.spinner.hide();
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
    }
  }
}
