package com.sneakermerchant.payment_gateway.controller;

import com.sneakermerchant.payment_gateway.dto.*;
import com.sneakermerchant.payment_gateway.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/payment")
    public ResponseEntity<PaymentResponse> makePayment(@RequestBody PaymentRequest paymentRequest) {
        try {
            PaymentResponse response = paymentService.processPayment(paymentRequest);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            PaymentResponse errorResponse = new PaymentResponse();
            errorResponse.setStatus("failed");
            errorResponse.setMessage(e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/payment_status/{paymentRef}")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(@PathVariable String paymentRef) {
        try {
            PaymentStatusResponse response = paymentService.getPaymentStatus(paymentRef);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/transactions")
    public ResponseEntity<List<TransactionResponse>> getTransactions(@RequestBody TransactionRequest request) {
        try {
            List<TransactionResponse> transactions = paymentService.getTransactions(request);
            return new ResponseEntity<>(transactions, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}