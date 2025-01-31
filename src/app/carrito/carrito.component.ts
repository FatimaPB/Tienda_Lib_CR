import { Component} from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'; // Importa HttpClient para hacer la solicitud
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient) {}

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

        // Redirigir según el código de estado HTTP
        if (err.status === 400) {
          alert('Solicitud incorrecta. Verifica los datos y vuelve a intentarlo.');
        } else if (err.status === 404) {
          alert('Página no encontrada. Intenta nuevamente más tarde.');
        } else if (err.status === 500) {
          alert('Error en el servidor. Por favor, intenta más tarde.');
        } else {
          alert('Hubo un problema con el pago. Intenta nuevamente más tarde.');
        }

        return throwError(() => new Error('Error en el proceso de pago'));
      })
    ).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('¡Pago exitoso! Gracias por tu compra.');
          this.clearCart();
        } else {
          alert('Hubo un problema con el pago. Intenta nuevamente.');
        }
      }
    });
  }
}