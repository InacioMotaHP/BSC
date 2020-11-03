import { Network } from '@ionic-native/network/ngx';
import { Router } from '@angular/router';
import { Categorias } from './../../interfaces/categorias';
import { CatServiceService } from './../../services/cat-service.service';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-catprimarias',
  templateUrl: './catprimarias.page.html',
  styleUrls: ['./catprimarias.page.scss'],
})
export class CatprimariasPage implements OnInit {
  catSubs: Subscription;
  categoriasPrimarias = new Array<Categorias>()
  subCatSubs: Subscription;
  categoriasSecundarias: {};
  BackSubs: Subscription;


  constructor(
    private router: Router,
    private catSevice: CatServiceService,
    private platform: Platform,
    private nav: NavController,
    public network: Network
  ) { }

  ngOnInit() {

  }
  ionViewWillEnter() {
    if (this.network.type != "none") {
      this.loadCat()
    }
    this.BackSubs = this.platform.backButton.subscribe(() => {
      if (this.router.url == "/folder/catprimarias") {
        this.nav.navigateRoot("/folder/home")
      }
    });

  }
  ionViewDidLeave() {
    this.BackSubs.unsubscribe();

    this.catSubs.unsubscribe()

  }

  loadCat() {
    this.catSubs = this.catSevice.getCategorias().subscribe(data => {
      this.categoriasPrimarias = data
    });
  }

  escolherCatP(id) {
    this.router.navigate(['../../folder/catsecundarias/' + id]);

  }
}
