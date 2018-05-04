import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { ROUTES } from './app.routes';

import { AuthService } from './auth/auth.service';
import { CallbackComponent } from './callback/callback.component';
import { MapComponent } from './views/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { ShapesService } from './services/shapes.service';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CallbackComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    LeafletModule.forRoot(),
    LeafletDrawModule.forRoot()

  ],
  providers: [
    AuthService,
    ShapesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
