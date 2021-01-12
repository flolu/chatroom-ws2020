import {NgModule} from '@angular/core'
import {Routes, RouterModule} from '@angular/router'

import {AuthGuard} from '@guards'
import {UserClientRoutes} from '@shared'

const routes: Routes = [
  {
    path: UserClientRoutes.Home,
    loadChildren: () => import('../features/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard],
  },
  {
    path: UserClientRoutes.SignIn,
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
