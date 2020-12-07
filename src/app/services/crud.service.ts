import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';

interface Query {
  search: string;
  sort: { fieldPath: string; directionStr: 'asc' | 'desc' };
  dateStart: string;
  dateEnd: string;
  uid: string;
}

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  query: Query = {
    search: '',
    sort: { fieldPath: 'dateCreated', directionStr: 'asc' },
    dateStart: '',
    dateEnd: '',
    uid: '',
  };
  querySubject$ = new BehaviorSubject<Query>(this.query);

  constructor(private firestore: AngularFirestore) {}

  addUser(uid: string | undefined): Promise<any> {
    return this.firestore.collection('users').doc(uid).set({});
  }

  getAllTasks(): Observable<any> {
    return this.querySubject$.pipe(
      switchMap((allQueries) =>
        this.firestore
          .collection('task-list', (ref) => {
            let compositeQuery: firebase.firestore.Query = ref;
            compositeQuery = compositeQuery.where('uid', '==', this.query.uid);
            if (allQueries.search) {
              compositeQuery = compositeQuery.where(
                'text',
                '==',
                allQueries.search
              );
            }
            if (!(allQueries.sort.fieldPath === 'text' && allQueries.search)) {
              compositeQuery = compositeQuery.orderBy(
                allQueries.sort.fieldPath,
                allQueries.sort.directionStr
              );
            }
            if (allQueries.dateStart) {
              compositeQuery = compositeQuery.where(
                'dateCreated',
                '>=',
                new Date(allQueries.dateStart)
              );
            }
            if (allQueries.dateEnd) {
              compositeQuery = compositeQuery.where(
                'dateCreated',
                '<=',
                new Date(allQueries.dateEnd)
              );
            }
            return compositeQuery;
          })
          .snapshotChanges()
      )
    );
  }

  addTask(task: {
    text: string;
    isDone: boolean;
    dateCreated: Date;
    uid: string;
  }): Promise<any> {
    return this.firestore.collection('task-list').add(task);
  }

  updateTask(id: string, task: any): Promise<any> {
    return this.firestore.collection('task-list').doc(id).update(task);
  }

  deleteTask(id: string): Promise<any> {
    return this.firestore.collection('task-list').doc(id).delete();
  }

  setUid(uid: string | undefined): void {
    this.query.uid = uid ? uid : '';
    this.querySubject$.next(this.query);
  }

  setSearchQuery(value: string): void {
    this.query.search = value;
    this.querySubject$.next(this.query);
  }

  setSortQuery(fieldPath: string, directionStr: 'asc' | 'desc'): void {
    this.query.sort = { fieldPath, directionStr };
    this.querySubject$.next(this.query);
  }

  setDate(dateStart: string, dateEnd: string): void {
    this.query.dateStart = dateStart;
    this.query.dateEnd = dateEnd;
    this.querySubject$.next(this.query);
  }
}
