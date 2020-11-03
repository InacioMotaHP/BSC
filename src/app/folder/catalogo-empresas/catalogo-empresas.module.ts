import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CatalogoEmpresasPageRoutingModule } from './catalogo-empresas-routing.module';

import { CatalogoEmpresasPage } from './catalogo-empresas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CatalogoEmpresasPageRoutingModule
  ],
  declarations: [CatalogoEmpresasPage]
})
export class CatalogoEmpresasPageModule {}
