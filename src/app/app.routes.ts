import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard'; // Asegúrate de que la ruta sea correcta
import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { RegistroComponent } from './registro/registro.component';
import { ProductosComponent } from './productos/productos.component';
import { DetalleproductoComponent } from './detalleproducto/detalleproducto.component';
import { InicioadminComponent } from './inicioadmin/inicioadmin.component';
import { VerificarCodigoComponent } from './verificar-codigo/verificar-codigo.component';
import { PoliticasComponent } from './politicas/politicas.component';
import { TerminosComponent } from './terminos/terminos.component';
import { DeslindeComponent } from './deslinde/deslinde.component';
import { PerfilempresaComponent } from './perfilempresa/perfilempresa.component';
import { IncidenciasComponent } from './incidencias/incidencias.component';
import { RecuperarcontraComponent } from './recuperarcontra/recuperarcontra.component';
import { VerificarComponent } from './verificar/verificar.component';
import { RestablecercontraComponent } from './restablecercontra/restablecercontra.component';
import { PoliticadeprivacidadComponent } from './politicadeprivacidad/politicadeprivacidad.component';
import { DeslindelegalComponent } from './deslindelegal/deslindelegal.component';
import { TerminosycondicionesComponent } from './terminosycondiciones/terminosycondiciones.component';
import { PerfilusuarioComponent } from './perfilusuario/perfilusuario.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { NoticiasEventosComponent } from './noticias-eventos/noticias-eventos.component';
import { Error400Component } from './error400/error400.component';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';
import { CarritoComponent } from './carrito/carrito.component';
import { ContactoComponent } from './contacto/contacto.component';


export const routes: Routes = [
{ path: '', component: InicioComponent, data: { breadcrumb: ''} },
{ path: 'login', component: LoginComponent, data: { breadcrumb: 'login'} },
{ path: 'registro', component: RegistroComponent, data: { breadcrumb: 'Registro'} },
{ path: 'about', component: NosotrosComponent, data: { breadcrumb: 'nosotros'}},
{ path: 'carshop', component: CarritoComponent, data: { breadcrumb: 'nosotros'}},
{ path: 'contact', component: ContactoComponent, data: { breadcrumb: 'contacto'}},

{ path: 'products', component: ProductosComponent, data: { breadcrumb: 'Productos' }}, 
{ path: 'detalle', component: DetalleproductoComponent, data: { breadcrumb: 'Detalle' } },
{ path: 'newsandevents', component: NoticiasEventosComponent, data: { breadcrumb: 'Noticias y Eventos' } },
{ path: 'newsandevents', component: NoticiasEventosComponent, data: { breadcrumb: 'noticias y eventos'} },

{ path: 'politicadeprivacidad', component: PoliticadeprivacidadComponent },
{ path: 'deslindelegal', component: DeslindelegalComponent },
{ path: 'terminosycondiciones', component: TerminosycondicionesComponent },
{ path: 'recuperacion', component: RecuperarcontraComponent },
{ path: 'verificar', component: VerificarComponent },
{ path: 'restablecer', component: RestablecercontraComponent },
{ path: 'verificacion', component: VerificarCodigoComponent },


{ path: 'inicioadmin', component: InicioadminComponent, canActivate: [AuthGuard] },
{ path: 'politicas', component: PoliticasComponent, canActivate: [AuthGuard] },
{ path: 'terminos', component: TerminosComponent, canActivate: [AuthGuard] },
{ path: 'deslinde', component: DeslindeComponent, canActivate: [AuthGuard] },
{ path: 'pempresa', component: PerfilempresaComponent, canActivate: [AuthGuard] },
{ path: 'incidencias', component: IncidenciasComponent, canActivate: [AuthGuard] },
{ path: 'perfil', component: PerfilusuarioComponent, canActivate: [AuthGuard] },


{ path: 'error400', component: Error400Component },
{ path: 'error404', component: Error404Component },
{ path: 'error500',component: Error500Component },
{ path: '**', component: Error404Component },// Cualquier URL incorrecta


];
