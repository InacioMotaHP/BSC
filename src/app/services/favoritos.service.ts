import { Injectable, ɵEMPTY_ARRAY } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from '../interfaces/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private productsCollection: AngularFirestoreCollection<Product>;
  public ref = this.afs.firestore.collection('favoritos');


  constructor(private afs: AngularFirestore) {
    this.productsCollection = this.afs.collection<Product>('favoritos');
  }

  getProducts() {
    return this.productsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return { id, ...data };
        });
      })
    );
  }

  addProduct(product: Product) {
    return this.productsCollection.add(product);
  }

  getProduct(id: string) {
    return this.productsCollection.doc<Product>(id).valueChanges();
  }

  updateProduct(id: string, product: Product) {
    return this.productsCollection.doc<Product>(id).update(product);
  }

  deleteProduct(id: string) {
    return this.productsCollection.doc(id).delete();
  }

  ///teste
  productFav: Product = {};

  //seta valores atualizando ou criando
  setProduct(idProduct: string, name: string, description: string, picture: string, price: string, userId: string, fornecedor: string, fav: boolean) {
    return this.productsCollection.doc(idProduct).set({
      name,
      description,
      picture,
      price,
      userId, //pega id do usuario 
      fornecedor,
      fav
    });
  }



  testaListadeProdutos(userID: string, productID: string) {

    return this.ref.where('productId', '==', productID).where('userId', '==', userID).orderBy('name','asc').limit(1);
  }

}