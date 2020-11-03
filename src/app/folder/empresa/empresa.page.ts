import { Network } from '@ionic-native/network/ngx';
import { LoadingController, IonSlides } from '@ionic/angular';
import { ProductService } from './../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from './../../interfaces/product';
import { AuthService } from './../../services/auth.service';
import { Empresas } from './../../interfaces/empresas';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { EmpresasService } from 'src/app/services/empresas.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.page.html',
  styleUrls: ['./empresa.page.scss'],
})
export class EmpresaPage implements OnInit {

  public empresa: Empresas = {}
  private refEmpresas = this.afs.firestore.collection('Products')
  public products = new Array<Product>()
  public empresaSubs: Subscription;
  public whatslink1: string;
  public esconderInfor: boolean = true
  public escondeIcon: string = "arrow-down-outline"
  public escondeBtn: string = "ver mais"

  //teste seach

  private productsSubscription: Subscription;
  dadosSearch: any[];
  loadGoLista: any = []
  loading: any;
  selectedSlide: IonSlides;
  segment = 0;



  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private afs: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private empresaService: EmpresasService,
    private produtoService: ProductService,
    public network: Network
  ) {

  }
  ionViewWillEnter() {
    if (this.network.type != 'none') {
      this.presentLoading()
      this.loadUser();
      this.loadEmpresa();
    }

  }
  ionViewDidLeave() {
    this.productsSubscription.unsubscribe()
  }
  ngOnInit() { }

  async loadUser() {
    this.empresa.idEmpresa = this.activatedRoute.snapshot.params['id']; //recupera id passado por url //retorna id da empresa clicada 
    this.loadProduct();
  }
  loadEmpresa() {
    this.empresaSubs = this.empresaService.getEmpresa(this.empresa.idEmpresa).subscribe(data => { //retorna todos os produtos
      this.empresa = data;
      
      this.whatslink1 = "https://api.whatsapp.com/send?phone=55" + this.empresa.telefone1 + "&text=Ol%C3%A1%2C%20vim%20pelo%20ShoppTaua%C3%1%2C%20Quero%20saber%20mais%20sobre%20alguns%20detalhes!"
    
      if (this.empresa.horarios == undefined || this.empresa.horarios == '') {
        this.empresa.horarios = "sem horários cadastrados"
      }
    });

  }

  async loadProduct() {
    this.productsSubscription = this.produtoService.getProducts().subscribe(data => {
      this.products = data;
    })
  }

  redirectDetalhesProduto(idProduto: string) {
    this.router.navigate(['../../folder/detalhes-produto', idProduto]);
  }
  clicksCar() {
    this.router.navigate(['../../folder/carrinho']);
  }
  escondeInfor() {
    this.esconderInfor = !this.esconderInfor
    if (this.escondeBtn == "ver mais") {
      this.escondeBtn = "ver menos"
    } else {
      this.escondeBtn = "ver mais"
    }
    if (this.escondeIcon == "arrow-down-outline") {
      this.escondeIcon = "arrow-up-outline"
    } else {
      this.escondeIcon = "arrow-down-outline"
    }
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
    }, 500);
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Aguarde...',
      duration: 500,
    });
    return this.loading.present();
  }

  //search

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
  async loadProducts() {
    this.productsSubscription = this.produtoService.getProducts().subscribe(data => {
      this.loadGoLista = data;
    });
  }

  //slide 
  slideOpts = {
    mode: 'ios',
    initialSlide: 0,
    slidePerView: 1,
    speed: 200,

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
