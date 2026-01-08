package com.sneakermerchant.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${payment.gateway.url}")
    private String paymentGatewayUrl;

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl(paymentGatewayUrl)
                .build();
    }
}