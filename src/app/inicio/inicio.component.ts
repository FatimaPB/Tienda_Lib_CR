import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {


}
