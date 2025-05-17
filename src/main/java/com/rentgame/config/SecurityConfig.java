package com.rentgame.config;

import com.rentgame.service.CustomUserDetailsService;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

@Configuration
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
                .authenticationProvider(authProvider())
                .authorizeHttpRequests()
                .requestMatchers(HttpMethod.POST, "/api/users").permitAll()               // rejestracja
                .requestMatchers(HttpMethod.POST, "/api/games").hasRole("ADMIN")         // dodawanie gier
                .requestMatchers(HttpMethod.POST, "/api/equipment").hasRole("ADMIN")     // dodawanie sprzętu
                .requestMatchers(HttpMethod.GET, "/api/games").authenticated()           // podgląd gier
                .requestMatchers(HttpMethod.GET, "/api/equipment").authenticated()       // podgląd sprzętu
                .requestMatchers(HttpMethod.POST, "/api/reservations").hasAnyRole("USER", "ADMIN")  //rezerwacja sprzetu
                .requestMatchers("/api/**").authenticated()                              // cała reszta też dla zalogowanych
                .anyRequest().permitAll()
                .and()
                .httpBasic();

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
