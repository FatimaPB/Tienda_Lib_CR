import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewlineToHtmlPipe } from '../../components/pipes/newline-to-html.pipe'; 


@Component({
  selector: 'app-politicadeprivacidad',
  standalone: true,
  imports: [FormsModule, CommonModule, NewlineToHtmlPipe],
  templateUrl: './politicadeprivacidad.component.html',
  styleUrl: './politicadeprivacidad.component.css'
})
export class PoliticadeprivacidadComponent {
  documentoVigente: any; // Aquí almacenaremos el documento
  mensaje: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerDocumentoVigente();
  }

  obtenerDocumentoVigente(): void {
    this.http.get('https://api-libreria.vercel.app/api/politicas/vigente') // Reemplaza con la URL correcta de tu API
      .subscribe(
        (data) => {
          this.documentoVigente = data;
        },
        (error) => {
          this.mensaje = 'Error al obtener el documento: ' + error.message;
        }
      );
  }
}