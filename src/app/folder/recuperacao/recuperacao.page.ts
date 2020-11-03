import { Network } from '@ionic-native/network/ngx';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertController, Platform, NavController } from '@ionic/angular';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-recuperacao',
  templateUrl: './recuperacao.page.html',
  styleUrls: ['./recuperacao.page.scss'],
})
export class RecuperacaoPage implements OnInit {

  public userRegister: User = {};
  validations_form: FormGroup;
  BackSubs: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private authServise: AuthService,
    public alertController: AlertController,
    public router: Router,
    private platform: Platform,
    private nav: NavController,
    public networ: Network) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });
  }
  ionViewWillEnter() {
    this.BackSubs = this.platform.backButton.subscribe(() => {
      this.nav.navigateRoot("/folder/login")
    });
  }
  ionViewDidLeave() {
    this.BackSubs.unsubscribe();
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'o email é obrigatório' },
      { type: 'pattern', message: 'email invalido' }
    ]
  }

  getPassword() {
    if (this.networ.type != 'none') {
      if (this.userRegister.email != '' && this.userRegister.email != undefined) {
        try {
          this.authServise.resetPassword(this.userRegister.email)
          this.router.navigate(['../../folder/login'])
          this.alertconfirm("Email com link para redefinição de senha enviado para: " + this.userRegister.email)
        } catch (error) {
          this.alertconfirm(error)
        }
      } else {
        this.alertconfirm("Preencha o campo 'EMAIL'!")
      }
    } else (
      this.alertconfirm('Sem conexão, tente novamente!')
    )

  }

  async alertconfirm(m) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: m,
      mode: 'ios',
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

}
