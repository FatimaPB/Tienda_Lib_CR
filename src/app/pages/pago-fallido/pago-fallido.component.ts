import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pago-fallido',
  standalone: true,
  imports: [CardModule,ButtonModule,RouterLink],
  templateUrl: './pago-fallido.component.html',
  styleUrl: './pago-fallido.component.css'
})
export class PagoFallidoComponent {

}
