import { Component} from '@angular/core';
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
export class CarritoComponent {
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

  finalizarCompra(): void {
    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const paymentData = {
      items: this.cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: this.getTotalPrice()
    };

    this.http.post('https://back-tienda-livid.vercel.app/api/pagar', paymentData).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Error al procesar el pago', err);
    
        // Redirigir a la vista de error si el código de estado es 404 (Página no encontrada)
        if (err.status === 404) {
          this.router.navigate(['/error404']); // Redirigir a la vista de error 404
        }
    
        // Si el error no es 404, simplemente lo dejamos pasar sin mostrar un mensaje
        return throwError(() => new Error('Error en el proceso de pago'));
      })
    ).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('¡Pago exitoso! Gracias por tu compra.');
          this.clearCart();
        } else {
          // Este mensaje solo aparecería si el pago falla, según la respuesta del servidor.
          alert('Hubo un problema con el pago. Intenta nuevamente.');
        }
      }
    });
    
  }
}