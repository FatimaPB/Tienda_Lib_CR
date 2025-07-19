export interface NoticiaEvento {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  tipo: 'noticia' | 'evento';
  fecha_evento: string | null;
  fecha_publicacion: string;
}
