package com.sneakermerchant.payment_gateway.repository;


import com.sneakermerchant.payment_gateway.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByPaymentRef(String paymentRef);

    List<Payment> findByCardNumber(String cardNumber);
}