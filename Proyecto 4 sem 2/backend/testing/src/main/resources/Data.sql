-- Poblar Tipos de Usuario
INSERT INTO tipos_usuario (id, nombre) VALUES (1, 'ADMIN');
INSERT INTO tipos_usuario (id, nombre) VALUES (2, 'CLIENTE');

-- Poblar Regiones
INSERT INTO regiones (id, nombre) VALUES (13, 'Metropolitana');
INSERT INTO regiones (id, nombre) VALUES (5, 'Valparaíso');
INSERT INTO regiones (id, nombre) VALUES (8, 'Biobío');

-- Poblar Comunas (asociadas a su región por region_id)
INSERT INTO comunas (id, nombre, region_id) VALUES (101, 'Maipú', 13);
INSERT INTO comunas (id, nombre, region_id) VALUES (102, 'Las Condes', 13);
INSERT INTO comunas (id, nombre, region_id) VALUES (201, 'Viña del Mar', 5);
INSERT INTO comunas (id, nombre, region_id) VALUES (301, 'Concepción', 8);

-- Poblar Categorías de Productos
INSERT INTO categorias (id, nombre) VALUES (1, 'Copa');
INSERT INTO categorias (id, nombre) VALUES (2, 'Vaso');
INSERT INTO categorias (id, nombre) VALUES (3, 'Chapa');