import { Injectable } from '@angular/core';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private messaging: Messaging;

  constructor() {
    const app = initializeApp(environment.firebase);
    this.messaging = getMessaging(app);
  }

  requestPermission(): Promise<string> {
    return new Promise((resolve, reject) => {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          // Reemplaza 'TU_VAPID_PUBLIC_KEY' con la clave pública VAPID que obtuviste en Firebase
          getToken(this.messaging, { vapidKey: environment.vapidKey }).then(token => {
            if (token) {
              console.log('Token de notificación:', token);
              resolve(token);
            } else {
              reject('No se pudo obtener el token');
            }
          }).catch(err => reject(err));
        } else {
          reject('Permiso denegado para notificaciones');
        }
      });
    });
  }

  receiveMessage(callback: (payload: any) => void) {
    onMessage(this.messaging, (payload) => {
      console.log('Mensaje recibido en primer plano:', payload);
      callback(payload);
    });
  }
}
