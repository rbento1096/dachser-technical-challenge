package com.example.profitcalculator.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler exceptionHandler;
    private WebRequest webRequest;

    @BeforeEach
    void setUp() {
        exceptionHandler = new GlobalExceptionHandler();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/api/profit/shipments/999");
        webRequest = new ServletWebRequest(request);
    }

    @Test
    void handleResourceNotFoundException_ShouldReturn404WithProperMessage() {
        // Arrange
        ResourceNotFoundException exception = new ResourceNotFoundException("Shipment", "id", 999L);

        // Act
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleResourceNotFoundException(exception, webRequest);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(404, response.getBody().getStatus());
        assertEquals("Not Found", response.getBody().getError());
        assertEquals("Shipment not found with id : '999'", response.getBody().getMessage());
        assertEquals("uri=/api/profit/shipments/999", response.getBody().getPath());
    }

    @Test
    void handleBadRequestException_ShouldReturn400WithProperMessage() {
        // Arrange
        BadRequestException exception = new BadRequestException("Income and Cost cannot both be 0");

        // Act
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleBadRequestException(exception, webRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(400, response.getBody().getStatus());
        assertEquals("Bad Request", response.getBody().getError());
        assertEquals("Income and Cost cannot both be 0", response.getBody().getMessage());
        assertEquals("uri=/api/profit/shipments/999", response.getBody().getPath());
    }

    @Test
    void handleIllegalArgumentException_ShouldReturn400WithProperMessage() {
        // Arrange
        IllegalArgumentException exception = new IllegalArgumentException("Invalid input data");

        // Act
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleIllegalArgumentException(exception, webRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(400, response.getBody().getStatus());
        assertEquals("Bad Request", response.getBody().getError());
        assertEquals("Invalid input data", response.getBody().getMessage());
        assertEquals("uri=/api/profit/shipments/999", response.getBody().getPath());
    }

    @Test
    void handleNoSuchElementException_ShouldReturn404WithGenericMessage() {
        // Arrange
        java.util.NoSuchElementException exception = new java.util.NoSuchElementException();

        // Act
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleNoSuchElementException(exception, webRequest);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(404, response.getBody().getStatus());
        assertEquals("Not Found", response.getBody().getError());
        assertEquals("The requested resource was not found", response.getBody().getMessage());
        assertEquals("uri=/api/profit/shipments/999", response.getBody().getPath());
    }

    @Test
    void handleGlobalException_ShouldReturn500WithGenericMessage() {
        // Arrange
        Exception exception = new RuntimeException("Unexpected error");

        // Act
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleGlobalException(exception, webRequest);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(500, response.getBody().getStatus());
        assertEquals("Internal Server Error", response.getBody().getError());
        assertEquals("An unexpected error occurred", response.getBody().getMessage());
        assertEquals("uri=/api/profit/shipments/999", response.getBody().getPath());
    }

    @Test
    void errorResponse_ShouldHaveTimestamp() {
        // Arrange
        ResourceNotFoundException exception = new ResourceNotFoundException("Test", "field", "value");

        // Act
        ResponseEntity<ErrorResponse> response = exceptionHandler.handleResourceNotFoundException(exception, webRequest);

        // Assert
        assertNotNull(response.getBody().getTimestamp());
    }
}
