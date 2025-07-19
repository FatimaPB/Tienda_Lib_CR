export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  sku: string;
  precio_compra?:number;
  precio_venta?: number;         // Para productos sin variantes
  cantidad_stock?: number;       // Para productos sin variantes
    // Agrega esta propiedad:
  tieneVariantes?: boolean;
  nombre_categoria: string;
  usuario_nombre: string;
  creado_en: Date;
  }