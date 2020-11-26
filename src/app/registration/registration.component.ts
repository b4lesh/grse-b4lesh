import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  registrationForm: FormGroup;
  registrationErrorStatusLogin = false;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.registrationForm = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        password1: ['', [Validators.required, Validators.minLength(6)]],
        password2: ['', [Validators.required]],
      },
      {
        validators: (group: FormGroup) =>
          group.value.password1 === group.value.password2
            ? null
            : { repeat: true },
      }
    );
  }

  registration(): void {
    let usersArray: Array<User> | null = JSON.parse(
      localStorage.getItem('user') as string
    );
    if (!usersArray) {
      usersArray = [];
    }
    const newUsername = this.registrationForm.value.username;
    const newPassword1 = this.registrationForm.value.password1;
    const newId = usersArray.length
      ? usersArray[usersArray.length - 1].id + 1
      : 1;

    for (const user of usersArray) {
      if (user.username.toLowerCase() === newUsername.toLowerCase()) {
        this.registrationErrorStatusLogin = true;
        return;
      }
    }

    usersArray.push({
      id: newId,
      username: newUsername,
      password: newPassword1,
    });

    localStorage.setItem('user', JSON.stringify(usersArray));
    this.router.navigate(['/login']);
  }
}
