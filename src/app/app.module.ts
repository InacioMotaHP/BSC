import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//fire
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
//import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Network } from '@ionic-native/network/ngx';
import { Push, PushOptions, PushObject } from '@ionic-native/push/ngx'

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    
  ],
  providers: [
    StatusBar,Network,
    SplashScreen,
    Push,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    EmailComposer
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
