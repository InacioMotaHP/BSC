import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatsecundariasPageRoutingModule } from './catsecundarias-routing.module';

import { CatsecundariasPage } from './catsecundarias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatsecundariasPageRoutingModule
  ],
  declarations: [CatsecundariasPage]
})
export class CatsecundariasPageModule {}
