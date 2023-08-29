import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: 'select',
  loadChildren: () => import('./countries/countries.module').then((m)=> m.CountriesModule)
},
{
  path:'**',
  redirectTo:'select'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
