import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Importa HttpClient para hacer la solicitud
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Product {
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
}


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit  {
  cartItems: Product[] = [
    { name: 'Producto 1', description: 'Descripción del producto 1', price: 50, quantity: 2, image: 'assets/img/Libreria_Logo.jpg' },
    { name: 'Producto 2', description: 'Descripción del producto 2', price: 30, quantity: 1, image: 'assets/img/Libreria_Logo.jpg' }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  getTotalPrice(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  removeItem(item: Product): void {
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
  }

  clearCart(): void {
    this.cartItems = [];
  }

  ngOnInit(): void {
    this.obtenerPrecios(); 
  }
  
  obtenerPrecios(): void {
    // Realizar la solicitud GET a una URL inexistente para simular un error 404
    this.http.get<any>('https://back-tienda-livid.vercel.app/api/precios-inexistentes').pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Error al obtener los precios', err);
        
        // Redirigir según el código de estado HTTP
        if (err.status === 400) {
          this.router.navigate(['/error400']); // Solicitud incorrecta (Bad Request)
        } else if (err.status === 404) {
          this.router.navigate(['/error404']); // Página no encontrada (Not Found)
        } else if (err.status === 500) {
          this.router.navigate(['/error500']); // Error del servidor (Internal Server Error)
        } else {
          this.router.navigate(['/error500']); // Otros errores, los tratamos como error 500
        }
        
        return throwError(() => new Error('Error en la solicitud'));
      })
    ).subscribe({
      next: (response) => {
        // Si la solicitud es exitosa, se manejaría aquí, pero como estamos simulando el error 404 no se alcanzará
        console.log('Precios obtenidos:', response);
      }
    });
  }
  
}