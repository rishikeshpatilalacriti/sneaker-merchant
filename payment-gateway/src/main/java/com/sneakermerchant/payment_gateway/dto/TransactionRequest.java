package com.sneakermerchant.payment_gateway.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {

    private String cardholderName;
    private String cardNumber;
    private String password;
}