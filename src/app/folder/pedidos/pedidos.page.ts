import { AlertController, IonSlides, LoadingController, Platform, NavController, IonRouterOutlet } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { PedidoService } from './../../services/pedido.service';
import { Pedido } from './../../interfaces/pedido';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {


  private refPedidos = this.afs.firestore.collection('Pedido')
  public pedidos = new Array<Pedido>();
  public pedidosA = new Array<Pedido>();
  pedidosC = new Array<Pedido>();
  public msgVazio1: string
  public msgVazio2: string
  public msgVazio3: string
  public pedidoSubs: Subscription
  public pedido: Pedido;
  loading: any;
  selectedSlide: IonSlides;
  segment = 0;
  private BackSubs: Subscription;

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private afs: AngularFirestore,
    private authService: AuthService,
    private pedidoservice: PedidoService,
    private alertController: AlertController,
    private platform: Platform,
    private nav: NavController,
    private routerOutlet: IonRouterOutlet,
    public network: Network

  ) {
    //this.loadUser()
  }

  ionViewWillEnter() {
    if (this.network.type != 'none') {
      this.presentLoading()
      this.pedidos = []
      this.pedidosA = []
      this.pedidosC = []
      this.loadPedidos()
      this.loadPedidosAndamento()
      this.loadPedidosCancelados()
    }
    this.BackSubs = this.platform.backButton.subscribe(() => {
      if (this.router.url == "/folder/pedidos" && !this.routerOutlet.canGoBack()) {
        this.nav.navigateRoot("/folder/home")
      }
    });
  }

  ionViewDidLeave() {
    this.BackSubs.unsubscribe();

    if (this.pedidoSubs) {
      this.pedidoSubs.unsubscribe()
    }
  }

  ngOnInit() {
  }
  async loadPedidosAndamento() {
    this.pedidosA = []
    let idcliente = (await this.authService.getAuth().currentUser).uid

    await this.refPedidos.where('clienteId', '==', idcliente).where('status', '==', 'Em andamento').orderBy('dataEhorario').get().
      then(snapshot => {
        if (snapshot.empty) {
          this.msgVazio2 = 'Nenhum Pedido em andamento!'
          return;
        }
        snapshot.forEach(doc => {
          this.msgVazio2 = ''
          this.pedidosA.push(Object.assign({}, { cod: doc.id }, doc.data()));
          return this.pedidosA;

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }
  async loadPedidosCancelados() {
    this.pedidosC = []
    let idcliente = (await this.authService.getAuth().currentUser).uid

    await this.refPedidos.where('clienteId', '==', idcliente).where('status', '==', 'Cancelado').orderBy('dataEhorario').get().
      then(snapshot => {
        if (snapshot.empty) {
          this.msgVazio3 = 'Nenhum pedido na lista de cancelados'
          return;
        }
        snapshot.forEach(doc => {
          this.msgVazio3 = ''
          this.pedidosC.push(Object.assign({}, { cod: doc.id }, doc.data()));
          return this.pedidosC;

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  async loadPedidos() {
    this.pedidos = []
    let idcliente = (await this.authService.getAuth().currentUser).uid

    await this.refPedidos.where('clienteId', '==', idcliente).where('status', '==', 'Realizado').orderBy('dataEhorario').get().
      then(snapshot => {
        if (snapshot.empty) {
          this.msgVazio1 = 'Nenhum pedido realizado!'
          return;
        }
        snapshot.forEach(doc => {
          this.msgVazio1 = ''
          this.pedidos.push(Object.assign({}, { cod: doc.id }, doc.data()));
          return this.pedidos;

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  async loadPedido(cod: string) {
    this.pedidoSubs = this.pedidoservice.getpedidot(cod).subscribe(data => { //retorna todos os produtos
      this.pedido = data;
    });
  }

  Visualizar(idPedido: string) {
    this.router.navigate(['../../folder/pedido-detalhes/' + idPedido]);
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Aguarde...',
      duration: 500,
    });
    return this.loading.present();
  }

  //slide 
  slideOpts = {
    mode: 'ios',
    initialSlide: 0,
    slidePerView: 1,
    speed: 400,

  };
  async segmentChanged(ev) {
    await this.selectedSlide.slideTo(this.segment)

  }
  async slideShanged(slide: IonSlides) {
    this.selectedSlide = slide;
    slide.getActiveIndex().then(selectedIndex => {
      this.segment = selectedIndex
    })
  }
}
