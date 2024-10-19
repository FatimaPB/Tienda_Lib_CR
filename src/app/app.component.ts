import { Component, inject, HostListener } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductComponent } from './components/product/product.component';
import {HttpClientModule} from '@angular/common/http'
import {HttpClient} from '@angular/common/http'
import { Product} from './components/models/product.models';
import { CommonModule } from '@angular/common';
import { HeaderuComponent } from './headeru/headeru.component';
import { HeaderaComponent } from './headera/headera.component';
import { HeaderNormalComponent } from './header-normal/header-normal.component';
import { AuthService } from './auth.service'; // Asegúrate de importar tu servicio de autenticación
import { Router } from '@angular/router';





@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProductComponent,HttpClientModule,CommonModule,RouterLink, HeaderuComponent, HeaderaComponent, HeaderNormalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  token: string | null = null;
  tipoUsuario: string | null = null;

  constructor(private router: Router, private authService: AuthService) {
    // Suscribirse al tipo de usuario
    this.authService.tipoUsuario$.subscribe((tipo) => {
      this.tipoUsuario = tipo; // Actualiza el tipo de usuario cuando cambie
      console.log('Tipo de usuario actualizado:', this.tipoUsuario); // Verificar la actualización
      console.log("Token:", this.token); // Verificar el tipo de usuario
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Usuario autenticado');
      // Recuperar el tipo de usuario del localStorage
      this.tipoUsuario = localStorage.getItem('tipoUsuario'); 
      console.log('Tipo de usuario al iniciar:', this.tipoUsuario); // Mostrar el tipo de usuario al iniciar
    } 
  }


  title = 'Libreria';
  http = inject(HttpClient);
  products: Product[]=[];


  changeTitle() {
    this.title = 'Changed';
  }


 @HostListener('window:scroll', [])
 onWindowScroll() {
   const header = document.querySelector('.main-header');
   if (header) {
     if (window.pageYOffset > 0) {
       header.classList.add('shrink');
     } else {
       header.classList.remove('shrink');
     }
   }
 }

 
}
