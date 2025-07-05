import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
    private apiUrlProductos = 'https://api-libreria.vercel.app/api/productos';
    private apiUrlCatalogo = 'https://api-libreria.vercel.app/api/catalogo';

    constructor(private http: HttpClient) {}
  
    getProductos(): Observable<Producto[]> {
      return this.http.get<Producto[]>(this.apiUrlProductos, { withCredentials: true });
    }
  
    deleteProducto(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrlProductos}/${id}`, { withCredentials: true });
    }
  
    saveProducto(formData: FormData, id?: number): Observable<any> {
      if (id) {
        return this.http.put(`${this.apiUrlProductos}/${id}`, formData, { withCredentials: true });
      } else {
        return this.http.post(this.apiUrlProductos, formData, { withCredentials: true });
      }
    }
  
    addToCatalog(productoId: number): Observable<any> {
      return this.http.post(this.apiUrlCatalogo, { producto_id: productoId }, { withCredentials: true });
    }

    editarVariante(varianteId: number, formData: FormData) {
  return this.http.put(`https://api-libreria.vercel.app/api/variantes/${varianteId}`, formData, { withCredentials: true });
}

  }