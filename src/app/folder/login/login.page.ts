import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController, MenuController, Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  private BackSubs: Subscription;
  public userLogin: User = {};
  loading: any;
  validations_form: FormGroup;
  errorMessage: string = '';

  constructor(

    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    public menuCtrl: MenuController,
    public alertController: AlertController) {

  }
  ionViewWillEnter() {
    this.menuCtrl.swipeGesture(false)
    this.BackSubs = this.platform.backButton.subscribe(() => {

        this.confirmExit()
      
    });
  }
  ionViewDidLeave() {
      this.BackSubs.unsubscribe()
    
  }


  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'o email é obrigatório' },
      { type: 'pattern', message: 'Email invalido' }
    ],
    'password': [
      { type: 'required', message: 'a senha é obrigatória' },
      { type: 'minlength', message: 'a senha precisa de 6 digitos no mínimo' }
    ]
  }


  // REALIZA CONEXÇÃO E LOGIN SE POSSÍVEL
  async login() {
    await this.presentLoading(); //chama loading na tela
    try {
      await this.authService.login(this.userLogin); //realiza login
    } catch (error) {
      this.presentToast(error.message); //mostra se ocorrer erro no autenticação
    } finally {
      this.loading.dismiss(); // tira loading da tela
    }
  }

  // dialog de loading
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'por favor aguarde...', mode: 'ios'
    });
    return this.loading.present();
  }

  //toast
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      mode: 'ios',
      duration: 2000
    });
    toast.present();
  }
  async confirmExit() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      mode: 'ios',
      header: 'Deseja realmente sair?',
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
          handler: () => {
            navigator["app"].exitApp()
          }
        }
      ]
    });

    await alert.present();
  }
  //direciona para cadastro
  redirectCadastro() {
    this.router.navigate(['../../folder/cadastro-usuario']);
  }
  redirectRecuperacao() {
    this.router.navigate(['../../folder/recuperacao']);

  }
}


