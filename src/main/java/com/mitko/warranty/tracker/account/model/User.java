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
@Table(name = "USERS")
public class User {
    @Id
    private String id;

    @Column(name = "USERNAME")
    private String username;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "FIRST_NAME")
    private String firstName;

    @Column(name = "LAST_NAME")
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
