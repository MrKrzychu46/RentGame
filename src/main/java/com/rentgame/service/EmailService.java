package com.rentgame.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String to, String tempPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Reset hasła - RentGame");
        message.setText("Twoje tymczasowe hasło: " + tempPassword + "\nZaloguj się i zmień hasło jak najszybciej.");
        mailSender.send(message);
    }
}
