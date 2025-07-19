import { Component } from '@angular/core';
import { HeaderaComponent } from '../../components/headera/headera.component';
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [HeaderaComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
