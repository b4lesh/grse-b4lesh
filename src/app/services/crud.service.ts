import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';

interface Query {
  search: string;
  sort: { fieldPath: string; directionStr: 'asc' | 'desc' };
}

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  query: Query = {
    search: '',
    sort: { fieldPath: 'dateCreated', directionStr: 'asc' },
  };
  querySubject$ = new BehaviorSubject<Query>(this.query);

  constructor(private firestore: AngularFirestore) {}

  getAllTasks(currentUser: string): Observable<any> {
    return this.querySubject$.pipe(
      switchMap((allQueries) =>
        this.firestore
          .collection('task-list', (ref) => {
            let compositeQuery: firebase.firestore.Query = ref;
            compositeQuery = compositeQuery.where(
              'username',
              '==',
              currentUser
            );
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
    username: string;
  }): Promise<any> {
    return this.firestore.collection('task-list').add(task);
  }

  updateTask(id: string, task: any): Promise<any> {
    return this.firestore.collection('task-list').doc(id).update(task);
  }

  deleteTask(id: string): Promise<any> {
    return this.firestore.collection('task-list').doc(id).delete();
  }

  setSearchQuery(value: string): void {
    this.query.search = value;
    this.querySubject$.next(this.query);
  }

  setSortQuery(fieldPath: string, directionStr: 'asc' | 'desc'): void {
    this.query.sort = { fieldPath, directionStr };
    this.querySubject$.next(this.query);
  }
}
