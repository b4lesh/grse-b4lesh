import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  sub: Subscription | null = null;
  currentUser: string | null = null;

  constructor(private router: Router, private auth: AuthenticationService) {}

  ngOnInit(): void {
    this.sub = this.auth.getCurrentUser$().subscribe((data) => {
      this.currentUser = data;
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['']).catch((err) => console.log(err));
  }
}
