import { Network } from '@ionic-native/network/ngx';
import { Pedido } from './../../interfaces/pedido';
import { PedidoService } from './../../services/pedido.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-pedido-detalhes',
  templateUrl: './pedido-detalhes.page.html',
  styleUrls: ['./pedido-detalhes.page.scss'],
})
export class PedidoDetalhesPage implements OnInit {



  private pedidoSubs: Subscription;
  public pedido: Pedido = {}
  public pedidoProd = new Array<Pedido>();
  public cod: string;
  public recebido: boolean;
  public cancelado: boolean;
  public excluivel: boolean = true;
  public cond: boolean = true;
  public verm: string = 'ver mais'

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pedidoService: PedidoService,
    private loadingCtrl: LoadingController,
    private alert: AlertController,
    public network: Network
  ) {

  }
  ionViewWillEnter() {
    if (this.network.type != 'none') {
      this.presentLoading()
      this.cod = this.activatedRoute.snapshot.params['cod']; //recupera id passado por url
      this.loadProduct(this.cod)
    }
  }
  ionViewDidLeave() {
    if (this.pedidoSubs) {
      this.pedidoSubs.unsubscribe()
    }
  }

  ngOnInit() {
  }

  ver() {
    this.cond = !this.cond
    if (this.cond == true) {
      this.verm = 'ver mais'
    } else {
      this.verm = 'ver menos'
    }
  }
  async loadProduct(cod: string) {

    this.pedidoSubs = this.pedidoService.getpedidot(cod).subscribe(data => { //retorna todos os produtos
      this.pedidoProd = [] //zera dados, para não duplicar produtos antes de atualizar

      this.pedido = data;

      this.pedidoProd.push(Object.assign({}, { produtoPicture: this.pedido.produtoPicture },
        { produtoNome: this.pedido.produtoNome },
        { produtoPreco: this.pedido.produtoPreco },
        { produtoQuantidade: this.pedido.produtoQuantidade }))

      if (this.pedido.status == "Cancelado") {
        this.confirmCancel('Atenção, este pedido foi cancelado pelo fornecedor!', 'Por: ' + this.pedido.movitoCancelamento)
      }

    });
  }

  async ConfirmarRecebimento() {

    this.pedido.status = "Recebido"
    console.log(this.pedido, this.cod)
    this.pedidoService.setpedido(this.cod, this.pedido)

    this.router.navigate(['../../folder/pedidos'])
  }

  excluirPedido() {
    try {
      this.pedidoService.deletepedido(this.cod);
      this.router.navigate(['../../folder/pedidos']);
    } catch (error) {
      console.error(error)
    }

  }

  async confirmAlteracaoStatus(oQueFazer: string, t, m) {
    const alertc = await this.alert.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: t,
      message: m,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log(oQueFazer)
        }
      }, {
        text: 'Confirmar',
        handler: () => {
          if (oQueFazer == 'excluir') {
            this.excluirPedido()
          } else if (oQueFazer == 'recebido') {
            this.ConfirmarRecebimento()
          } else if ('canceladoPeloForn') {
            this.excluirPedido()
          }

        }
      }]
    });

    await alertc.present();
  }
  async confirmCancel(t, m) {
    const alertc = await this.alert.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: t,
      message: m,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.excluirPedido();

        }
      }]
    });

    await alertc.present();
  }
  async presentLoading() {
    let loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Aguarde...',
      duration: 500,
    });
    return loading.present();
  }

}
