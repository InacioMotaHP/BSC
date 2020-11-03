import { RegistroUserService } from './../../services/registro-user.service';
import { Network } from '@ionic-native/network/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresasService } from './../../services/empresas.service';
import { Empresas } from './../../interfaces/empresas';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AngularFirestore } from '@angular/fire/firestore';
import { AlertController, LoadingController, Platform, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-catalogo-empresas',
  templateUrl: './catalogo-empresas.page.html',
  styleUrls: ['./catalogo-empresas.page.scss'],
})
export class CatalogoEmpresasPage implements OnInit {
  empresasSub: Subscription;
  empresas = new Array<Empresas>();
  loadGoLista: any = []
  categorias: string = null;
  public msg: string = '';

  empresa: Empresas;
  public refEmpresa = this.afs.firestore.collection('Empresas');
  private BackSubs: Subscription;

  public selectOrdem: string;
  public cond: boolean = true
  loading: any;

  constructor(
    private loadingCtrl: LoadingController,
    private ps: EmpresasService,
    private activatedRoute: ActivatedRoute,
    private afs: AngularFirestore,
    public router: Router,
    private platform: Platform,
    private authService: AuthService,
    private nav: NavController,
    private alertCtrl: AlertController,
    public network: Network,
  ) {
    this.BackSubs = this.platform.backButton.subscribe(() => {
      if (this.router.url == "/folder/catalogo-empresas") {
        this.nav.navigateRoot("/folder/home")
      }
    });
  }

  ngOnInit() {

    this.categorias = this.activatedRoute.snapshot.params['categoria']; //recupera categoria passado por url
    if (!this.categorias) {
      this.categorias = ''
      this.consultarCategoriaEmpresas(this.categorias, '>=');
      this.cond = false
    } else {
      this.consultarCategoriaEmpresas(this.categorias, '==')
    }
  }

  ionViewDidLeave() {
    this.BackSubs.unsubscribe();

    if (this.empresasSub) {
      this.empresasSub.unsubscribe()
    }
  }

  //filtra a categória na hora
  async FiltroCat(cat: string) {
    this.empresas = []
    this.consultarCategoriaEmpresas(cat, '==');

  }

  //CONSULTAS POR CATEGORIA
  async consultarCategoriaEmpresas(cat: string, compa) {
    this.presentLoading()
    this.empresas = []
    await this.refEmpresa.where('cat', compa, cat).get().
      then(snapshot => {
        if (snapshot.empty) {
          this.msg = 'Não há empresas cadastradas nessa categoria! Indique o Buyers Sheeps à empresas para que logo encontre tudo que precisa aqui!!!'
          return;
        }

        snapshot.forEach(doc => {
          this.empresas.push(Object.assign({}, { idEmpresa: doc.id }, doc.data()));
          this.msg = '';

          return this.empresas;

        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });


  }

  redirectEmpresa(idEmpresa) {
    console.log(idEmpresa)
    this.router.navigate(['../../folder/empresa', idEmpresa]);
  }

  //SCROLL INFINITO
  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();
    }, 500);
  }
  async presentAlert(t, m) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: t,
      mode: 'ios',
      message: m,
      buttons: ['OK']
    });

    await alert.present();
  }
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Aguarde...',
      duration: 1000,
    });
    return this.loading.present();
  }

}
