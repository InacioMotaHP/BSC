import { RegistroUserService } from './../../services/registro-user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';
import { LoadingController, ToastController, NavController, Platform } from '@ionic/angular';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  //inconstante
  public userRegister: User = {};
  private loading: any;
  validations_form: FormGroup;
  errorMessage: string = '';
  usuarioID: string = null;
  private BackSubs: Subscription;

  private usuarioSubscription: Subscription;

  constructor(private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private platform: Platform,
    private nav: NavController,
    private rs: RegistroUserService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ionViewWillEnter() {
    this.presentLoading()
    this.BackSubs = this.platform.backButton.subscribe(() => {
      if (this.router.url == "/folder/perfil") {
        this.nav.navigateRoot("/folder/home")
      }
    });

    this.loadusuario();// inicia dados

  }
  //fechar subcribes quando page for fechada
  ionViewDidLeave() {
    this.BackSubs.unsubscribe();
    this.usuarioSubscription.unsubscribe();

  }

  //carrega dados do usuario
  async loadusuario() {

    this.userRegister.userId = (await this.authService.getAuth().currentUser).uid; //retorna id do usuario logado
    this.usuarioSubscription = this.rs.getRegistrosUsuario(this.userRegister.userId).subscribe(data => {

      this.userRegister = data; //quando há alteração, os dados são gravados em userRegister

    });
  }

  async updateReg() {

    this.userRegister.userId = (await this.authService.getAuth().currentUser).uid; //retorna id do usuario logado

    if (this.userRegister) {
      this.presentLoading();
      try {

        await this.rs.updateRegistroUsuario(this.userRegister.userId, this.userRegister) //atualiza dados do ID com os valores do segundo parametro
        this.presentToast("seus dados foram atualizados");

        this.directPerfilExibixao(); //ao salvar, direciona devolta para a pagina de perfil


      } catch (error) {
        this.presentToast("Erro ao atualizar registros");

      } 
    }
  }


  //Validadores de formularios
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
      { type: 'confirm', message: 'as senhas não conferem' },
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
      { type: 'pattern', message: 'rua invalida' },
      { type: 'minlength', message: 'mínimo de 3 caracteres' }
    ],
    'numero': [
      { type: 'required', message: 'o número é obrigatório' },
      { type: 'pattern', message: 'número invalido' }
    ],
    'cidade': [
      { type: 'required', message: 'a cidade é obrigatório' },
      { type: 'pattern', message: 'cidade invalido' }
    ],

    'bairro': [
      { type: 'required', message: 'o bairro é obrigatório' },
      { type: 'pattern', message: 'bairro invalido' },
      { type: 'minlength', message: 'mínimo de 3 caracteres' }
    ],
    'idade': [
      { type: 'required', message: 'a idade é obrigatória' },
      { type: 'pattern', message: 'idade invalido' }
    ],
    'complemento': [
      { type: 'required', message: 'um complemento é obrigatório' },
      { type: 'pattern', message: 'complemento invalido' },
      { type: 'minlength', message: 'mínimo de 3 caracteres' }
    ],
    'telefone': [
      { type: 'required', message: 'um telefone é obrigatório' },
      { type: 'pattern', message: 'telefone invalido' }
    ]
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
        Validators.pattern('^[a-zA-Z0-9]+$'),
        Validators.required,
        Validators.minLength(3)
      ])),
      numero: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]'),
        Validators.required
      ])),
      bairro: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9]+$'),
        Validators.required,
        Validators.minLength(3)
      ])),

      cidade: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9]+$'),
        Validators.required,
        Validators.minLength(3)
      ])),
      telefone: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]+$'),
        Validators.required
      ])),
      complemento: new FormControl('', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9]+$'),
        Validators.required,
        Validators.minLength(3)
      ])),
      idade: new FormControl('', Validators.compose([
        Validators.pattern('^[0-9]+$'),
        Validators.required
      ])),
    });
  }
  // dialog de loading
  async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      mode: 'ios',
      duration: 500,
      message: 'por favor aguarde...',
    });
    return this.loading.present();
  }
  //toast
  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      mode: 'ios',
      message,
      duration: 2000
    });
    toast.present();
  }

  directPerfilExibixao() {
    this.router.navigate(['../../folder/home']);
  }

}