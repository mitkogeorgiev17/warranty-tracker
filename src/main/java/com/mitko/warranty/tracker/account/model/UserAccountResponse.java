package com.mitko.warranty.tracker.account.model;

public record UserAccountResponse(
        String username,
        String email,
        String firstName,
        String lastName
) {
}
