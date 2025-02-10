package com.mitko.warranty.tracker.warranty.model;

import com.mitko.warranty.tracker.account.model.User;
import com.mitko.warranty.tracker.category.Category;
import com.mitko.warranty.tracker.file.model.WarrantyFile;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static jakarta.persistence.EnumType.STRING;
import static jakarta.persistence.FetchType.EAGER;
import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Table(name = "warranties")
public class Warranty {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "status")
    @Enumerated(STRING)
    private WarrantyStatus status;

    @Column(name = "NOTE")
    private String note;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = EAGER)
    private Category category;

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "warranty"
    )
    private List<WarrantyFile> files = new ArrayList<>();

    @ManyToOne(fetch = EAGER)
    @JoinColumn(name = "USER_ID")
    private User user;

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
