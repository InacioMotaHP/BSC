import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatprimariasPageRoutingModule } from './catprimarias-routing.module';

import { CatprimariasPage } from './catprimarias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatprimariasPageRoutingModule
  ],
  declarations: [CatprimariasPage]
})
export class CatprimariasPageModule {}
