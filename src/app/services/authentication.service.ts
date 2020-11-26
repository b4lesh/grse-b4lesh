import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  currentUserSubject: BehaviorSubject<string | null>;
  currentUser$: Observable<string | null>;

  constructor() {
    const data: string | null = localStorage.getItem('currentUser');
    if (data) {
      this.currentUserSubject = new BehaviorSubject<string | null>(
        JSON.parse(data)
      );
    } else {
      this.currentUserSubject = new BehaviorSubject<string | null>(null);
    }

    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  getCurrentUser$(): Observable<string | null> {
    // this.currentUserSubject.getValue();
    return this.currentUser$;
  }

  getCurrentUser(): string | null {
    return this.currentUserSubject.getValue();
  }

  login(username: string): void {
    localStorage.setItem('currentUser', JSON.stringify(username));
    this.currentUserSubject.next(username);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
