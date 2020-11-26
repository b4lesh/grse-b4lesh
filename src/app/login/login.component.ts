import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loginErrorStatus = false;
  currentUser: string | null = null;
  sub: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthenticationService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.sub = this.auth.getCurrentUser$().subscribe((data) => {
      this.currentUser = data;
    });
    if (this.currentUser) {
      this.router.navigate(['']).catch((err) => console.log(err));
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
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
          this.auth.login(user.username);
          this.router.navigate(['/']).catch((err) => console.log(err));
        }
      }
    }
    this.loginErrorStatus = !isLogin;
  }
}
