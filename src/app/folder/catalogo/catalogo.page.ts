import { CatServiceService } from './../../services/cat-service.service';
import { Categorias } from './../../interfaces/categorias';
import { AlertController, LoadingController } from '@ionic/angular';
import { Product } from './../../interfaces/product';
import { ProductService } from './../../services/product.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router, ActivatedRoute } from '@angular/router';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
})
export class CatalogoPage implements OnInit {
  productSubs: Subscription;
  products = new Array<Product>();
  loadGoLista: any = []
  categoria: string = "";
  categoriasPrimarias = new Array<Categorias>();
  categoriasSecundarias = {}
  public refProdutos = this.afs.firestore.collection('Products');
  catSubs: Subscription
  Cat: string;
  subCatSubs: Subscription
  SubCat: Product;
  cat: string
  loading: any;
  public msg: string = '';

  constructor(
    private loadingCtrl: LoadingController,
    private ps: ProductService,
    private catSevice: CatServiceService,
    private afs: AngularFirestore,
    private router: Router,
    private alertCtrl: AlertController,
    private activatedRoute: ActivatedRoute,
    public network: Network
  ) { }

  ionViewWillEnter() {
    if (this.network.type != 'none') {
      this.presentLoading()
      this.cat = this.activatedRoute.snapshot.params['id']
      this.consultarCategoriaProdutos(this.cat, '==') //mostra todos os produtos  
    }
  }
  ionViewDidLeave() {
    if (this.productSubs) {
      this.productSubs.unsubscribe()
    }
  }

  async loadProducts() {
    this.productSubs = this.ps.getProducts().subscribe(data => {
      this.loadGoLista = data;
    });
  }

  filterList(event) {
    this.initializeItems();
    const searchTerm = event.srcElement.value;
    if (!searchTerm) {
      return
    }
    this.products = this.products.filter(currentGoal => {
      if (currentGoal.name && searchTerm) {
        if (currentGoal.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    })
  }

  initializeItems(): void {
    this.loadProducts();
    this.products = this.loadGoLista;
  }


  ngOnInit() {
  }
  //CONSULTAS POR CATEGORIA
  async consultarCategoriaProdutos(cat: string, compar) {
    this.products = []
    await this.refProdutos.where('categoria', compar, cat).get().
      then(snapshot => {
        if (snapshot.empty) {
          this.msg = 'Nenhum produtos encontrado!'
          return;
        }

        snapshot.forEach(doc => {
          this.products.push(Object.assign({}, { id: doc.id }, doc.data()));
          this.msg = ''

          return this.products;

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  FiltroCat(cat: string) {
    this.products = [];
    this.consultarCategoriaProdutos(cat, '==')
  }

  async presentAlert(t, m) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: t,
      message: m,
      buttons: ['OK']
    });

    await alert.present();
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
    }, 500);
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'carregando...',
      mode: 'ios',
      duration: 1000
    });
    return this.loading.present();

  }


  loadCat() {
    this.catSubs = this.catSevice.getCategorias().subscribe(data => {
      this.categoriasPrimarias = data
      console.log(this.categoriasPrimarias)
    });
  }
  escolherCatP(id) {
    this.Cat = id
    console.log(this.Cat)

    this.subCatSubs = this.catSevice.getCategoria(id).subscribe(data => {
      this.categoriasSecundarias = data.cat
      console.log(this.categoriasSecundarias)
    })
  }
  escolherSubCat(id) {
  }

}
