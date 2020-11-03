import { Network } from '@ionic-native/network/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Categorias } from './../../interfaces/categorias';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatServiceService } from 'src/app/services/cat-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-catsecundarias',
  templateUrl: './catsecundarias.page.html',
  styleUrls: ['./catsecundarias.page.scss'],
})
export class CatsecundariasPage implements OnInit {
  cat: string
  Cat2 = []
  private refCat = this.afs.firestore.collection('Subcategorias');
  msg = ''

  constructor(
    private catSevice: CatServiceService,
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore,
    private router: Router,
    public network: Network
  ) { }


  ngOnInit() {
  }
  ionViewWillEnter() {
    if (this.network.type != "none") {
      this.cat = this.activatedRoute.snapshot.params['id']
      this.consultarSubcategorias(this.cat)
    }
  }
  ionViewDidLeave() {

  }
  directProd(categoria) {
    this.router.navigate(['../folder/catalogo/' + categoria])
  }
  async consultarSubcategorias(id) {
    this.Cat2 = []
    await this.refCat.where('pai', '==', id).get().
      then(snapshot => {
        if (snapshot.empty) {
          //this.loadProducts();
          this.msg = 'nenhuma subcategoria aqui!'
          return;
        }

        snapshot.forEach(doc => {
          this.msg = ''
          this.Cat2.push(doc.id)
          return this.Cat2;

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

}
