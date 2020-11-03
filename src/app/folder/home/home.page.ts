import { AuthService } from './../../services/auth.service';
import { RegistroUserService } from './../../services/registro-user.service';
import { Network } from '@ionic-native/network/ngx';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/interfaces/product';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';
import { Platform } from '@ionic/angular';


//import { AngularFireAuth } from '@angular/fire/auth/auth'; ERRO

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private loading: any;
  public products = new Array<Product>();
  private productsSubscription: Subscription;
  dadosSearch: any[];
  cond: boolean = false;
  private BackSubs: Subscription;
  isClientSub: Subscription;

  constructor(
    private platform: Platform,
    private router: Router,
    private loadingCtrl: LoadingController,
    private ps: ProductService,
    private alertController: AlertController,
    private toastCtrl: ToastController,
    public network: Network,
    private userService: RegistroUserService,
    private authService: AuthService) {}

  ionViewWillEnter() {
    this.isClient()

    this.BackSubs = this.platform.backButton.subscribe(() => {
      this.confirmExit()
    });

    this.productsSubscription = this.ps.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  ionViewDidLeave() {
    this.productsSubscription.unsubscribe();
    this.BackSubs.unsubscribe();
  }

  async isClient() {
    this.isClientSub = this.userService.getRegistrosUsuario((await this.authService.getAuth().currentUser).uid).subscribe(data => {
      console.log(data)
      if (data) {
        console.log("é cliente")
      } else {
        this.authService.logout()
        this.alert()
        this.router.navigate(['./login'])
      }
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      mode: 'ios',
      duration: 2000
    });
    toast.present();
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Aguarde...',
      mode: 'ios',
    });
    return this.loading.present();
  }

  async alert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Desculpe, você não está cadastrado como cliente. Realize o cadastro para logar!',
      buttons: [
        {
          text: 'Confirmar'
        }
      ]
    });

    await alert.present();
  }

  //slides auto play
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  };

  atalho(a) {
    this.router.navigate(['../../folder/', a]);
  }

  async confirmExit() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Deseja realmente sair?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            navigator["app"].exitApp()
          }
        }
      ]
    });

    await alert.present();
  }

  // TESTE SEARCH BAR//
  loadGoLista: any = []

  async filterList(event) {
    this.initializeItems();
    const searchTerm = event.srcElement.value;

    if (!searchTerm) {
      this.cond = false
      return
    } else {
      this.cond = true
    }
    this.products = this.products.filter(currentGoal => {
      if (currentGoal.name && searchTerm) {
        if (currentGoal.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          this.cond = true
          return this.cond, true;

        }
        return false;
      }
    })
  }

  initializeItems(): void {
    this.loadProducts();
    this.products = this.loadGoLista;
  }

  async loadProducts() {
    this.productsSubscription = this.ps.getProducts().subscribe(data => {
      this.loadGoLista = data;
    });
  }

}
