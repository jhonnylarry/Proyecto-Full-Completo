// Servicio de Productos
// Deja listos los endpoints para enchufar el backend real (Spring Boot + MySQL)

/**
 * Configuración base. Cambia VITE_API_BASE_URL en tu .env.local cuando tengas el backend.
 * Ej: VITE_API_BASE_URL=https://mi-backend.com/api
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Endpoints placeholders (ajusta los paths cuando existan en tu backend)
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/productos`;

/**
 * Contrato esperado del backend (sugerido):
 * GET /products?search=&category=&page=0&size=12&sort=price,asc
 * -> {
 *      content: [ { id, name, description, price, imageUrl, category } ],
 *      page: 0, size: 12, totalElements: 123, totalPages: 11
 *    }
 */

function buildQuery(params = {}) {
	const {
		search = '',
		category = '',
		page = 0,
		size = 12,
		sort = 'name,asc',
	} = params;

	const qp = new URLSearchParams();
	
	// Enviar búsqueda como 'nombre' (común en Spring Boot)
	if (search) qp.set('nombre', search);
	
	// Enviar categoría como 'categoriaId' si es numérico, o 'categoria' si es texto
	if (category) {
		const catId = parseInt(category, 10);
		if (!isNaN(catId)) {
			qp.set('categoriaId', catId);
		} else {
			qp.set('categoria', category);
		}
	}
	
	// Paginación estándar de Spring
	if (page !== undefined && page !== null) qp.set('page', page);
	if (size !== undefined && size !== null) qp.set('size', size);
	
	// Ordenamiento: convertir "name,asc" -> "nombre,asc" y "price,asc" -> "precio,asc"
	if (sort) {
		const [field, direction] = sort.split(',');
		const fieldMap = {
			'name': 'nombre',
			'price': 'precio',
			'nombre': 'nombre',
			'precio': 'precio'
		};
		const mappedField = fieldMap[field] || field;
		qp.set('sort', `${mappedField},${direction || 'asc'}`);
	}
	
	return qp.toString();
}

/**
 * Obtiene productos paginados desde el backend.
 * Si el backend aún no está disponible, lanza el error y permite al caller aplicar fallback.
 * @param {{search?: string, category?: string, page?: number, size?: number, sort?: string}} params
 * @param {AbortSignal} [signal]
 * @returns {Promise<{content: any[], page: number, size: number, totalElements: number, totalPages: number}>}
 */
export async function getProducts(params = {}, signal) {
	const qs = buildQuery(params);
	const url = qs ? `${PRODUCTS_ENDPOINT}?${qs}` : PRODUCTS_ENDPOINT;

	console.log('🔍 Fetching productos con URL:', url);
	console.log('📦 Parámetros enviados:', params);

	const res = await fetch(url, { signal, headers: { 'Accept': 'application/json' } });
	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`Error al obtener productos (${res.status}): ${text}`);
	}
	const data = await res.json();

	console.log('✅ Respuesta del backend:', data);

	// Normaliza respuesta si el backend devuelve otro shape (mínima validación)
	if (Array.isArray(data)) {
		// Backend devuelve array directo sin paginación
		return {
			content: data,
			page: params.page ?? 0,
			size: params.size ?? 12,
			totalElements: data.length,
			totalPages: Math.ceil(data.length / (params.size ?? 12)),
		};
	}
	if (!data.content) {
		return {
			content: data.items || [],
			page: data.page ?? 0,
			size: data.size ?? (data.items?.length ?? 0),
			totalElements: data.totalElements ?? (data.items?.length ?? 0),
			totalPages: data.totalPages ?? 1,
		};
	}
	return data;
}

/**
 * Obtiene un producto por id.
 * @param {string|number} id
 * @param {AbortSignal} [signal]
 */
export async function getProductById(id, signal) {
	const url = `${PRODUCTS_ENDPOINT}/${id}`;
	const res = await fetch(url, { signal, headers: { 'Accept': 'application/json' } });
	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`Error al obtener producto (${res.status}): ${text}`);
	}
	return res.json();
}

export const __internal = { API_BASE_URL, PRODUCTS_ENDPOINT, buildQuery };

