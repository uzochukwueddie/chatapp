import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CountriesPage } from './countries';

@NgModule({
  declarations: [
    CountriesPage,
  ],
  imports: [
    IonicPageModule.forChild(CountriesPage),
  ],
})
export class CountriesPageModule {}
