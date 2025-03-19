package com.brainboosters.brainboosters.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .oauth2Login() // Enable OAuth2 login
            .and()
            .authorizeRequests()
            .antMatchers("/login**", "/error**").permitAll() // Public endpoints
            .anyRequest().authenticated(); // Secure all other routes

        return http.build();
    }
}
