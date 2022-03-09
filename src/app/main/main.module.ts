import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { MainBodyComponent } from './main-body/main-body.component';
import { MainFacetComponent } from './main-facet/main-facet.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const components = [MainComponent, MainBodyComponent];

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [{ path: 'body', component: MainBodyComponent }],
  },
];

@NgModule({
  declarations: [...components, MainFacetComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class MainModule {}
