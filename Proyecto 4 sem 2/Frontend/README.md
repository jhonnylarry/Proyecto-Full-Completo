# Frontend Tienda (React + Vite)

Este frontend replica la lógica de la versión antigua (HTML/JS plano) y agrega navegación con React Router. Se añadió la vista de Productos lista para conectarse a un backend Spring Boot + MySQL.

## Configuración de API

Define la URL base de tu API en un archivo `.env.local` en la raíz del proyecto:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

Endpoints placeholders usados en el código (ajústalos cuando tu backend esté listo):

- GET `${VITE_API_BASE_URL}/products?search=&category=&page=0&size=12&sort=name,asc`
- GET `${VITE_API_BASE_URL}/products/{id}`

Formato de respuesta recomendado para el listado paginado:

```
{
	"content": [
		{ "id": 1, "name": "...", "description": "...", "price": 0, "imageUrl": "...", "category": "..." }
	],
	"page": 0,
	"size": 12,
	"totalElements": 100,
	"totalPages": 9
}
```

Mientras no exista un backend, la vista de productos usa un fallback local `public/data/productos.json` para mostrar datos de ejemplo.

## Rutas principales

- `/` Home
- `/productos` Productos (nuevo)
- `/blogs` Blog
- `/nosotros` Nosotros
- `/contacto` Contacto
- `/registrarse` Registro
- `/iniciarSesion` Inicio de sesión

## Desarrollo

1. Instala dependencias:

```
npm install
```

2. Ejecuta en local:

```
npm run dev
```

3. Build de producción:

```
npm run build
```

## Notas

- El servicio `src/services/productServices.js` centraliza las llamadas al backend y normaliza respuestas.
- La vista `src/pages/tienda/Productos.jsx` implementa filtros básicos, paginación y estados de carga/error.
- Estilos mínimos agregados en `src/EstiloT.css` bajo el bloque "Vista Productos".
