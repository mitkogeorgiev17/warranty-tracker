//package com.mitko.warranty.tracker.exception;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.validation.FieldError;
//import org.springframework.web.bind.MethodArgumentNotValidException;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.stream.Collectors;
//
//@RestControllerAdvice
//public class GlobalExceptionHandler {
//    @ExceptionHandler(CustomResponseStatusException.class)
//    public ResponseEntity<Object> handleCustomResponseStatusException(CustomResponseStatusException ex) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("status", ex.getHttpStatus().value());
//        response.put("errorCode", ex.getErrorCode());
//        response.put("error", ex.getError());
//        response.put("message", ex.getMessage());
//
//        return new ResponseEntity<>(response, ex.getHttpStatus());
//    }
//
//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<Object> handleGenericException(Exception ex) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
//        response.put("error", HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase());
//        response.put("message", ex.getMessage());
//
//        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//    }
//
//    @ExceptionHandler(MethodArgumentNotValidException.class)
//    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
//        Map<String, Object> response = new HashMap<>();
//        response.put("status", HttpStatus.BAD_REQUEST.value());
//        response.put("error", HttpStatus.BAD_REQUEST.getReasonPhrase());
//
//        String errorDetails = ex.getBindingResult()
//                .getAllErrors()
//                .stream()
//                .map(error -> {
//                    String fieldName = ((FieldError) error).getField();
//                    String message = error.getDefaultMessage();
//                    return fieldName + ": " + message;
//                })
//                .collect(Collectors.joining(", "));
//
//        response.put("message", "Validation failed: " + errorDetails);
//
//        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
//    }
//
//}
