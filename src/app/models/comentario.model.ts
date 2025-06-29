export interface Comentario {
  id?: number;
  usuario_id: number;
  producto_id: number;
  variante_id?: number | null;
  comentario: string;
  calificacion: number;
  fecha?: string;
  nombre_usuario?: string;
}