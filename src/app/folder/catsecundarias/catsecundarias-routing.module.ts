import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatsecundariasPage } from './catsecundarias.page';

const routes: Routes = [
  {
    path: '',
    component: CatsecundariasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatsecundariasPageRoutingModule {}
