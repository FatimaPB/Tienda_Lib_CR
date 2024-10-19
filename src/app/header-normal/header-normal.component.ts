import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-normal',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-normal.component.html',
  styleUrl: './header-normal.component.css'
})
export class HeaderNormalComponent {
  menuActive = false; // Variable para controlar el estado del menú

  toggleMenu() {
    this.menuActive = !this.menuActive; // Alterna el estado del menú
  }

  closeMenu() {
    this.menuActive = false; // Cierra el menú cuando se selecciona una opción
  }

}
