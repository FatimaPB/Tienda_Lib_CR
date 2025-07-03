// banner.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner } from '../models/banner.model';  // Importamos el modelo

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private baseUrl = 'https://api-libreria.vercel.app/api/banners'; // Cambia la URL si es necesario

  constructor(private http: HttpClient) {}

  // Obtener todos los banners
  getBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.baseUrl);
  }

  // Obtener un banner por ID
  getBannerById(id: number): Observable<Banner> {
    return this.http.get<Banner>(`${this.baseUrl}/${id}`);
  }

  // Crear un nuevo banner
  createBanner(bannerData: FormData): Observable<Banner> {
    return this.http.post<Banner>(this.baseUrl, bannerData);
  }

  // Actualizar un banner existente
  updateBanner(id: number, bannerData: FormData): Observable<Banner> {
    return this.http.put<Banner>(`${this.baseUrl}/${id}`, bannerData);
  }

  // Eliminar un banner
  deleteBanner(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
