import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatprimariasPage } from './catprimarias.page';

const routes: Routes = [
  {
    path: '',
    component: CatprimariasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatprimariasPageRoutingModule {}
