package com.sneakermerchant.backend.service;

import com.sneakermerchant.backend.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class PaymentGatewayService {

    private final WebClient webClient;

    @Autowired
    public PaymentGatewayService(WebClient webClient) {
        this.webClient = webClient;
    }

    public PaymentResponse makePayment(PaymentRequest request) {
        return webClient.post()
                .uri("/payment")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(PaymentResponse.class)
                .block();
    }

    public PaymentStatusResponse getPaymentStatus(String paymentRef) {
        return webClient.get()
                .uri("/payment_status/" + paymentRef)
                .retrieve()
                .bodyToMono(PaymentStatusResponse.class)
                .block();
    }

    public List<TransactionResponse> getTransactions(TransactionRequest request) {
        return webClient.post()
                .uri("/transactions")
                .bodyValue(request)
                .retrieve()
                .bodyToFlux(TransactionResponse.class)
                .collectList()
                .block();
    }
}