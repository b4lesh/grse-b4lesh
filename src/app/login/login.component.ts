import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginErrorStatus = false;
  currentUser = localStorage.getItem('currentUser');

  constructor(private fb: FormBuilder, private router: Router) {
    if (this.currentUser) {
      setTimeout(() => this.router.navigate(['/todo-list']), 200);
    }
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    const users: Array<User> | null = JSON.parse(
      localStorage.getItem('user') as string
    );

    const username = this.loginForm.value.username.toLowerCase();
    const password = this.loginForm.value.password;

    let isLogin = false;
    if (users) {
      for (const user of users) {
        if (
          user.username.toLowerCase() === username &&
          user.password === password
        ) {
          isLogin = true;
          localStorage.setItem('currentUser', user.username);
          setTimeout(() => this.router.navigate(['/']), 250);
        }
      }
    }
    this.loginErrorStatus = !isLogin;
  }
}
