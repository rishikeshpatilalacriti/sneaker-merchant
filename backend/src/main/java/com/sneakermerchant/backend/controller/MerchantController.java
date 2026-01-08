package com.sneakermerchant.backend.controller;

import com.sneakermerchant.backend.dto.*;
import com.sneakermerchant.backend.service.PaymentGatewayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class MerchantController {

    private final PaymentGatewayService paymentGatewayService;

    @Autowired
    public MerchantController(PaymentGatewayService paymentGatewayService) {
        this.paymentGatewayService = paymentGatewayService;
    }

    @PostMapping("/payment")
    public ResponseEntity<PaymentResponse> makePayment(@RequestBody PaymentRequest request) {
        try {
            PaymentResponse response = paymentGatewayService.makePayment(request);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            PaymentResponse errorResponse = new PaymentResponse();
            errorResponse.setStatus("failed");
            errorResponse.setMessage("Payment processing failed: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/payment_status/{paymentRef}")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(@PathVariable String paymentRef) {
        try {
            PaymentStatusResponse response = paymentGatewayService.getPaymentStatus(paymentRef);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactions(@RequestBody TransactionRequest request) {
        try {
            List<TransactionResponse> transactions = paymentGatewayService.getTransactions(request);
            return new ResponseEntity<>(transactions, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}