package com.sneakermerchant.payment_gateway.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "credit_cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreditCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 16)
    private String cardNumber;

    @Column(nullable = false, length = 100)
    private String cardholderName;

    @Column(nullable = false, length = 5)
    private String expiryDate;

    @Column(nullable = false, length = 3)
    private String cvv;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cardBalance;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}