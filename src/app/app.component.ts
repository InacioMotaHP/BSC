import { Subscription } from 'rxjs';

import { User } from './interfaces/user';
import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Push, PushOptions, PushObject } from '@ionic-native/push/ngx'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  userId: string = null;
  user: User = {};
  userSubs: Subscription;



  public appPages = [
    {
      title: 'Página Inicial',
      url: '/folder/home',
      icon: 'home-outline'
    },
    {
      title: 'Favoritos',
      url: '/folder/favoritos',
      icon: 'star-outline'
    },
    {
      title: 'Meus Pedidos',
      url: '/folder/pedidos',
      icon: 'cash-outline'
    },
    {
      title: 'Empresas',
      url: '/folder/catalogo-empresas',
      icon: 'business-outline'
    },
    {
      title: 'Todos os Produtos',
      url: '/folder/catprimarias',
      icon: 'file-tray-stacked'
    },
    {
      title: 'Meu Carrinho',
      url: '/folder/carrinho',
      icon: 'cart-outline'
    },
    {
      title: 'Perfil',
      url: '/folder/perfil',
      icon: 'person-outline'
    },
    {
      title: 'Sobre Nós!',
      url: '/folder/sobre',
      icon: 'add-circle'
    }
  ];
  constructor(
    private push: Push,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afa: AuthService,

  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleBlackOpaque();
      this.initializeFirebase()
    });
  }
  logout() {
    return this.afa.logout();
  }
  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }
private initializeFirebase() {
  const options: PushOptions = {
    android: {
      senderID: '778517504477'
    }
  }
  const PushObject: PushObject = this.push.init(options)

  PushObject.on('registration').subscribe(res => console.log(' ${res.registrationId}'))

  PushObject.on('notification').subscribe(res=> console.log("Helo Word of Notifiation: ${res.message}"))
}

  
}
