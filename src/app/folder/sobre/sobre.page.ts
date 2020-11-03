import { Component, OnInit } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
})
export class SobrePage implements OnInit {
  private BackSubs: Subscription;

  constructor(
    private platform: Platform,
    private nav: NavController,
    private router: Router) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.BackSubs = this.platform.backButton.subscribe(() => {
      if (this.router.url == "/folder/sobre") {
        this.nav.navigateRoot("/folder/home")
      }
    });
  }
  ionViewDidLeave() {
    this.BackSubs.unsubscribe();
  }

}
