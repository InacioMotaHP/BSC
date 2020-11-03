import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Categorias } from '../interfaces/categorias';
import { map } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class CatServiceService {
  private catCollection: AngularFirestoreCollection<Categorias>;


  constructor(
    private afs: AngularFirestore
  ) { 
    this.catCollection = this.afs.collection<Categorias>('Categorias');

  }

    //Categorias
    getCategorias() {
      return this.catCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
  
            return { id, ...data };
          });
        })
      );
    }
  
    getCategoria(id: string) {
      return this.catCollection.doc<Categorias>(id).valueChanges();
    }
  
}
