import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './../interfaces/user';
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afa: AngularFireAuth, private afs: AngularFirestore) {
  }


  login(user: User) {
    return this.afa.signInWithEmailAndPassword(user.email, user.password);
  }
  async register(user: User) {
    const userRegister = this.afa.createUserWithEmailAndPassword(user.email, user.password);
    const newuser = Object.assign({}, user);

    //delete newuser.email;
    delete newuser.password;
    delete newuser.passConfirm;

    await this.afs.collection('usuarios').doc((await userRegister).user.uid).set(newuser)
  }

  getAuth() {
    return this.afa;
  }

  logout(){
    return this.afa.signOut();
  }
  resetPassword(email: string){
    return this.afa.sendPasswordResetEmail(email);
  }
}