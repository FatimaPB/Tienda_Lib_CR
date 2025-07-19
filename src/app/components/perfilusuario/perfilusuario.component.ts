import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service'; // Ajusta la ruta según tu estructura de carpetas
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-perfilusuario',
  standalone: true,
  imports: [CommonModule,FormsModule, DialogModule,ConfirmDialogModule, ToastModule,PasswordModule, FloatLabelModule, MatIconModule, AvatarModule, DividerModule, InputTextModule, InputGroupModule],
  templateUrl: './perfilusuario.component.html',
  styleUrl: './perfilusuario.component.css',
  providers: [MessageService,ConfirmationService] 
})
export class PerfilusuarioComponent  implements OnInit {
 private apiUrl = `https://api-libreria.vercel.app/api`;

  perfil: any = null;
  originalPerfil: any = null;

  showForm: boolean = false;
  showPasswordForm: boolean = false;

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  };

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  passwordStrength = '';
  passwordsMatch = true;

  mfaQRCode: string | null = null;

  errorMessage: string | null = null;
  successMessage: string | null = null;
  mensaje: string = '';

  ventas: any[] = [];
  apiUrlventas: string = 'https://api-libreria.vercel.app/api/ventas/historial';
  usuarioId: number | null = null;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router,private messageService: MessageService) {}

  ngOnInit() {
    this.verificarUsuario();
    this.getPerfil();
  }

  getPerfil() {
    this.http.get<any>(`${this.apiUrl}/perfil`, { withCredentials: true }).subscribe({
      next: (response) => {
        this.perfil = response;
        this.originalPerfil = JSON.parse(JSON.stringify(response));
      },
      error: (err) => {
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']).then(() => window.location.reload());
        } else {
          console.error('Error obteniendo perfil:', err);
        }
      }
    });
  }

  verificarUsuario(): void {
    this.http.get<any>('https://api-libreria.vercel.app/api/check-auth', { withCredentials: true }).subscribe({
      next: res => {
        if (res.authenticated) {
          this.usuarioId = res.usuario.id;
          this.obtenerHistorial();
        }
      },
      error: err => {
        console.error('Error al verificar autenticación:', err);
      }
    });
  }

  obtenerHistorial(): void {
    if (!this.usuarioId) return;
    this.http.get<any>(`${this.apiUrlventas}/${this.usuarioId}`, { withCredentials: true }).subscribe({
      next: res => {
        this.ventas = res.ventas;
      },
      error: err => {
        console.error("Error al obtener historial de compras", err);
      }
    });
  }

actualizarPerfil() {
  if (!this.isFormChanged() || !this.isValidPhoneNumber()) return;

  this.http.put<any>(`${this.apiUrl}/edit`, this.perfil, { withCredentials: true }).subscribe({
    next: (response) => {
      this.perfil = response;
      this.originalPerfil = JSON.parse(JSON.stringify(response));
      this.showForm = false;

      this.messageService.add({
        severity: 'success',
        summary: 'Perfil actualizado',
        detail: 'Actualizado correctamente',
        life: 3000
      });
    },
    error: () => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el perfil',
        life: 3000
      });
    }
  });
}


  activarMFA() {
    this.http.post<any>(`${this.apiUrl}/activar-mfa`, { usuarioId: this.perfil.id }).subscribe({
      next: (response) => {
        this.mfaQRCode = response.qr;
        this.getPerfil();
      },
      error: (err) => {
        console.error('Error al activar MFA', err);
        alert('Error al activar MFA');
      }
    });
  }

  cancelarMFA() {
    this.mfaQRCode = null;
  }

  desactivarMFA() {
    this.http.post<any>(`${this.apiUrl}/desactivar-mfa`, { usuarioId: this.perfil.id }, { withCredentials: true }).subscribe({
      next: (response) => {
        this.mensaje = 'MFA desactivado correctamente.';
        this.getPerfil();
      },
      error: (err) => {
        this.mensaje = 'Error al desactivar MFA.';
        console.error('Error al desactivar MFA:', err);
      }
    });
  }

cambiarContrasena() {
  if (this.passwordData.newPassword !== this.passwordData.confirmNewPassword) {
    this.errorMessage = 'Las contraseñas no coinciden';
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: this.errorMessage,
      life: 3000
    });
    return;
  }
  if (!this.isFormValid()) return;

  const data = {
    currentPassword: this.passwordData.currentPassword,
    newPassword: this.passwordData.newPassword
  };

  this.http.put<any>(`${this.apiUrl}/cambiar-contrasena`, data, { withCredentials: true }).subscribe({
    next: () => {
      this.successMessage = 'Contraseña actualizada con éxito';
      this.errorMessage = null;
      this.showPasswordForm = false;
      this.passwordData = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: this.successMessage,
        life: 3000
      });
      setTimeout(() => this.successMessage = null, 3000);
    },
    error: (err) => {
      this.errorMessage = err?.error?.message || 'Error al actualizar la contraseña';
      this.successMessage = null;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.errorMessage? this.errorMessage : 'Error al actualizar la contraseña',
        life: 3000
      });
      setTimeout(() => this.errorMessage = null, 3000);
    }
  });
}


  cancelarEdicion() {
    this.showForm = false;
    this.getPerfil();
  }

  cancelarCambioContrasena() {
    this.showPasswordForm = false;
    this.passwordData = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
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
    if (!/[0-9]/.test(input)) event.preventDefault();
  }

  toggleEditarGuardar() {
  if (!this.showForm) {
    this.showForm = true;
  } else {
    this.actualizarPerfil();
  }
}


onInputChange() {
  if (!this.showForm) this.showForm = true;
}

  isFormChanged(): boolean {
    return JSON.stringify(this.perfil) !== JSON.stringify(this.originalPerfil);
  }

  isValidPhoneNumber(): boolean {
    return /^[0-9]{10}$/.test(this.perfil?.telefono);
  }

  checkPasswordStrength() {
    const password = this.passwordData.newPassword;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    const hasSequence = /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password);

    if (!isLongEnough || !(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) || hasSequence) {
      this.passwordStrength = 'Débil';
    } else {
      this.passwordStrength = 'Fuerte';
    }
  }

  validatePasswordsMatch() {
    this.passwordsMatch = this.passwordData.newPassword === this.passwordData.confirmNewPassword;
  }

  isFormValid(): boolean {
    return this.passwordsMatch && this.passwordStrength === 'Fuerte';
  }

  verDetalle(ventaId: number) {
    this.router.navigate(['/pedido-detalle'], { queryParams: { id: ventaId } });
  }

  mostrarCompras: boolean = false;

}