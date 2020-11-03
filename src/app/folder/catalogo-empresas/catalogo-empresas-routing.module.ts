import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatalogoEmpresasPage } from './catalogo-empresas.page';

const routes: Routes = [
  {
    path: '',
    component: CatalogoEmpresasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogoEmpresasPageRoutingModule {}
