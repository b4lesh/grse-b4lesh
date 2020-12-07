import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { AuthenticationService } from '../services/authentication.service';
import { Error } from '../interfaces/error';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  emailAlreadyInUse = false;
  errorList: Array<Error> = [
    {
      code: 'auth/email-already-in-use',
      status: false,
      msg: 'Такой пользователь уже существует',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private crud: CrudService,
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.registrationForm = this.formBuilder.group(
      {
        email: ['', Validators.email],
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordRepeat: ['', [Validators.required]],
      },
      {
        validators: (group: FormGroup) =>
          group.value.password === group.value.passwordRepeat
            ? null
            : { repeat: true },
      }
    );
  }

  registration(): void {
    const { email, password } = this.registrationForm.value;
    this.auth
      .signUp(email, password)
      .then(() => {
        this.auth
          .signIn(email, password)
          .then((dataUser) => {
            this.crud
              .addUser(dataUser.user?.uid)
              .then(() => {
                this.auth.signOut().then(() => {
                  this.router
                    .navigate(['/login'])
                    .catch((err) => console.error(err));
                });
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      })
      .catch((errorData) => {
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
