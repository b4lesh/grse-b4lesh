import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject();

  currentUserEmail: string | null = null;

  constructor(private auth: AuthenticationService) {}

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
}
