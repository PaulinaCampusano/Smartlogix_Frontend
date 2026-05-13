# SmartLogix Frontend (Tienda Online)

## Descripción
El **Frontend de SmartLogix** es una aplicación web React que proporciona la interfaz de usuario para la tienda online. Permite a los usuarios:

- Navegar y buscar productos
- Agregar productos al carrito de compras
- Gestionar cantidades y validar stock en tiempo real
- Procesar pedidos
- Ver boletas de compra
- Gestionar pedidos existentes (para administradores)

## Tecnologías Utilizadas
- **React 19.2.5** con hooks y componentes funcionales
- **Vite 8.0.10** como bundler y dev server
- **React Router** para navegación SPA
- **Axios** para llamadas HTTP al BFF
- **Bootstrap 5** para estilos CSS
- **ESLint** para linting de código

## Cómo Ejecutar

### Prerrequisitos
- Node.js instalado (versión 18+ recomendada)
- npm o yarn instalado
- Todos los microservicios backend ejecutándose

### Pasos para Ejecutar
1. Navega al directorio del proyecto:
   ```bash
   cd Smartlogix_Frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Ejecuta la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```

4. La aplicación estará disponible en: `http://localhost:3000`

### Build para Producción
```bash
npm run build
```

## Estructura del Proyecto
```
src/
├── components/     # Componentes reutilizables (Navbar)
├── pages/          # Páginas principales
│   ├── Catalogo.jsx     # Tienda y carrito
│   ├── GestionPedidos.jsx # Gestión de pedidos
│   ├── Boleta.jsx       # Vista de boleta
│   └── Gestion.jsx      # Gestión de productos
├── services/       # Servicios API
│   └── api.js      # Configuración Axios y endpoints
├── assets/         # Recursos estáticos
└── main.jsx        # Punto de entrada
```

## Funcionalidades Principales
### Tienda (Catálogo)
- Visualización de productos con stock disponible
- Selector de cantidad con validación de stock
- Carrito de compras con totales en tiempo real
- Validación de stock antes de agregar al carrito

### Gestión de Pedidos
- Lista de pedidos con totales calculados
- Edición de pedidos existentes
- Ajuste de stock automático al modificar pedidos
- Estados de pedido (Aprobado, Rechazado, etc.)

### Boleta de Compra
- Vista detallada de pedidos completados
- Cálculo automático de totales
- Información enriquecida de productos

## Configuración
- **Base URL del BFF**: `http://localhost:8088/api/bff`
- **Dependencias Backend**:
  - BFF ejecutándose en puerto 8088
  - MS-Inventario en 8085
  - MS-Pedidos en 8086

## Arquitectura
Aplicación SPA (Single Page Application) que consume APIs REST a través del BFF. Utiliza React Hooks para gestión de estado y efectos secundarios. Implementa validaciones del lado cliente para mejorar la experiencia de usuario.
