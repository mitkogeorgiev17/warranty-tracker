package com.mitko.warranty.tracker.account.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.Objects;

import static jakarta.persistence.EnumType.STRING;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Table(name = "users")
public class User {
    @Id
    private String id;

    @Column(name = "username")
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "account_language")
    @Enumerated(STRING)
    private Language language;

    {
        this.language = Language.EN;
    }

    @Column(name = "email_notifications")
    private boolean emailNotifications;

    @Column(name = "push_notifications")
    private boolean pushNotifications;

    @Override
    public final boolean equals(Object obj) {
        if (this == obj) return true;
        return (obj instanceof User other) &&
                Objects.equals(id, other.id);
    }

    @Override
    public final int hashCode() {
        return Objects.hashCode(id);
    }
}
