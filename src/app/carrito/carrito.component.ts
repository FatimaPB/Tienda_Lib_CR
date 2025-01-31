import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Importa HttpClient para hacer la solicitud
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';


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
  imports: [CommonModule, RouterLink],
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
    this.simularError400();
  }

  simularError400(): void {
    // Hacemos una solicitud GET que esperamos que devuelva un error 400
    this.http.get('https://back-tienda-livid.vercel.app/api/precios-incorrectos').pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Error al obtener los precios', err);

          
          // Redirigir según el código de estado HTTP
          if (err.status === 400) {
            this.router.navigate(['/error400']); // Solicitud incorrecta (Bad Request)
          }

        return throwError(() => new Error('Error en la solicitud'));
      })
    ).subscribe();
  }
 
  
  
}