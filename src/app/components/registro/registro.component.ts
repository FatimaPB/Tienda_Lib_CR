import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgForm, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { sha1 } from 'crypto-hash'; // Asegúrate de tener esto instalado

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  successMessage: string | null = null;
  errorMessage: string | null = null;
  passwordStrengthMessage = '';
  passwordStrengthClass = '';
  passwordMismatch = false; // Nuevo estado para controlar si las contraseñas coinciden
  isPasswordVisible = false; // Para la contraseña
  isConfirmPasswordVisible = false; // Para confirmar la contraseña

  constructor(private http: HttpClient, private router: Router) {}

  async checkPasswordStrength(password: string) {
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

    // Verificar si la contraseña ha sido comprometida
    const compromised = await this.checkPasswordPwned(password);
    if (compromised) {
      this.passwordStrengthMessage = 'Esta contraseña ha sido comprometida. Por favor, elige otra.';
      this.passwordStrengthClass = 'weak';
    }
  }

  async checkPasswordPwned(password: string): Promise<boolean> {
    const hashedPassword = await this.hashPassword(password);
    const prefix = hashedPassword.substring(0, 5);
    const suffix = hashedPassword.substring(5).toUpperCase();
  
    try {
      const response = await this.http.get(`https://api.pwnedpasswords.com/range/${prefix}`, { responseType: 'text' }).toPromise();
  
      if (response) {
        const compromisedPasswords = response.split('\n').map(line => line.split(':')[0]);
        return compromisedPasswords.includes(suffix);
      } else {
        console.error('La respuesta de la API es indefinida');
        return false; 
      }
    } catch (error) {
      console.error('Error al verificar la contraseña:', error);
      return false; 
    }
  }

  async hashPassword(password: string): Promise<string> {
    return sha1(password); 
  }

  async onRegister(registerForm: NgForm) {
    const password = registerForm.value.password;
    const confirmPassword = registerForm.value.confirmPassword; // Obtener la contraseña confirmada

    // Comprobar si las contraseñas coinciden
    this.passwordMismatch = password !== confirmPassword;
    if (this.passwordMismatch) {
      return; // Si no coinciden, salimos de la función
    }

    // Esperar a que se verifique la fortaleza de la contraseña
    await this.checkPasswordStrength(password);

    // Verificar si la contraseña es fuerte
    if (this.passwordStrengthClass !== 'strong') {
      return;
    }

    // Verificar si la contraseña ha sido comprometida
    const compromised = await this.checkPasswordPwned(password);
    if (compromised) {
      this.errorMessage = 'La contraseña ha sido comprometida. Por favor, elige otra.';
      return;
    }

    const registerData = {
      nombre: registerForm.value.name,
      correo: registerForm.value.email,
      telefono: registerForm.value.phone,
      contrasena: registerForm.value.password
    };
  
    this.http.post<any>('https://tienda-lib-cr.vercel.app/api/usuarios', registerData)
      .subscribe(
        (response) => {
          console.log('Registro exitoso', response);
          this.successMessage = 'Registro exitoso!';
          this.errorMessage = null;

          localStorage.setItem('correoRegistro', registerData.correo);
  
          setTimeout(() => {
            this.router.navigate(['/verificacion']);
          }, 3000);
        },
        (error) => {
          console.error('Error al registrar', error);
  
          // Manejo de error específico del backend
          if (error.status === 400 && error.error?.message === 'El correo ya está registrado') {
            this.errorMessage = 'El correo ya está registrado. Por favor, utiliza otro correo.';
          } else {
            this.errorMessage = 'Error en el registro. Inténtalo de nuevo.';
          }
  
          this.successMessage = null;
  
          setTimeout(() => {
            this.errorMessage = null;
          }, 3000);
        }
      );
  
  }

  preventLetters(event: KeyboardEvent): void {
    const input = String.fromCharCode(event.charCode);
    if (!/[0-9]/.test(input)) {
      event.preventDefault();
    }
  }

  onNameInput(event: Event): void {
    const input = (event.target as HTMLInputElement);
    const regex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*$/;

    if (!regex.test(input.value)) {
      // Si el valor ingresado no coincide con el patrón, elimina el último carácter
      input.value = input.value.slice(0, -1);
    }
  }

  // Métodos para mostrar/ocultar contraseñas
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  
  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  
}
