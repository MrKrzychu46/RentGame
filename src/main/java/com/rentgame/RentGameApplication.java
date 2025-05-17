package com.rentgame;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity
public class RentGameApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentGameApplication.class, args);
	}

}
