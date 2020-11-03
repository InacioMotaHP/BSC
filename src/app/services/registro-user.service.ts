import { User } from './../interfaces/user';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistroUserService {
  private registerUsuarios: AngularFirestoreCollection<User>;

  constructor(private afs: AngularFirestore) {
    this.registerUsuarios = this.afs.collection<User>('usuarios');
  }

  getRegistroUsusarios() {
    return this.registerUsuarios.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  addRegistroUsuarios(registro: User) {
    return this.registerUsuarios.add(registro);
  }

  getRegistrosUsuario(id: string) {
    return this.registerUsuarios.doc<User>(id).valueChanges();
  }

  updateRegistroUsuario(id: string, registro: User) {
    return this.registerUsuarios.doc<User>(id).update(registro);
  }

  deleteRegistroUsuarios(id: string) {
    return this.registerUsuarios.doc(id).delete();
  }
}