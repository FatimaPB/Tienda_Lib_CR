import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restablecercontra',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './restablecercontra.component.html',
  styleUrl: './restablecercontra.component.css'
})
export class RestablecercontraComponent {
  nuevaContrasena = ''; // Agregado: propiedad para capturar nueva contraseña
  confirmacionContrasena = ''; // Agregado: propiedad para capturar confirmación de contraseña
  passwordStrengthMessage = '';
  passwordStrengthClass = '';
  passwordMismatch = false;
  isPasswordVisible = false;
  isConfirmPasswordVisible = false;
  mensaje = '';
  exito: boolean = false;

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  checkPasswordStrength(password: string) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 8) {
      this.passwordStrengthMessage = 'Muy débil';
      this.passwordStrengthClass = 'weak';
    } else if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
      this.passwordStrengthMessage = 'Fuerte';
      this.passwordStrengthClass = 'strong';
    } else if ((hasUpperCase || hasLowerCase) && hasNumbers) {
      this.passwordStrengthMessage = 'Mediana';
      this.passwordStrengthClass = 'medium';
    } else {
      this.passwordStrengthMessage = 'Débil';
      this.passwordStrengthClass = 'weak';
    }
  }

  onPasswordReset(form: NgForm) {
    const { nuevaContrasena, confirmacionContrasena } = form.value;

    // Verificar si las contraseñas coinciden
    this.passwordMismatch = nuevaContrasena !== confirmacionContrasena;

    if (this.passwordMismatch) {
      this.mensaje = 'Las contraseñas no coinciden.';
      return;
    }

    this.restablecerContrasena();
  }

  constructor(private http: HttpClient, private router: Router) {}

  restablecerContrasena() {
    const correo = localStorage.getItem('correores');
    this.http.post('https://back-tienda-three.vercel.app/api/restablecer-contrasena', { correo, nuevaContrasena: this.nuevaContrasena })
      .subscribe(response => {
        this.mensaje = 'Contraseña restablecida exitosamente';
        this.exito = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      }, error => {
        this.mensaje = 'Error al restablecer contraseña';
        this.exito = false;
        setTimeout(() => {
          this.mensaje = '';
        }, 3000);
      });
    }

  
}