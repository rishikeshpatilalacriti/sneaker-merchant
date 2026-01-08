package com.sneakermerchant.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private Long id;
    private String paymentRef;
    private String cardNumber;
    private BigDecimal amount;
    private String currency;
    private String orderId;
    private String status;
    private LocalDateTime createdAt;
}