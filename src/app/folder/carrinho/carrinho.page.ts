import { ProductService } from './../../services/product.service';
import { Empresas } from './../../interfaces/empresas';
import { Router } from '@angular/router';
import { PedidoService } from './../../services/pedido.service';
import { Pedido } from './../../interfaces/pedido';
import { Product } from './../../interfaces/product';
import { AuthService } from './../../services/auth.service';
import { ToastController, LoadingController, IonRouterOutlet, Platform, NavController } from '@ionic/angular';
import { CarrinhoService } from './../../services/carrinho.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { RegistroUserService } from 'src/app/services/registro-user.service';
import { User } from 'src/app/interfaces/user';
import { EmpresasService } from 'src/app/services/empresas.service';
import { AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';

@Component({
  selector: 'app-carrinho',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
})
export class CarrinhoPage implements OnInit {

  public products = new Array<Product>();
  public productsf = new Array<Product>();

  private loading: any;
  private productsSubscription: Subscription;
  private toastCtrl: ToastController;
  private userId: Product = {}
  public refCar = this.afs.firestore.collection('carrinho');
  public valueq: number = 1;
  public fornecedor: Array<string> = []
  public total: number = 0;
  public produto: Product = {}
  public preco = new Array<number>();
  public pedir: Pedido = {};
  public produtoNome: Array<string> = [];
  public produtoPreco: Array<number> = [];
  public produtoQuant: Array<number> = [];
  public produtoPicture: Array<string> = [];
  private usuarioSubscription: Subscription;
  public userRegister: User = {};
  public empresa: Empresas = {}
  BackSubs: Subscription;
  public msg: string = '';

  constructor(
    public alertController: AlertController,
    private carService: CarrinhoService,
    private authService: AuthService,
    private afs: AngularFirestore,
    private loadingCtrl: LoadingController,
    private pedido: PedidoService,
    private rs: RegistroUserService,
    private empresaServ: EmpresasService,
    private router: Router,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private nav: NavController,
    public network: Network) { }

  //PDF Make INSTALADO NESSE PROJETO!!!

  ionViewDidLeave() {//4
    this.usuarioSubscription.unsubscribe();
    this.BackSubs.unsubscribe()
  }

  ionViewWillEnter() {//1

    this.BackSubs = this.platform.backButton.subscribe(() => {
      if (this.router.url == "/folder/carrinho" && !this.routerOutlet.canGoBack()) {
        this.nav.navigateRoot("/folder/home")
      }
    });
    if (this.network.type != 'none') {
      this.loadUser();
    }
  }

  separaFornecedro() {
    if (this.products) {
      for (let i = 0; i < this.products.length; i = i + 1) {
        this.fornecedor[i] = this.products[i].fornecedor;
      }

      //função que separa fornecedores sem repetir nomes
      this.fornecedor = this.fornecedor.filter(function (elem, pos, self) {
        return self.indexOf(elem) == pos
      })
    } else {
      return
    }
  }

  comprarEm(forn: string, obs: string) {

    console.log("vc está comprando em :", forn)
    this.loadProductF(this.userId.userId, forn, 'confirmar', obs);
  }

  exclurPedido(forn) {
    this.productsf = null;
    console.log("vc está apagando pedido de :", forn);
    this.loadProductF(this.userId.userId, forn, 'excluir', 'observação');

  }

  async loadUser() {
    this.userId.userId = (await this.authService.getAuth().currentUser).uid; //retorna id do usuario logado 
    this.loadProduct(this.userId.userId);
    this.loadusuario(this.userId.userId)
  }

  async loadusuario(uID: string) {
    this.usuarioSubscription = this.rs.getRegistrosUsuario(uID).subscribe(data => {
      this.userRegister = data;
    });
  }

  async loadProductF(idUsuario: string, fornecedor: string, click: string, obs: string) {

    this.productsf = [];

    await this.refCar.where('userId', '==', idUsuario).where('fornecedor', '==', fornecedor).get().
      then(snapshot => {
        if (snapshot.empty) {
          this.presentAlert("Nenhum pedido retornado", "Realize um pedido!")
          return;
        }
        snapshot.forEach(doc => {
          this.productsf.push(Object.assign({}, { id: doc.id }, doc.data()));

          if (click == 'excluir') {
            this.deleteProduct(doc.id)
          }
          return this.productsf;
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    if (click == 'confirmar') {
      //this.pedidoDetalhes(fornecedor, obs);
      this.loadEmpresa(this.productsf[0].idEmpresa, obs)
    }

  }

  async loadEmpresa(idEmpresa: string, obs: string) {
    this.empresaServ.getEmpresa(idEmpresa).subscribe(data => {
      this.empresa = data;
      this.pedidoDetalhes(this.empresa.name, obs, this.empresa.telefone1, this.empresa.picture)
      return this.empresa
    })
  }


  async pedidoDetalhes(forn: string, obs: string, tel: number, picture: string) {
    this.pedir = {};
    this.produtoNome = []
    this.produtoPicture = []
    this.produtoPreco = []
    this.produtoQuant = []

    await this.presentLoading(); //chama loading na tela

    this.total = 0;

    for (let w = 0; w < this.productsf.length; w = w + 1) {
      this.produtoNome[w] = this.productsf[w].name
      this.produtoPreco[w] = this.productsf[w].price
      this.produtoQuant[w] = this.productsf[w].quant
      this.produtoPicture[w] = this.productsf[w].picture
      this.pedir.fornecedorId = this.productsf[w].idEmpresa;
      this.total = this.total + (this.productsf[w].quant * this.productsf[w].price)
    }

    //realiza registro depedido
    try {
      this.pedir.descricaoEobservacoes = obs;
      this.pedir.clienteName = this.userRegister.name + " " + this.userRegister.sobrenome
      this.pedir.clienteEndereco = 'Rua: ' + this.userRegister.rua + ', N°: ' + this.userRegister.numero + ', Bairro: ' + this.userRegister.bairro
      this.pedir.clienteTelefone = this.userRegister.telefone
      this.pedir.proximoAque = this.userRegister.complemento
      this.pedir.fornecedor = forn;
      this.pedir.clienteId = this.userId.userId;//id usuario
      this.pedir.dataEhorario = new Date().getTime()
      this.pedir.produtoNome = this.produtoNome;
      this.pedir.produtoPreco = this.produtoPreco;
      this.pedir.produtoPicture = this.produtoPicture;
      this.pedir.produtoQuantidade = this.produtoQuant;
      this.pedir.ValorTotal = this.total;
      this.pedir.status = 'Realizado'
      //dados do fornecedor
      this.pedir.contatorEmpresa = tel;
      this.pedir.empresaPicture = picture;

      this.pedido.addpedido(this.pedir); //add ao bd pedidos
      this.presentAlert("Pedido Anotado Com sucesso!", "Volte Sempre!!!")
      this.exclurPedido(forn) //excluir do bd carrinho
      this.loadProduct(this.userId.userId);
      //redirect page pedidos
      this.router.navigate(['../../folder/pedidos'])

    } catch (e) {
      console.error(e)
      this.presentAlert("Por favor, Tente novamente", "Ocorreu um erro em nossa base, tente novamente em segundos!")
    } finally {
      this.loading.dismiss(); // tira loading da tela
    }
  }

  async loadProduct(idzin: string) {
    this.presentLoading()

    this.fornecedor = []
    this.products = []

    await this.refCar.where('userId', '==', idzin).orderBy('fornecedor').get().
      then(snapshot => {

        if (snapshot.empty) {
          this.msg = 'Nenhum produtos encontrado, adicione alguns clicando no ícone de coração ao lado do preço de cada produto!'
          return;
        }
        snapshot.forEach(doc => {
          this.msg = ''
          this.products.push(Object.assign({}, { id: doc.id }, doc.data()));  //  adiciona a string doc.id a vara id e faz push do objeto com doc.data(), tudo em um único objeto
          return this.products;

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    this.separaFornecedro();

  }

  ngOnInit() {
  }

  async deleteProduct(id: string) {
    try {
      await this.carService.deleteProduct(id);
      this.loadProduct(this.userId.userId);
    } catch (error) {

    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'carregando...',
      mode: 'ios',
      duration: 1500
    });
    return this.loading.present();

  }

  async confirmarPedido(forn: string) {

    const alert = await this.alertController.create({
      mode: 'ios',
      cssClass: 'my-custom-class',
      header: 'Confirmação de pedido',
      inputs: [

        {
          name: 'Obs',
          type: 'textarea',
          placeholder: 'Adicone alguma observação!(OPCIONAL)',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: (alertData) => {

            this.comprarEm(forn, alertData.Obs);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert(t, m) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: t,
      message: m,
      buttons: ['OK']
    });

    await alert.present();
  }

  async confirmExclusao(forn: string, id: string, cond: number) {
    console.log(id)
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: "Confirmação de exclusão",
      message: "Tem certeza dessa exclusão?",
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
          if (cond == 1) {
            this.exclurPedido(forn);
          } else if (cond == 2) {
            this.deleteProduct(id)
          }
        }
      }]
    });

    await alert.present();
  }

  //Quase solução pro + e - da quantidade

  async quantidade(id: string, quant: number) {
    var g: Product;
    var psub: Subscription
    console.log(id)
    console.log(quant)

    psub = this.carService.getProduct(id).subscribe(data => {
      g = data
      console.log(g)
      g.quant = quant;
      this.carService.updateProduct(id, g)
      this.loadProduct(this.userId.userId)

      psub.unsubscribe()
    })
  }

  async alterQuant(id: string) {
    const alert = await this.alertController.create({
      mode: 'ios',
      cssClass: 'my-custom-class',
      header: 'Alteração de quantidade',
      inputs: [

        {
          name: 'quant',
          type: 'number',
          placeholder: 'Qual a nova quantidade? (maior que 0)',
        }

      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirmar',
          handler: (alertData) => {
            if (alertData.quant > 0) {
              this.quantidade(id, alertData.quant)
            } else {
              console.log('Quantidade precisa ser maior que zero')
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      mode: 'ios',
      duration: 2000
    });
    toast.present();
  }
}