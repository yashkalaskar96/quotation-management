import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatequotationComponent } from './createquotation/createquotation.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RatecardComponent } from './ratecard/ratecard.component';
import { CreateRateCardComponent } from './createratecard/createratecard.component';
import { ListratecardComponent } from './listratecard/listratecard.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'createquotation', component: CreatequotationComponent },
  { path: 'home', component: HomeComponent },
  { path: 'createratecard', component:CreateRateCardComponent},
  { path: 'listratecard', component:ListratecardComponent}

  // {
  //   path: '',
  //   component: NavbarComponent,
  //   children: [
  //     { path: 'product', component: ProductComponent },
  //     { path: 'addproduct', component: AddProductComponent },
  //     { path: 'about', component: AboutComponent },
  //     { path: 'list', component: ListComponent },
  //     { path: 'settings', component: SettingsComponent },
  //     { path: 'bin', component: BinComponent }
    // }:
    ]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export { routes };
