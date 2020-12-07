import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();

  currentUserEmail: string | null = null;

  constructor(private router: Router, private auth: AuthenticationService) {}

  ngOnInit(): void {
    this.auth
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((userDate) => (this.currentUserEmail = userDate?.email));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout(): void {
    this.auth
      .signOut()
      .then(() => this.router.navigate(['']).catch((err) => console.error(err)))
      .catch((err) => console.error(err));
  }
}
