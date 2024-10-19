import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Asegúrate de que la ruta sea correcta
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { RegistroComponent } from './registro/registro.component';
import { InicioadminComponent } from './inicioadmin/inicioadmin.component';
import { VerificarCodigoComponent } from './verificar-codigo/verificar-codigo.component';


export const routes: Routes = [
{ path: '', component: InicioComponent },
{ path: 'login', component: LoginComponent },
{ path: 'registro', component: RegistroComponent },
{ path: 'verificacion', component: VerificarCodigoComponent },
{ path: 'inicioadmin', component: InicioadminComponent, canActivate: [AuthGuard] },
];
