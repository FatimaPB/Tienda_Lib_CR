import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insignia } from '../models/insignia.model';

@Injectable({
  providedIn: 'root'
})
export class InsigniaService {
  private apiUrl = 'https://api-libreria.vercel.app/api/insignias';

  constructor(private http: HttpClient) {}

  obtenerTodas(): Observable<Insignia[]> {
    return this.http.get<Insignia[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Insignia> {
    return this.http.get<Insignia>(`${this.apiUrl}/${id}`);
  }

  crear(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  actualizar(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
