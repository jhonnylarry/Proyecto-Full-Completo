package com.backend_prueba.testing.entities;
import jakarta.persistence.*; // Asegúrate que sea jakarta
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columna para tu "fecha de venta"
    @Column(nullable = false)
    private LocalDateTime fechaVenta;

    // Columna para tu "valor total de ventas"
    @Column(nullable = false)
    private Long valorTotal;

    // Relación: Muchos pedidos pueden ser de UN usuario
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario; // Aquí vinculamos al usuario que compró

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<DetallePedido> detalles;
}