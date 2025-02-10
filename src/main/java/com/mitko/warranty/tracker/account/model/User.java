package com.mitko.warranty.tracker.account.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.Objects;

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
