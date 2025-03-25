import { Component , OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service'; // Ajusta la ruta según tu estructura de carpetas
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // Importa para gestionar la suscripción


import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-headera',
  standalone: true,
  imports: [RouterLink, CommonModule,
    MatSlideToggleModule, MatIconModule, MatButtonModule, MatToolbarModule, MatMenuModule, MatSidenavModule, MatSidenav,
    RouterModule],
  templateUrl: './headera.component.html',
  styleUrl: './headera.component.css'
})
export class HeaderaComponent  implements OnInit{

  private apiUrl = `https://back-tienda-one.vercel.app/api`;
  originalPerfil: any = null;
  perfil: any = null;




  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  

  ngOnInit() {
    this.checkScreenWidth();
    this.getPerfil();
    this.originalPerfil = { ...this.perfil };

  
  }
  getPerfil() {
    
    this.http.get<any>(`${this.apiUrl}/perfil`,{ withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Perfil recibido:', response);
          this.perfil = response;
        },
        error: (err) => {
          if (err.status === 401) {
            this.authService.logout();
        // Redirigir al login
        this.router.navigate(['/login']).then(() => {
          window.location.reload();  // Recargar la página para limpiar el estado
        });
          } else {
            console.error('Error de autenticación:', err);
          }
        }
      });
  }

  onLogout() {

  
    this.http.post('https://back-tienda-one.vercel.app/api/logout', {}, { withCredentials: true }).subscribe(
    () => {
    window.location.reload();
    this.authService.logout(); 
  
    this.router.navigate(['']); 
  },
  (error) => {
    console.error('Error al cerrar sesión:', error);
  }
);
  }


  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenWidth();
  }
  isCollapsed: boolean = true;
  isMobile: boolean = false;
  sidebarOpened: boolean = false;  // Para controlar visibilidad en móvil
 

  checkScreenWidth() {
    this.isMobile = window.innerWidth < 768;
    // En móvil, el sidebar estará oculto por defecto
    if (this.isMobile) {
      this.sidebarOpened = false;
    } else {
      // En escritorio, mantenemos la lógica de colapso
      this.sidebarOpened = true;
    }
  }

  toggleSidebar() {
    if (this.isMobile) {
      this.sidebarOpened = !this.sidebarOpened;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
    console.log('isMobile:', this.isMobile, 'sidebarOpened:', this.sidebarOpened, 'isCollapsed:', this.isCollapsed);
  }
}