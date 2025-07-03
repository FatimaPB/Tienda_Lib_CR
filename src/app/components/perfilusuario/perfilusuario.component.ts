import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service'; // Ajusta la ruta según tu estructura de carpetas
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfilusuario',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './perfilusuario.component.html',
  styleUrl: './perfilusuario.component.css'
})
export class PerfilusuarioComponent  implements OnInit {
  private apiUrl = `https://api-libreria.vercel.app/api`;
  originalPerfil: any = null; // Nueva propiedad para guardar el perfil original
  perfil: any = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  showForm: boolean = false; // Controla la visibilidad del formulario
  showPasswordForm: boolean = false; // Controla la visibilidad del formulario de cambio de contraseña
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  }; // Datos para el cambio de contraseña
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  passwordStrength = '';
passwordsMatch = true;
mensaje='';

mfaQRCode: string | null = null; // Variable para almacenar el QR de MFA

  constructor(private authService: AuthService,private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.verificarUsuario();
    this.getPerfil();
    this.originalPerfil = { ...this.perfil };
  }

  // Método para activar MFA
  activarMFA() {
    this.http.post<any>('https://api-libreria.vercel.app/api/activar-mfa', { usuarioId: this.perfil.id })
        .subscribe(
            (response) => {
                this.mfaQRCode = response.qr; // El QR se pasa como base64
                console.log('Escanea el código QR con tu aplicación de autenticación');
                this.getPerfil();
            },
            (error) => {
                console.error('Error al activar MFA', error);
                alert('Error al activar MFA');
            }
        );
}

// Método para cancelar la activación de MFA
cancelarMFA() {
    this.mfaQRCode = null;
}

desactivarMFA(){
  this.http.post<any>(`${this.apiUrl}/desactivar-mfa`, { usuarioId: this.perfil.id }, { withCredentials: true })
  .subscribe({
    next: (response) => {
      console.log(response.message);
      this.mensaje = 'MFA desactivado correctamente.';
      this.getPerfil();
    },
    error: (err) => {
      console.error('Error al desactivar MFA:', err);
      this.mensaje = 'Error al desactivar MFA.';
    }
  }
  )};




  getPerfil() {
    
    this.http.get<any>(`${this.apiUrl}/perfil`,{ withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Perfil recibido:', response);
          this.perfil = response;
        },
        error: (err) => {
          if (err.status === 401) {
            this.authService.logout();
        // Redirigir al login
        this.router.navigate(['/login']).then(() => {
          window.location.reload();  // Recargar la página para limpiar el estado
        });
          } else {
            console.error('Error de autenticación:', err);
          }
        }
      });
  }
  actualizarPerfil() {
    // Enviar los datos modificados al servidor
    this.http.put<any>(`${this.apiUrl}/edit`, this.perfil,{ withCredentials: true })
      .subscribe({
        next: (response) => {
          this.successMessage = 'Perfil actualizado con éxito';
          this.errorMessage = null;
          this.showForm = false; // Ocultar el formulario después de actualizar
          this.perfil = response; // Actualizar el perfil con los datos nuevos

          // Hacer que el mensaje de éxito desaparezca después de 3 segundos
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = 'Error al actualizar el perfil';
          this.successMessage = null;
        }
      });
  }

  checkPasswordStrength() {
    const password = this.passwordData.newPassword;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

     // Validar si tiene secuencias (ascendentes o descendentes)
     const hasSequence = /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password);

     // Determinar la fuerza de la contraseña
     if (!isLongEnough || !(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) || hasSequence) {
         this.passwordStrength = 'Débil';
     } else if (isLongEnough && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && !hasSequence) {
         this.passwordStrength = 'Fuerte';
     } else {
         this.passwordStrength = 'Media';
     }
}




validatePasswordsMatch() {
  this.passwordsMatch = this.passwordData.newPassword === this.passwordData.confirmNewPassword;
}
isFormValid(): boolean {
  return (
      this.passwordsMatch &&
      this.passwordStrength === 'Fuerte'
  );
}

  cambiarContrasena() {
    if (this.passwordData.newPassword !== this.passwordData.confirmNewPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    const data = {
      currentPassword: this.passwordData.currentPassword,
      newPassword: this.passwordData.newPassword
    };

    this.http.put<any>(`${this.apiUrl}/cambiar-contrasena`, data, {withCredentials:true})
      .subscribe({
        next: () => {
          this.successMessage = 'Contraseña actualizada con éxito';
          this.errorMessage = null;
          this.showPasswordForm = false;
          this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        };
        this.showPasswordForm = false;

          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (err) => {
  // Si el servidor envía un mensaje de error, lo mostramos
  if (err?.error?.message) {
    this.errorMessage = `${err.error.message}`;
} else {
    // Mensaje genérico si no hay detalles del servidor
    this.errorMessage = 'Error al actualizar la contraseña';
}
this.successMessage = null;
setTimeout(() => {
  this.errorMessage = null;
}, 3000);
        }
      });
  }

  cancelarEdicion() {
    this.showForm = false;
    this.getPerfil();
  }

  cancelarCambioContrasena() {
    this.showPasswordForm = false;

    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    };
  }

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  
  preventLetters(event: KeyboardEvent): void {
    const input = String.fromCharCode(event.charCode);
    if (!/[0-9]/.test(input)) {
      event.preventDefault();
    }
  }
 // Función para verificar si los datos han cambiado
 isFormChanged(): boolean {
  return JSON.stringify(this.perfil) !== JSON.stringify(this.originalPerfil);
}

// Validar que el teléfono sea exactamente 10 dígitos
isValidPhoneNumber(): boolean {
  // Verifica si el teléfono tiene exactamente 10 caracteres y son números
  return /^[0-9]{10}$/.test(this.perfil.telefono);
}

  
ventas: any[] = [];
  apiUrlventas: string = 'https://api-libreria.vercel.app/api/ventas/historial';
  usuarioId: number | null = null;



  verificarUsuario(): void {
    this.http.get<any>('https://api-libreria.vercel.app/api/check-auth',{withCredentials:true}).subscribe(
      res => {
        if (res.authenticated) {
          this.usuarioId = res.usuario.id;
          this.obtenerHistorial();
        }
      },
      err => {
        console.error('Error al verificar autenticación:', err);
      }
    );
  }

  obtenerHistorial(): void {
    if (!this.usuarioId) return;

    this.http.get<any>(`${this.apiUrlventas}/${this.usuarioId}`, {withCredentials:true}).subscribe(
      res => {
        this.ventas = res.ventas;
      },
      err => {
        console.error("Error al obtener el historial de compras", err);
      }
    );
  }

  verDetalle(ventaId: number) {
  this.router.navigate(['/pedido-detalle'], { queryParams: { id: ventaId } });
}
}

