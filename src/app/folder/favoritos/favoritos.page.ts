import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { ToastController, AlertController, LoadingController, Platform, NavController } from '@ionic/angular';
import { FavoritosService } from './../../services/favoritos.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/interfaces/product';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  public products = new Array<Product>();
  private toastCtrl: ToastController;
  private userId: Product = {}
  public msg: string = '';
  public refFavorito = this.afs.firestore.collection('favoritos');
  loading: any;
  private BackSubs: Subscription;

  constructor(
    private nav: NavController,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private favService: FavoritosService,
    private authService: AuthService,
    private afs: AngularFirestore,
    private router: Router,
    public network: Network) { }

  ionViewWillEnter() {
    this.BackSubs = this.platform.backButton.subscribe(() => {
      if (this.router.url == "/folder/favoritos") {
        this.nav.navigateRoot("/folder/home")
      }
    });
    if (this.network.type != 'none') {
      this.presentLoading()
      this.loadUser();
    }
  }

  ionViewDidLeave() {
    this.BackSubs.unsubscribe();
  }

  async loadUser() {
    this.userId.userId = (await this.authService.getAuth().currentUser).uid; //retorna id do usuario logado 
    this.loadProduct(this.userId.userId);
  }

  async loadProduct(idzin: string) {
    this.products = [];

    await this.refFavorito.where('userId', '==', idzin).get().
      then(snapshot => {

        if (snapshot.empty) {
          this.msg = 'Nenhum produtos encontrado, adicione alguns clicando no ícone de coração ao lado do preço de cada produto!'
          return;
        }
        snapshot.forEach(doc => {
          this.products.push(Object.assign({}, { id: doc.id }, doc.data()));  //  adiciona a string doc.id a vara id e faz push do objeto com doc.data(), tudo em um único objeto
          this.msg = '';
          return this.products;

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

  }

  ngOnInit() {
  }

  async deleteProduct(id: string) {
    try {
      await this.favService.deleteProduct(id);
      this.loadProduct(this.userId.userId)
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      mode: 'ios',
      message,
      duration: 2000
    });
    toast.present();
  }

  async confirmExclusao(id2: string) {
    console.log(id2)
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: "Confirmação de exclusão",
      message: "Tem certeza que deseja excluir este produto?",
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Cancel');
        }
      }, {
        text: 'Confirmar',
        handler: () => {
          this.deleteProduct(id2);
        }
      }]
    });

    await alert.present();
  }
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Aguarde...',
      duration: 500,
    });
    return this.loading.present();
  }

}
