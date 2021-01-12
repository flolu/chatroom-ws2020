import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'

import {AuthGuard} from '@guards'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../features/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'signin',
    loadChildren: () => import('../features/signin/signin.module').then(m => m.SigninModule),
  },
  {path: '**', redirectTo: '', pathMatch: 'full'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes, {initialNavigation: 'enabled'})],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
