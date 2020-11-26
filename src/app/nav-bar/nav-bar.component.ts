import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  isSignIn = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isSignIn = !!localStorage.getItem('currentUser');
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    setTimeout(() => this.router.navigate(['/']), 250);
  }
}
