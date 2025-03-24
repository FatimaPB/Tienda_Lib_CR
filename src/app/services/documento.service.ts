import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Documento } from '../models/documento.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentoService {
  private apiUrl = 'https://tienda-lib-cr.vercel.app/api';

  constructor(private http: HttpClient) {}

  // Se espera que 'ruta' sea 'politicas' para el endpoint /api/politicas/historial
  obtenerDocumentos(ruta: string): Observable<Documento[]> {
    return this.http.get<Documento[]>(`${this.apiUrl}/${ruta}/historial`);
  }

  obtenerDocumentoVigente(ruta: string): Observable<Documento> {
    return this.http.get<Documento>(`${this.apiUrl}/${ruta}/vigente`);
  }

  // Al crear, se arma la URL: /api/politicas/:tipo, donde :tipo es el tipo del documento (por ejemplo, 'politica')
  crearDocumento(ruta: string, documento: Documento): Observable<any> {
    return this.http.post(`${this.apiUrl}/${ruta}/${documento.tipo}`, documento);
  }

  actualizarDocumento(ruta: string, id: number, documento: Documento): Observable<any> {
    return this.http.post(`${this.apiUrl}/${ruta}/${documento.tipo}/${id}/version`, documento);
  }

  eliminarDocumento(ruta: string, id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${ruta}/${id}`);
  }
}
