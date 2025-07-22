import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionService {
  private apiUrl = 'https://recomendacioneslibreria.onrender.com/recomendar';

  constructor(private http: HttpClient) {}

  obtenerRecomendaciones(nombresProductos: string[]): Observable<string[]> {
    const body = { productos: nombresProductos };
    return this.http.post<string[]>(this.apiUrl, body);
  }
}
