import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class CrudService {
  constructor(private firestore: AngularFirestore) {}

  getAllTasks(currentUser: string): Observable<any> {
    return this.firestore
      .collection('task-list', (ref) => {
        let query: firebase.firestore.Query = ref;
        query = query.where('username', '==', currentUser);
        query = query.orderBy('dateCreated', 'asc');
        return query;
        // return ref.where('username', '==', currentUser);
      })
      .snapshotChanges();
    // return this.firestore
    //   .collection('task-list')
    //   .doc('PQIT6faGUNxRa8jXsnoq')
    //   .collection('george', (ref) => ref)
    //   .snapshotChanges();
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
}
