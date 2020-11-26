import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  sub: Subscription | null = null;
  currentUser: string | null = null;

  constructor(private auth: AuthenticationService) {}

  ngOnInit(): void {
    this.sub = this.auth.getCurrentUser().subscribe((data) => {
      this.currentUser = data;
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
