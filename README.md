# 🛍️ Proyecto E-commerce Full Stack

Sistema completo de comercio electrónico desarrollado con Spring Boot (Backend) y React + Vite (Frontend), que incluye gestión de productos, usuarios, categorías y un panel de administración.

---

## 📋 Descripción del Proyecto

Este proyecto es una aplicación web full-stack que simula una tienda en línea con funcionalidades completas de administración y cliente. Permite a los usuarios navegar productos por categorías, visualizar detalles, y a los administradores gestionar el catálogo completo con carga de imágenes.

### **Características principales:**

✅ **Backend REST API** desarrollada con Spring Boot 3.5.6
✅ **Frontend moderno** con React 19 y Vite 7
✅ **Gestión de productos** con carga de imágenes (multipart/form-data)
✅ **Sistema de categorías** y filtrado de productos
✅ **Panel de administración** para CRUD completo
✅ **Autenticación de usuarios** con roles (Admin/Usuario)
✅ **Base de datos MySQL** con relaciones normalizadas
✅ **Testing automatizado** con JUnit y H2
✅ **Gestión de regiones y comunas** (datos de Chile)

---

## 🛠️ Tecnologías Utilizadas

### **Backend:**
- ![Java](https://img.shields.io/badge/Java-24-orange?logo=openjdk) **Java 24**
- ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.6-green?logo=spring) **Spring Boot 3.5.6**
- ![Spring Data JPA](https://img.shields.io/badge/Spring%20Data%20JPA-3.5.6-green?logo=spring) **Spring Data JPA**
- ![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?logo=mysql) **MySQL 8.0**
- ![Maven](https://img.shields.io/badge/Maven-4.0-red?logo=apachemaven) **Maven**
- ![Lombok](https://img.shields.io/badge/Lombok-Latest-red) **Lombok**
- ![H2](https://img.shields.io/badge/H2-Test-blue) **H2 Database** (Testing)

### **Frontend:**
- ![React](https://img.shields.io/badge/React-19.1.1-blue?logo=react) **React 19.1.1**
- ![Vite](https://img.shields.io/badge/Vite-7.1.7-purple?logo=vite) **Vite 7.1.7**
- ![React Router](https://img.shields.io/badge/React%20Router-7.9.4-red?logo=reactrouter) **React Router DOM 7.9.4**
- ![ESLint](https://img.shields.io/badge/ESLint-9.36-blue?logo=eslint) **ESLint 9.36**
- **CSS3** para estilos personalizados

### **Base de Datos:**
- MySQL 8.0
- Scripts de inicialización incluidos
- Hibernate con estrategia `update`

---

## 📦 Estructura del Proyecto

```
Proyecto-Full-Completo/
│
├── Script_BD.txt                    # Script SQL de inicialización
│
└── Proyecto 4 sem 2/
    ├── backend/
    │   └── testing/                 # Proyecto Spring Boot
    │       ├── src/
    │       │   ├── main/
    │       │   │   ├── java/
    │       │   │   │   └── com/backend_prueba/testing/
    │       │   │   │       ├── controllers/      # REST Controllers
    │       │   │   │       ├── models/          # Entidades JPA
    │       │   │   │       ├── repositories/    # Repositorios
    │       │   │   │       ├── services/        # Lógica de negocio
    │       │   │   │       └── TestingApplication.java
    │       │   │   └── resources/
    │       │   │       ├── application.properties
    │       │   │       └── Data.sql
    │       │   └── test/                # Tests unitarios
    │       ├── pom.xml
    │       └── DOCUMENTACION_FRONTEND.md
    │
    └── Frontend/
        ├── public/
        │   ├── data/
        │   │   └── productos.json    # Datos de ejemplo
        │   └── img/                  # Imágenes públicas
        ├── src/
        │   ├── componentes/          # Componentes reutilizables
        │   │   ├── BarraLat.jsx
        │   │   ├── Footer.jsx
        │   │   └── Header.jsx
        │   ├── pages/
        │   │   ├── administrador/    # Páginas de admin
        │   │   └── tienda/           # Páginas de tienda
        │   ├── services/
        │   │   ├── cartService.js    # Servicio de carrito
        │   │   └── productServices.js # Servicio de productos
        │   ├── App.jsx               # Enrutador principal
        │   ├── Admin.jsx             # Layout admin
        │   ├── Tienda.jsx            # Layout tienda
        │   └── main.jsx
        ├── package.json
        ├── vite.config.js
        └── README.md
```

---

## 🚀 Instrucciones de Instalación

### **Prerrequisitos:**

Antes de comenzar, asegúrate de tener instalado:

- ✅ **Java JDK 24** o superior
- ✅ **Maven 3.8+**
- ✅ **MySQL 8.0** o superior
- ✅ **Node.js 18+** y **npm** o **pnpm**
- ✅ **Git**

---

### **1️⃣ Clonar el Repositorio**

```bash
git clone https://github.com/jhonnylarry/Proyecto-Full-Completo.git
cd Proyecto-Full-Completo
```

---

### **2️⃣ Configuración de la Base de Datos**

#### **Paso 1: Crear la base de datos en MySQL**

```sql
CREATE DATABASE bd_proyecto CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### **Paso 2: Ejecutar el script de inicialización**

Ejecuta el contenido del archivo `Script_BD.txt` en MySQL Workbench o desde la terminal:

```bash
mysql -u root -p bd_proyecto < Script_BD.txt
```

Este script insertará:
- Tipos de usuario (Admin, Usuario)
- Regiones y comunas de Chile
- Categorías iniciales (Copas, Vasos, Placas, Otros)

---

### **3️⃣ Configuración del Backend**

#### **Paso 1: Navegar al directorio del backend**

```bash
cd "Proyecto 4 sem 2/backend/testing"
```

#### **Paso 2: Configurar credenciales de base de datos**

Edita el archivo `src/main/resources/application.properties` y ajusta las credenciales de MySQL:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bd_proyecto?serverTimezone=UTC&useSSL=false
spring.datasource.username=root
spring.datasource.password=TU_CONTRASEÑA_MYSQL
```

#### **Paso 3: Instalar dependencias**

```bash
mvn clean install
```

---

### **4️⃣ Configuración del Frontend**

#### **Paso 1: Navegar al directorio del frontend**

```bash
cd ../../Frontend
```

#### **Paso 2: Instalar dependencias**

```bash
npm install
```

#### **Paso 3: Configurar variable de entorno**

Crea un archivo `.env.local` en la raíz del frontend:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## ▶️ Instrucciones de Ejecución

### **🔧 Ejecutar el Backend (API REST)**

Desde el directorio `Proyecto 4 sem 2/backend/testing`:

```bash
mvn spring-boot:run
```

O ejecutar el JAR compilado:

```bash
java -jar target/testing-0.0.1-SNAPSHOT.jar
```

**El backend estará disponible en:** `http://localhost:8080`

#### **Endpoints principales:**
- `GET http://localhost:8080/api/productos` - Listar productos
- `POST http://localhost:8080/api/productos` - Crear producto (con imagen)
- `GET http://localhost:8080/api/catalogo` - Listar categorías
- `GET http://localhost:8080/api/usuarios` - Listar usuarios

---

### **🎨 Ejecutar el Frontend (React + Vite)**

Desde el directorio `Proyecto 4 sem 2/Frontend`:

```bash
npm run dev
```

**El frontend estará disponible en:** `http://localhost:5173`

#### **Rutas principales:**
- `/` - Página principal (tienda)
- `/productos` - Catálogo de productos
- `/registrarse` - Registro de usuario
- `/iniciarSesion` - Inicio de sesión
- `/admin/*` - Panel de administración

---

### **🧪 Ejecutar Tests del Backend**

Desde el directorio del backend:

```bash
mvn test
```

Los tests incluyen:
- ✅ Tests de servicios (CategoriaService, ProductoService, UsuarioService, etc.)
- ✅ Tests con base de datos H2 en memoria
- ✅ Cobertura de CRUD completo

---

## 🔐 Credenciales de Prueba

### **Usuario Administrador:**
```
Tipo: Admin
ID Tipo Usuario: 1
```

### **Usuario Normal:**
```
Tipo: Usuario
ID Tipo Usuario: 2
```

### **Base de Datos MySQL:**
```
Usuario: root
Contraseña: 12345678
Base de datos: bd_proyecto
Puerto: 3306
```

> **Nota:** Estos son valores por defecto. Ajusta las credenciales según tu configuración local en `application.properties`.

---

## 📡 API Endpoints Principales

### **Productos:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Listar todos los productos |
| GET | `/api/productos/{id}` | Obtener producto por ID |
| POST | `/api/productos` | Crear producto (FormData con imagen) |
| PUT | `/api/productos/{id}` | Actualizar producto |
| DELETE | `/api/productos/{id}` | Eliminar producto |

### **Categorías:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/catalogo` | Listar categorías |
| POST | `/api/catalogo` | Crear categoría |

### **Usuarios:**
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Listar usuarios |
| POST | `/api/usuarios` | Crear usuario |

---

## 📸 Características Adicionales

### **Carga de Imágenes:**
- Tamaño máximo: **2 MB**
- Formatos soportados: JPG, PNG, GIF, WebP
- Almacenamiento en base de datos como **BLOB**
- Endpoint: `POST /api/productos` con `multipart/form-data`

### **Filtrado de Productos:**
- Por categoría
- Por búsqueda de texto
- Paginación automática
- Ordenamiento configurable

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del repositorio
2. Crea una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

**Jhonny Larry**
- GitHub: [@jhonnylarry](https://github.com/jhonnylarry)

---

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:
1. Revisa la [documentación del frontend](Proyecto%204%20sem%202/backend/testing/DOCUMENTACION_FRONTEND.md)
2. Abre un issue en GitHub
3. Contacta al equipo de desarrollo

---

**⭐ Si este proyecto te fue útil, dale una estrella en GitHub!**
