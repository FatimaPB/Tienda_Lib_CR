export interface Producto {
    id?: number;
    nombre: string;
    descripcion: string;
    sku: string;
    costo: number;
    porcentaje_ganancia: number;
    precio_calculado: number;
    calificacion_promedio: number;
    total_resenas: number;
    cantidad_stock: number;
    categoria_id: number;
    color_id: number;
    tamano_id: number;
  }