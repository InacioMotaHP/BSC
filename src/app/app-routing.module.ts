import { RecuperacaoPageModule } from './folder/recuperacao/recuperacao.module';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/login',
    pathMatch: 'full'
  },
 {
    path: 'folder/login',
    loadChildren: () => import('./folder/login/login.module').then( m => m.LoginPageModule), canActivate: [LoginGuard]
  },
  {
    path: 'folder/cadastro-usuario',
    loadChildren: () => import('./folder/cadastro-usuario/cadastro-usuario.module').then( m => m.CadastroUsuarioPageModule), canActivate: [LoginGuard]
  },
  {
    path: 'folder/home',
    loadChildren: () => import('./folder/home/home.module').then( m => m.HomePageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/favoritos',
    loadChildren: () => import('./folder/favoritos/favoritos.module').then( m => m.FavoritosPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/catalogo',
    loadChildren: () => import('./folder/catalogo/catalogo.module').then( m => m.CatalogoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/catalogo/:id',
    loadChildren: () => import('./folder/catalogo/catalogo.module').then( m => m.CatalogoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/perfil',
    loadChildren: () => import('./folder/perfil/perfil.module').then( m => m.PerfilPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/sobre',
    loadChildren: () => import('./folder/sobre/sobre.module').then( m => m.SobrePageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/detalhes-produto/:id',
    loadChildren: () => import('./folder/detalhes-produto/detalhes-produto.module').then( m => m.DetalhesProdutoPageModule), canActivate: [AuthGuard]
  },
   {
    path: 'folder/catalogo-empresas',
    loadChildren: () => import('./folder/catalogo-empresas/catalogo-empresas.module').then( m => m.CatalogoEmpresasPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/empresa/:id',
    loadChildren: () => import('./folder/empresa/empresa.module').then( m => m.EmpresaPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/catalogo-empresas/:categoria',
    loadChildren: () => import('./folder/catalogo-empresas/catalogo-empresas.module').then( m => m.CatalogoEmpresasPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/carrinho',
    loadChildren: () => import('./folder/carrinho/carrinho.module').then( m => m.CarrinhoPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/pedidos',
    loadChildren: () => import('./folder/pedidos/pedidos.module').then( m => m.PedidosPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/pedido-detalhes/:cod',
    loadChildren: () => import('./folder/pedido-detalhes/pedido-detalhes.module').then( m => m.PedidoDetalhesPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/recuperacao',
    loadChildren: () => import('./folder/recuperacao/recuperacao.module').then(m => m.RecuperacaoPageModule), canActivate: [LoginGuard]
  },
  {
    path: 'folder/catsecundarias/:id',
    loadChildren: () => import('./folder/catsecundarias/catsecundarias.module').then( m => m.CatsecundariasPageModule), canActivate: [AuthGuard]
  },
  {
    path: 'folder/catprimarias',
    loadChildren: () => import('./folder/catprimarias/catprimarias.module').then(m => m.CatprimariasPageModule), canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
