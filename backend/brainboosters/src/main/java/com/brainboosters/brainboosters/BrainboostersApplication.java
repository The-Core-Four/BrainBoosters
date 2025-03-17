package com.brainboosters.brainboosters;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
@SpringBootApplication
@RestController
public class BrainboostersApplication {

	public static void main(String[] args) {
		SpringApplication.run(BrainboostersApplication.class, args);
	}

    @GetMapping("/hello")
    public String rootEndpoint() {
        return "Hello world!";
    }

    // New greet endpoint
    @GetMapping("/greet/{name}")
    public String greet(@PathVariable String name, @RequestParam(required = false) String message) {
        if (message != null && !message.isEmpty()) {
            return "Hello " + name + "! " + message;
        }
        return "Hello " + name + "! Welcome to Spring Boot!";
    }
}

