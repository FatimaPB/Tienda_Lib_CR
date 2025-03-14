import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NewlineToHtmlPipe } from '../pipes/newline-to-html.pipe'; 

@Component({
  selector: 'app-terminosycondiciones',
  standalone: true,
  imports: [FormsModule,CommonModule, NewlineToHtmlPipe],
  templateUrl: './terminosycondiciones.component.html',
  styleUrl: './terminosycondiciones.component.css'
})
export class TerminosycondicionesComponent {
  documentoVigente: any; // Aquí almacenaremos el documento
  mensaje: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerDocumentoVigente();
  }

  obtenerDocumentoVigente(): void {
    this.http.get('https://back-tienda-livid.vercel.app/api/terminos/vigente') // Reemplaza con la URL correcta de tu API
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