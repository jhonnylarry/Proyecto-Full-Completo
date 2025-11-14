package com.backend_prueba.testing.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "detalle_pedidos")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación: Muchos detalles pertenecen a UN Pedido
    @ManyToOne
    @JoinColumn(name = "pedido_id")
    @JsonIgnore // ¡Importante! Evita un bucle infinito al convertir a JSON
    private Pedido pedido;

    // Relación: Muchos detalles pueden apuntar a UN Producto
    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto; // El producto que se vendió

    // Columna para tu "cantidad de venta" (de este producto)
    @Column(nullable = false)
    private Integer cantidad;

    // Guardamos el precio del producto al momento de la venta
    @Column(nullable = false)
    private Long precioUnitario;
}