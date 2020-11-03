import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  status: string;

  constructor(
    private network: Network,
    private alertController: AlertController,
    private router: Router,
    private toastCtrl: ToastController

  ) { }

  onDisconnect() {
    let sub: Subscription
    sub = this.network.onDisconnect().subscribe(() => {
      this.presentToast("Sem Conexão com a Internet!")
      this.Connection()
      sub.unsubscribe()
    })
  }
  onConnect() {
    let sub: Subscription
    sub = this.network.onConnect().subscribe(() => {
      this.presentToast("Conexão Estabelcida!")
      this.Connection()
      sub.unsubscribe()
    })
  }

  Connection() {

    if (this.network.type !== 'none') {
      this.onDisconnect();
      return true
    } else {
      this.onConnect()
      return false
    }
  }


  async alert(e: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: e,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'tertiary',
          handler: () => {
            console.log(this.router.url)
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
