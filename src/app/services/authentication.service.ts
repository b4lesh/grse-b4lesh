import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private fireAuth: AngularFireAuth) {}

  getCurrentUser(): Observable<any> {
    return this.fireAuth.user;
  }

  signUp(
    email: string,
    password: string
  ): ReturnType<firebase.auth.Auth['createUserWithEmailAndPassword']> {
    return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  signIn(
    email: string,
    password: string
  ): ReturnType<firebase.auth.Auth['signInWithEmailAndPassword']> {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  signOut(): ReturnType<firebase.auth.Auth['signOut']> {
    return this.fireAuth.signOut();
  }
}
