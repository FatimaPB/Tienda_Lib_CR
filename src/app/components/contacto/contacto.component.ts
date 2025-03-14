import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { trigger, style, transition, animate } from '@angular/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule,MatButtonModule,MatCardModule,MatIconModule,MatChipsModule,MatFormFieldModule,
    MatProgressBarModule,MatTooltipModule,MatInputModule
  ],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
  animations: [
      trigger('fadeIn', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ])
    ]
})
export class ContactoComponent {

  cards = [
    { icon: 'book', title: 'Gran colección', description: 'Explora nuestra variedad de libros religiosos.' },
    { icon: 'local_shipping', title: 'Envío rápido', description: 'Recibe tus pedidos sin demoras en casa.' },
    { icon: 'verified', title: 'Calidad garantizada', description: 'Productos 100% originales y certificados.' }
  ];

  productos = [
    { nombre: 'Biblia Católica', precio: 299.99, img: '../../assets/img/biblias.png' },
    { nombre: 'Rosario de Madera', precio: 149.99, img: '../../assets/img/biblias.png' },
    { nombre: 'Crucifijo Dorado', precio: 199.99, img: '../../assets/img/biblias.png' }
  ];

  categorias = ['Biblias', 'Crucifijos', 'Santos', 'Velas', 'Rosarios'];

}
