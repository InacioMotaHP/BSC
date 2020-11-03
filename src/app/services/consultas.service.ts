import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/public_api';
import { Product } from '../interfaces/product';
import { Empresas } from '../interfaces/empresas';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {

  private productsCollection: AngularFirestoreCollection<Product>;
  public refProduto = this.afs.firestore.collection('Products');
  public refEmpresa = this.afs.firestore.collection('Empresas');

  private empresa: Empresas

  private products: Product;

  constructor(private afs: AngularFirestore) {

  }

  async consultaFornecedor(fornecedor: string, userId: string) {
    let query = await this.refProduto.where('fornecedor', '==', fornecedor).where('userId', '==', userId).limit(5).get().
      then(snapshot => {
        if (snapshot.empty) {
          console.log('Nenhum documento encontrado com essa pesquisa');
          return;
        }
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          this.products = doc.data();
          return this.products;
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  async consultarCategoriaEmpresas(cat: string){
    let query = await this.refEmpresa.where('cat', '==', cat).limit(1).get().
      then(snapshot => {
        if (snapshot.empty) {
          console.log('Nenhum documento encontrado com essa pesquisa');
          return;
        }
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          this.empresa = doc.data();
          return this.empresa;
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }
}
