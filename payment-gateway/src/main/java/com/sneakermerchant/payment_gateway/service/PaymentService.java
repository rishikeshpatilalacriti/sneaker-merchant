package com.sneakermerchant.payment_gateway.service;

import com.sneakermerchant.payment_gateway.dto.*;
import com.sneakermerchant.payment_gateway.entity.CreditCard;
import com.sneakermerchant.payment_gateway.entity.Payment;
import com.sneakermerchant.payment_gateway.repository.CreditCardRepository;
import com.sneakermerchant.payment_gateway.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final CreditCardRepository creditCardRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public PaymentService(CreditCardRepository creditCardRepository, PaymentRepository paymentRepository) {
        this.creditCardRepository = creditCardRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public PaymentResponse processPayment(PaymentRequest request) {

        CreditCard card = creditCardRepository.findByCardNumber(request.getCardNumber())
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (!card.getIsActive()) {
            return createFailedResponse("Card is blocked or inactive");
        }

        if (!card.getCardholderName().equalsIgnoreCase(request.getCardholderName())) {
            return createFailedResponse("Cardholder name does not match");
        }

        if (!card.getCvv().equals(request.getCvv())) {
            return createFailedResponse("Invalid CVV");
        }

        if (isCardExpired(card.getExpiryDate())) {
            return createFailedResponse("Card has expired");
        }

        if (card.getCardBalance().compareTo(request.getAmount()) < 0) {
            return createFailedResponse("Insufficient card balance");
        }

        BigDecimal newBalance = card.getCardBalance().subtract(request.getAmount());
        card.setCardBalance(newBalance);
        creditCardRepository.save(card);

        String paymentRef = generatePaymentRef();

        Payment payment = new Payment();
        payment.setPaymentRef(paymentRef);
        payment.setCardNumber(request.getCardNumber());
        payment.setAmount(request.getAmount());
        payment.setCurrency(request.getCurrency());
        payment.setOrderId(request.getOrderId());
        payment.setStatus("SUCCESS");

        paymentRepository.save(payment);

        PaymentResponse response = new PaymentResponse();
        response.setStatus("success");
        response.setPaymentRef(paymentRef);
        response.setMessage("Payment processed successfully");

        return response;
    }

    public PaymentStatusResponse getPaymentStatus(String paymentRef) {
        Payment payment = paymentRepository.findByPaymentRef(paymentRef)
                .orElseThrow(() -> new RuntimeException("Payment not found with reference: " + paymentRef));

        PaymentStatusResponse response = new PaymentStatusResponse();
        response.setPaymentRef(payment.getPaymentRef());
        response.setCardNumber(payment.getCardNumber());
        response.setOrderId(payment.getOrderId());
        response.setAmount(payment.getAmount());
        response.setCurrency(payment.getCurrency());
        response.setStatus(payment.getStatus());
        response.setCreatedAt(payment.getCreatedAt());
        response.setUpdatedAt(payment.getUpdatedAt());

        return response;
    }

    public List<TransactionResponse> getTransactions(TransactionRequest request) {

        CreditCard card = creditCardRepository.findByCardNumber(request.getCardNumber())
                .orElseThrow(() -> new RuntimeException("Card not found"));

        if (!card.getCardholderName().equalsIgnoreCase(request.getCardholderName())) {
            throw new RuntimeException("Cardholder name does not match");
        }

        if (!card.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        List<Payment> payments = paymentRepository.findByCardNumber(request.getCardNumber());

        return payments.stream().map(payment -> {
            TransactionResponse response = new TransactionResponse();
            response.setId(payment.getId());
            response.setPaymentRef(payment.getPaymentRef());
            response.setCardNumber(payment.getCardNumber());
            response.setAmount(payment.getAmount());
            response.setCurrency(payment.getCurrency());
            response.setOrderId(payment.getOrderId());
            response.setStatus(payment.getStatus());
            response.setCreatedAt(payment.getCreatedAt());
            return response;
        }).collect(Collectors.toList());
    }

    private PaymentResponse createFailedResponse(String message) {
        Payment payment = new Payment();
        payment.setPaymentRef(generatePaymentRef());
        payment.setCardNumber("UNKNOWN");
        payment.setAmount(BigDecimal.ZERO);
        payment.setCurrency("INR");
        payment.setOrderId("FAILED");
        payment.setStatus("FAILED");
        paymentRepository.save(payment);

        PaymentResponse response = new PaymentResponse();
        response.setStatus("failed");
        response.setPaymentRef(payment.getPaymentRef());
        response.setMessage(message);
        return response;
    }

    private boolean isCardExpired(String expiryDate) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/yy");
            LocalDate expiry = LocalDate.parse("01/" + expiryDate, DateTimeFormatter.ofPattern("dd/MM/yy"));
            expiry = expiry.withDayOfMonth(expiry.lengthOfMonth());
            return expiry.isBefore(LocalDate.now());
        } catch (Exception e) {
            return true;
        }
    }

    private String generatePaymentRef() {
        return "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}