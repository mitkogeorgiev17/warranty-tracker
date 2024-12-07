package com.mitko.warranty.tracker.warranty.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

import static jakarta.persistence.EnumType.STRING;
import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Table(name = "WARRANTIES")
public class Warranty {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private long id;

    @Column(name = "NAME")
    private String name;

    @Column(name = "START_DATE")
    private LocalDate startDate;

    @Column(name = "END_DATE")
    private LocalDate endDate;

    @Column(name = "STATUS")
    @Enumerated(STRING)
    private WarrantyStatus status;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @Override
    public final boolean equals(Object obj) {
        if (this == obj) return true;
        return (obj instanceof Warranty other) &&
                id == other.id;
    }

    @Override
    public final int hashCode() {
        return Objects.hashCode(id);
    }
}
