import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';

import { ROUTES } from './app.routes';

import { AuthService } from './auth/auth.service';

import { MapComponent } from './views/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { ShapesService } from './services/shapes.service';
import { InfopanelComponent } from './views/infopanel/infopanel.component';
import { AgmCoreModule } from '@agm/core';
import { MapGoogleComponent } from './views/map-google/map-google.component';
import { ShapeCollectionService } from './services/shape-collection.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
    InfopanelComponent,
    MapGoogleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCLF_UJ9DEZ_GrdQyUEb3wCaDRxDQW_2i4',
      libraries: ['drawing', 'places']
    })
  ],
  providers: [
    AuthService,
    ShapesService,
    ShapeCollectionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
