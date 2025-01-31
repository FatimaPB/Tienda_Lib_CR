import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-noticias-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './noticias-eventos.component.html',
  styleUrl: './noticias-eventos.component.css'
})
export class NoticiasEventosComponent {
}
