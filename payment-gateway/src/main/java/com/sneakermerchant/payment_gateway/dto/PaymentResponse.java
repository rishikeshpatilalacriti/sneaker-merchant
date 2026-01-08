package com.sneakermerchant.payment_gateway.dto;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private String status;
    private String paymentRef;
    private String message;
}