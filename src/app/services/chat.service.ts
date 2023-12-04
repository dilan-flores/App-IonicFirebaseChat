import { FieldValue, serverTimestamp } from '@firebase/firestore';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface User {
  uid: string;
  name?: string; // Permitir que el usuario tenga un nombre opcional
}

export interface Message {
  createdAt: FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  currentUser: User = { uid: 'Dilan' }; // Nombre fijo

  constructor(private afs: AngularFirestore) {}

  signIn(user:string){
    this.currentUser = { uid: user };
  }

  signOut(): Promise<void> {
    return Promise.resolve();
  }

  addChatMessage({ msg }: { msg: string }) {
    return this.afs.collection('messages').add({
      msg,
      from: this.currentUser.uid,
      createdAt: serverTimestamp(),
    });
  }

  getChatMessages() {
    let users: User[] = [];
    return this.getUsers().pipe(
      switchMap(res => {
        users = res as User[];
        return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<Message[]>;
      }),
      map(messages => {
        for (let m of messages) {
          m.fromName = this.getUserForMsg(m.from, users);
          m.myMsg = this.currentUser.uid === m.from;
        }
        return messages;
      })
    );
  }

  private getUsers() {
    return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
  }

  private getUserForMsg(msgFromId: string, users: User[]): string {
    const user = users.find(usr => usr.uid === msgFromId);
    return user?.name || 'Deleted';
  }
}
