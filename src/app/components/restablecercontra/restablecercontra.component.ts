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
  isPasswordStrong = false; // Agregado: bandera para la fuerza de la contraseña

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

    // Validar longitud mínima
    if (password.length < 8) {
        this.passwordStrengthMessage = 'Muy débil';
        this.passwordStrengthClass = 'weak';
        this.isPasswordStrong = false;
        return;
    }

    // Validar secuencias (ascendentes o descendentes)
    const hasSequence = /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password);

    if (hasSequence) {
        this.passwordStrengthMessage = 'Muy débil (contiene secuencias)';
        this.passwordStrengthClass = 'weak';
        this.isPasswordStrong = false;
        return;
    }

    // Evaluar la fortaleza de la contraseña
    if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
        this.passwordStrengthMessage = 'Fuerte';
        this.passwordStrengthClass = 'strong';
        this.isPasswordStrong = true;
    } else if ((hasUpperCase || hasLowerCase) && hasNumbers) {
        this.passwordStrengthMessage = 'Mediana';
        this.passwordStrengthClass = 'medium';
        this.isPasswordStrong = false;
    } else {
        this.passwordStrengthMessage = 'Débil';
        this.passwordStrengthClass = 'weak';
        this.isPasswordStrong = false;
    }
}


  validatePasswords() {
    this.passwordMismatch = this.nuevaContrasena !== this.confirmacionContrasena;
  }

  onInputBlur() {
    this.validatePasswords();
  }

  onPasswordReset(form: NgForm) {
    this.validatePasswords(); // Asegura que las contraseñas coinciden antes de continuar

    if (this.passwordMismatch) {
      this.mensaje = 'Las contraseñas no coinciden.';
      this.exito = false;
      return;
    }

    if (!this.isPasswordStrong) {
      this.mensaje = 'La contraseña no es lo suficientemente fuerte.';
      this.exito = false;
      return;
    }

    this.restablecerContrasena();
  }


  constructor(private http: HttpClient, private router: Router) {}

  restablecerContrasena() {
    const correo = localStorage.getItem('correoguardado');
    this.http.post('https://api-libreria.vercel.app/api/restablecer-contrasena', { correo, nuevaContrasena: this.nuevaContrasena })
      .subscribe(response => {
        this.mensaje = 'Contraseña restablecida exitosamente';
        this.exito = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
          localStorage.removeItem('correoguardado');
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