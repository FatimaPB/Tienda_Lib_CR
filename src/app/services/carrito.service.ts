import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'https://api-libreria.vercel.app/api/carrito'; // 🔥 Ajuste en la URL base

  constructor(private http: HttpClient) { }

  // Obtener el carrito del usuario autenticado
  getCarrito(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true }); // ✅ Ruta corregida
  }

  // Agregar un producto al carrito
  agregarAlCarrito(producto_id: number, variante_id: number | null = null, cantidad: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregar`, { producto_id, variante_id, cantidad }, { withCredentials: true });
  }
  // Eliminar un producto del carrito
  eliminarProducto(producto_id: number, variante_id: number | null = null): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/eliminar`, {
      body: { producto_id, variante_id },
      withCredentials: true
    });
  }

  // Vaciar el carrito
  limpiarCarrito(): Observable<any> {
    return this.http.post(`${this.apiUrl}/limpiar`, {}, { withCredentials: true }); // ✅ Ruta corregida
  }
}
