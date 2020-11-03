import { Empresas } from './../interfaces/empresas';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private EmpresasCollection: AngularFirestoreCollection<Empresas>;

  constructor(private afs: AngularFirestore) {
    this.EmpresasCollection = this.afs.collection<Empresas>('Empresas');
  }

  getEmpresas() {
    return this.EmpresasCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  addEmpresa(empresa: Empresas) {
    return this.EmpresasCollection.add(empresa);
  }

  getEmpresa(id: string) {
    return this.EmpresasCollection.doc<Empresas>(id).valueChanges();
  }

  updateEmpresa(id: string, empresa: Empresas) {
    return this.EmpresasCollection.doc<Empresas>(id).update(empresa);
  }
  
  deleteEmpresa(id: string) {
    return this.EmpresasCollection.doc(id).delete();
  }
}