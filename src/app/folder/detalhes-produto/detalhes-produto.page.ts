import { Network } from '@ionic-native/network/ngx';
import { CarrinhoService } from './../../services/carrinho.service';
import { User } from './../../interfaces/user';
import { AuthService } from './../../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from 'src/app/interfaces/product';
import { FavoritosService } from './../../services/favoritos.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { ProductService } from './../../services/product.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalhes-produto',
  templateUrl: './detalhes-produto.page.html',
  styleUrls: ['./detalhes-produto.page.scss'],
})
export class DetalhesProdutoPage implements OnInit {

  like: string = "heart-outline";

  productSubscription: Subscription;
  productSubscription2: Subscription;

  productId: string = null;
  favProdId: string = null;
  pfId: string = null;
  pcId: string = null;
  public product: Product = {};

  public productsFav: Product;
  public refFavorito = this.afs.firestore.collection('favoritos');
  public refCarrinho = this.afs.firestore.collection('carrinho');

  productFav = new Array<Product>();
  productCar = new Array<Product>();

  userId: User = {};
  loading: any;

  total: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private toastCtrl: ToastController,
    private favService: FavoritosService,
    private carservice: CarrinhoService,

    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    public network: Network
  ) { }

  ionViewWillEnter() {
    if (this.network.type != "none") {
      this.presentLoading()
      this.productId = this.activatedRoute.snapshot.params['id']; //recupera id passado por url
      this.loadProduct();// inicia dados do product clicado
    }

  }

  ionViewDidLeave() {
    if (this.productSubscription) {
      this.productSubscription.unsubscribe()
    }
    if (this.productSubscription2) {
      this.productSubscription2.unsubscribe()
    }
  }
  async loadProduct() {
    this.productSubscription = this.productService.getProduct(this.productId).subscribe(data => { //retorna todos os produtos
      this.product = data;
      this.product.quant = 1
      this.total = (this.product.quant * this.product.price).toFixed(2)
      if (this.product.unidade == "" || this.product.unidade == undefined) {
        this.product.unidade = "unidade"
        return this.product;
      }
    });

    this.userId.userId = (await this.authService.getAuth().currentUser).uid; //retorna id do usuario logado
    this.consultaIdFav(this.userId.userId, this.productId) // consulta se existe algum produto com este idUser e idProd nos favoritos
    this.consultaIdCar(this.userId.userId, this.productId) // consulta se existe algum produto com este idUser e idProd nos carrinho

  }

  quantidade(quant: number) {
    if (this.product.quant == 1 && quant == -1) {

    } else {
      this.product.quant = this.product.quant + (quant)
      this.total = (this.product.quant * this.product.price).toFixed(2)
    }
  }


  async loadFavProd(id: string) {
    this.productSubscription2 = this.favService.getProduct(id).subscribe(data2 => { //retona todos os favoritos 
      this.productsFav = data2;
    })
  }

  //consultando se existe idFav em favoritos, com o mesmo id deste produto, e tbm se tem userId em favoritos com mesmo id do user logado!!

  async consultaIdFav(idUser: string, idProduct: string) {

    await this.refFavorito.where('userId', '==', idUser).where('idProduct', '==', idProduct).limit(2).get().
      then(snapshot => {
        if (snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          this.productFav.push(doc.data());
          this.pfId = doc.id
          this.like = 'heart'
          return this.productFav;

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  async consultaIdCar(idUser: string, idProduct: string) {

    await this.refCarrinho.where('userId', '==', idUser).where('idProduct', '==', idProduct).limit(2).get().
      then(snapshot => {
        if (snapshot.empty) {
          return;
        }
        snapshot.forEach(doc => {
          this.productCar.push(doc.data());
          this.pcId = doc.id
          return this.productFav;

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  async saveFav() {
    await this.presentLoading(); //chama loading na tela
    this.userId.userId = (await this.authService.getAuth().currentUser).uid; //retorna id do usuario logado
    console.log(this.userId.userId, this.productId)
    this.consultaIdFav(this.userId.userId, this.productId) // consulta se existe algum produto com este idUser e idProd nos favoritos

    if (this.pfId) {
      this.like = 'heart-outline'
      this.deleteProduct(this.pfId)
      this.presentToast('produto removido aos favoritos')
      this.pfId = null;
    } else {
      this.like = 'heart'
      this.product.userId = this.userId.userId;
      this.product.idProduct = this.productId;

      this.favService.addProduct(this.product)
      this.presentToast('produto adicionado aos favoritos')
    }
    this.loading.dismiss(); // tira loading da tela

  }

  async AddCar() {

    await this.presentLoading(); //chama loading na tela
    if (this.product.disponivel == true) {
      this.userId.userId = (await this.authService.getAuth().currentUser).uid; //retorna id do usuario logado
      this.consultaIdCar(this.userId.userId, this.productId) // consulta se existe algum produto com este idUser e idProd nos favoritos

      if (this.pcId) {
        this.presentToast('produto já está no carrinho');
      } else {

        this.product.userId = this.userId.userId;
        this.product.idProduct = this.productId;

        this.carservice.addProduct(this.product)
        this.presentToast('produto adicionado ao carrinho')
      }
    } else {
      this.presentToast('Este produto está indisponível')
    }

    this.loading.dismiss(); // tira loading da tela
  }



  visitarEmpresa() {
    this.router.navigate(['../../folder/empresa', this.product.idEmpresa]);
  }
  async deleteProduct(id: string) {
    try {
      await this.favService.deleteProduct(id);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar favorito');
    }
  }
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Aguarde...',
      duration: 500,
    });
    return this.loading.present();
  }
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      mode: 'ios',
      message,
      duration: 2000
    });
    toast.present();
  }
  ngOnInit() {
  }
  clicksCar() {
    this.router.navigate(['../../folder/carrinho']);
  }

}
