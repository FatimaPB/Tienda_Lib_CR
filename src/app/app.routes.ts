import { Routes} from '@angular/router';
import { AuthGuard } from './auth.guard'; // Asegúrate de que la ruta sea correcta
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ProductosComponent } from './components/productos/productos.component';
import { DetalleproductoComponent } from './components/detalleproducto/detalleproducto.component';
import { InicioadminComponent } from './components/inicioadmin/inicioadmin.component';
import { VerificarCodigoComponent } from './components/verificar-codigo/verificar-codigo.component';
import { PoliticasComponent } from './components/politicas/politicas.component';
import { TerminosComponent } from './components/terminos/terminos.component';
import { DeslindeComponent } from './components/deslinde/deslinde.component';
import { PerfilempresaComponent } from './components/perfilempresa/perfilempresa.component';
import { IncidenciasComponent } from './components/incidencias/incidencias.component';
import { RecuperarcontraComponent } from './components/recuperarcontra/recuperarcontra.component';
import { VerificarComponent } from './components/verificar/verificar.component';
import { RestablecercontraComponent } from './components/restablecercontra/restablecercontra.component';
import { PoliticadeprivacidadComponent } from './components/politicadeprivacidad/politicadeprivacidad.component';
import { DeslindelegalComponent } from './components/deslindelegal/deslindelegal.component';
import { TerminosycondicionesComponent } from './components/terminosycondiciones/terminosycondiciones.component';
import { PerfilusuarioComponent } from './components/perfilusuario/perfilusuario.component';
import { NosotrosComponent } from './components/nosotros/nosotros.component';
import { NoticiasEventosComponent } from './components/noticias-eventos/noticias-eventos.component';
import { Error400Component } from './components/error400/error400.component';
import { Error404Component } from './components/error404/error404.component';
import { Error500Component } from './components/error500/error500.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { AdminproductosComponent } from './components/adminproductos/adminproductos.component';
import { BannerComponent } from './components/banner/banner.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { CatalogoproductosComponent } from './components/catalogoproductos/catalogoproductos.component';
import { ColoresComponent } from './components/colores/colores.component';
import { TamanosComponent } from './components/tamanos/tamanos.component';
import { ProveedorComponent } from './components/proveedor/proveedor.component';
import { ComprasComponent } from './components/compras/compras.component';
import { PedidodetalleComponent } from './components/pedidodetalle/pedidodetalle.component';
import { PenelrepartidorComponent } from './components/penelrepartidor/penelrepartidor.component';
import { PreguntasComponent } from './components/preguntas/preguntas.component';
import { OracionesComponent } from './components/oraciones/oraciones.component';


export const routes: Routes = [
{ path: '', component: InicioComponent},
{ path: 'login', component: LoginComponent, data: { breadcrumb: 'login'} },
{ path: 'registro', component: RegistroComponent, data: { breadcrumb: 'Registro'} },
{ path: 'about', component: NosotrosComponent, data: { breadcrumb: 'about'}},
{ path: 'carshop', component: CarritoComponent, data: { breadcrumb: 'carshop'}},
{ path: 'contact', component: ContactoComponent, data: { breadcrumb: 'contact'}},

{ path: 'products/:nombreCategoria', component: ProductosComponent, data: { breadcrumb: 'nombreCategoria' }}, 
{ path: 'detalle/:id/:varianteId', component: DetalleproductoComponent, data: { breadcrumb: 'id' } },
{ path: 'newsandevents', component: NoticiasEventosComponent, data: { breadcrumb: 'Noticias y Eventos' } },
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
{ path: 'incidencias', component: IncidenciasComponent, canActivate: [AuthGuard]},
{ path: 'perfil', component: PerfilusuarioComponent,data: { breadcrumb: 'Perfil' }, canActivate: [AuthGuard] },
{ path: 'categorias', component: CategoriasComponent, canActivate: [AuthGuard] },
{ path: 'admproduts', component: AdminproductosComponent, canActivate: [AuthGuard] },
{ path: 'banners', component: BannerComponent, canActivate: [AuthGuard] },
{ path: 'ventas', component: VentasComponent, canActivate: [AuthGuard] },
{ path: 'ventas/:id', component: VentasComponent, canActivate: [AuthGuard] },
{ path: 'admcat', component: CatalogoproductosComponent, canActivate: [AuthGuard] },
{ path: 'colores', component: ColoresComponent, canActivate: [AuthGuard] },
{ path: 'tamaños', component: TamanosComponent, canActivate: [AuthGuard] },
{ path: 'proveedor', component: ProveedorComponent, canActivate: [AuthGuard] },
{ path: 'compras', component: ComprasComponent, canActivate: [AuthGuard] },
{ path: 'pedido-detalle', component: PedidodetalleComponent, canActivate: [AuthGuard] },
{ path: 'repartidor', component: PenelrepartidorComponent, canActivate: [AuthGuard] },
{ path: 'preguntas', component: PreguntasComponent, canActivate: [AuthGuard] },
{ path: 'oraciones', component: OracionesComponent, canActivate: [AuthGuard] },

{ path: 'error400', component: Error400Component },
{ path: 'error404', component: Error404Component },
{ path: 'error500',component: Error500Component },
{ path: '**', component: Error404Component },// Cualquier URL incorrecta


];
