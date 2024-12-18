package com.mitko.warranty.tracker.category;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.util.Objects;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Table(name = "CATEGORIES")
public class Category {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private long id;

    @Column(name = "NAME")
    private String name;

    @Override
    public final boolean equals(Object obj) {
        if (this == obj) return true;
        return (obj instanceof Category other) &&
                id == other.id;
    }

    @Override
    public final int hashCode() {
        return Objects.hashCode(id);
    }
}
