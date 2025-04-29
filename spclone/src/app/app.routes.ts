import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginhomeComponent } from './pages/loginhome/loginhome.component';
import { FavoritesComponent } from './pages/favourites/favourites.component';
import { PlaylistComponent } from './pages/playlist/playlist.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  // LoginhomeComponent and FavoritesComponent will now receive parameters through query strings
  { path: 'loginhome', component: LoginhomeComponent }, // No longer includes route parameters
  { path: 'favourites', component: FavoritesComponent },
  { path: 'playlist', component: PlaylistComponent } // No route parameters here either
];
