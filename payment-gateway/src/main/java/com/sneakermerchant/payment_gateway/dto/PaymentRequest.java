package com.sneakermerchant.payment_gateway.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {

    private String cardNumber;
    private String cardholderName;
    private String expiryDate;
    private String cvv;
    private BigDecimal amount;
    private String currency;
    private String orderId;
}