import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface MfaNavigationState {
  usuarioId: string;
}


@Component({
  selector: 'app-verificar-mfa',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './verificar-mfa.component.html',
  styleUrl: './verificar-mfa.component.css'
})
export class VerificarMfaComponent implements OnInit {
  usuarioId: string | null = null;
  mfaToken: string = '';
  mensaje: string = '';
  exito: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const usuarioId = history.state.usuarioId;
      if (usuarioId) {
        this.usuarioId = usuarioId;
      }
    });
  }

  onVerify() {
    if (!this.mfaToken) {
      this.mensaje = 'Por favor, ingresa el código MFA.';
      return;
    }

    this.http.post<any>(`https://back-tienda-one.vercel.app/api/verificar-mfa`, { usuarioId: this.usuarioId, tokenMFA: this.mfaToken })
      .subscribe({
        next: (response) => {
          this.mensaje = 'MFA verificado exitosamente!';
          this.exito = true;
          setTimeout(() => {
            this.router.navigate(['/inicioadmin']);
          }, 2000);
        },
        error: (err) => {
          this.mensaje = 'Código MFA incorrecto.';
          this.exito = false;
        }
      });
  }
}



/*
// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
  try {
      const { correo, contrasena, recaptcha } = req.body;

      // ✅ Verificación del reCAPTCHA
      const secretKey = '6LeiqGsqAAAAAN0c3iRx89cvzYXh4lvdejJmZIS1'; // Reemplaza con tu clave secreta
      const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
          params: {
              secret: secretKey,
              response: recaptcha
          }
      });
  
      const { success } = response.data;
      if (!response.data.success) {
          return res.status(400).json({ message: 'Verificación reCAPTCHA fallida' });
      }

      // ✅ Buscar al usuario en MySQL
      db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], async (error, results) => {
          if (error) {
              console.error('Error en la consulta:', error);
              return res.status(500).json({ message: 'Error en el servidor' });
          }

          if (results.length === 0) {
              return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
          }

          const usuario = results[0];

          // ✅ Verificar si la cuenta está bloqueada
          const now = new Date();
          if (usuario.bloqueado && usuario.fecha_bloqueo && new Date(usuario.fecha_bloqueo) > now) {
              return res.status(403).json({ message: 'Cuenta bloqueada. Intenta más tarde.' });
          }

          // ✅ Verificar la contraseña
          const isPasswordValid = await bcryptjs.compare(contrasena, usuario.contrasena);
          if (!isPasswordValid) {
              // Aumentar intentos fallidos
              const nuevosIntentos = usuario.intentos_fallidos + 1;

              // Consultar el límite de intentos (puedes configurarlo en base de datos)
              const maxIntentos = 5; // Puedes hacerlo dinámico desde una tabla de configuración

              if (nuevosIntentos >= maxIntentos) {
                  // Bloquear usuario por 15 minutos
                  const fechaBloqueo = new Date(Date.now() + 15 * 60 * 1000);
                  db.query('UPDATE usuarios SET intentos_fallidos = ?, bloqueado = ?, fecha_bloqueo = ? WHERE correo = ?',
                      [nuevosIntentos, true, fechaBloqueo, correo]);
                  return res.status(403).json({ message: 'Cuenta bloqueada por múltiples intentos fallidos' });
              } else {
                  db.query('UPDATE usuarios SET intentos_fallidos = ? WHERE correo = ?', [nuevosIntentos, correo]);
              }

              return res.status(400).json({ message: 'Credenciales inválidas' });
          }

          // ✅ Reiniciar intentos fallidos si la contraseña es válida
          db.query('UPDATE usuarios SET intentos_fallidos = 0, bloqueado = 0, fecha_bloqueo = NULL WHERE correo = ?', [correo]);

          // ✅ Generar token JWT
          const token = jwt.sign(
              { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
              JWT_SECRET,
              { expiresIn: '1h' }
          );

          // ✅ Registrar actividad
         await registrarActividad(usuario.id, 'Inicio de sesión', req.ip, 'Inicio de sesión exitoso');

          // ✅ Configurar la cookie con el token
          res.cookie('authToken', token, {
             httpOnly: true,          // No accesible desde JavaScript en el navegador
              secure: true,             // Solo se envía en conexiones HTTPS
              sameSite: 'None',       // Solo se envía en solicitudes del mismo sitio
              maxAge: 60 * 60 * 1000    // Expira en 1 hora
          });

          res.json({ message: 'Inicio de sesión exitoso', token, rol: usuario.rol });
      });

  } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      res.status(500).json({ message: 'Error en el servidor' });
  }
});

*/