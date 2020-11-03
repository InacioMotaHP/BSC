import { Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { LoadingController, ToastController, MenuController, Platform, NavController } from '@ionic/angular';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.page.html',
  styleUrls: ['./cadastro-usuario.page.scss'],
})
export class CadastroUsuarioPage implements OnInit {
  BackSubs: Subscription;


  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private platform: Platform,
    private nav: NavController,) {
  }


  //inconstante
  public userRegister: User = {};
  private loading: any;
  validations_form: FormGroup;
  errorMessage: string = '';

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
      passConfirm: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      nome: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z]+$'),
        Validators.required,
        Validators.minLength(3)
      ])),
      sobrenome: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z]+$'),
        Validators.required,
        Validators.minLength(3)
      ])),
      rua: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      numero: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]+$'),
        Validators.required
      ])),
      bairro: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      cidade: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      telefone: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]+$'),
        Validators.required,
        Validators.minLength(10)
      ])),
      complemento: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      idade: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]+$'),
        Validators.required,
        Validators.maxLength(3)
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
    ],
    'password': [
      { type: 'required', message: 'a senha é obrigatória' },
      { type: 'minlength', message: 'a senha precisa de 6 digitos no mínimo' }
    ],
    'passConfirm': [
      { type: 'required', message: 'campo obrigatório' },
    ],
    'nome': [
      { type: 'required', message: 'o nome é obrigatório' },
      { type: 'pattern', message: 'nome invalido' },
      { type: 'minlength', message: 'mínimo de 3 caracteres' }
    ],
    'sobrenome': [
      { type: 'required', message: 'o sobrenome é obrigatório' },
      { type: 'pattern', message: 'sobrenome invalido' },
      { type: 'minlength', message: 'mínimo de 3 caracteres' }
    ],
    'rua': [
      { type: 'required', message: 'a rua é obrigatória' },
    ],
    'numero': [
      { type: 'required', message: 'o número é obrigatório' },
      { type: 'pattern', message: 'número invalido' }
    ],
    'bairro': [
      { type: 'required', message: 'o bairro é obrigatório' }
    ],
    'cidade': [
      { type: 'required', message: 'a cidade é obrigatória' }
    ],
    'idade': [
      { type: 'required', message: 'a idade é obrigatória' },
      { type: 'pattern', message: 'idade invalido' },
      { type: 'maxlength', message: 'máximo 3 dígitos' }
    ],
    'complemento': [
      { type: 'required', message: 'um complemento é obrigatório' },

    ],
    'telefone': [
      { type: 'required', message: 'um telefone é obrigatório' },
      { type: 'pattern', message: 'telefone invalido' },
      { type: 'minlength', message: 'telefone invalido' }
    ]
  }

  async register() { //realiza registro
    await this.presentLoading(); //chama loading na tela
    try {
      await this.authService.register(this.userRegister).then(result => {
        let users = this.afs.collection("usuarios");

        users.add({
          nome: this.userRegister.name,
          sobrenome: this.userRegister.sobrenome,
          email: this.userRegister.email,
          // senha: this.userRegister.password, evitar de salvar senha descriptografada
          telefone: this.userRegister.telefone,
          rua: this.userRegister.rua,
          numero: this.userRegister.numero,
          complemento: this.userRegister.complemento,
          bairro: this.userRegister.bairro,
          idade: this.userRegister.idade,
          cidade: this.userRegister.cidade
        })
      })
      this.presentToast('Bem vindo a tribo do Buyers Sheeps!!!');
    } catch (error) {
      this.presentToast(error.message); //mostra se ocorrer erro no cadastro
    } finally {
      this.loading.dismiss(); // tira loading da tela
    }
  }

  // dialog de loading
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'por favor aguarde...',
      mode: 'ios',

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
  //redirectLogin
  redirectLogin() {
    this.router.navigate(['../../folder/login']);
  }
}
