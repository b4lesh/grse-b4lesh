import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Error } from '../interfaces/error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  errorList: Array<Error> = [
    {
      code: 'auth/user-not-found',
      status: false,
      msg: 'Пользователь с таким Email не найден',
    },
    { code: 'auth/wrong-password', status: false, msg: 'Неверный пароль' },
    {
      code: 'auth/too-many-requests',
      status: false,
      msg: 'Слишком много попыток, повторите позже',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
    });
  }

  login(): void {
    for (const err of this.errorList) {
      err.status = false;
    }

    const { email, password } = this.loginForm.value;

    this.auth
      .signIn(email, password)
      .then(() => this.router.navigate(['/']).catch((err) => console.log(err)))
      .catch((errorData) => {
        // TODO: Как лучше реализовать?
        let newError = true;
        for (const [i, error] of this.errorList.entries()) {
          if (errorData.code === error.code) {
            this.errorList[i].status = true;
            newError = false;
            break;
          }
        }
        if (newError) {
          this.errorList.push({
            code: errorData.code,
            status: true,
            msg: errorData.code,
          });
        }
      });
  }
}
