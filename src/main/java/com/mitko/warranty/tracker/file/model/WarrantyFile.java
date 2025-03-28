package com.mitko.warranty.tracker.file.model;

import com.mitko.warranty.tracker.warranty.model.Warranty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.Objects;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@Table(name = "files")
public class WarrantyFile {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    private long id;

    @Column(name = "file_id")
    private String fileId;

    @Column(name = "file_path")
    private String filePath;

    @Column(name = "name")
    private String name;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "file_size")
    private long fileSize;

    @Column(name = "upload_date")
    private LocalDate uploadDate;

    @ManyToOne(fetch = LAZY)
    private Warranty warranty;

    @Override
    public final boolean equals(Object obj) {
        if (this == obj) return true;
        return (obj instanceof WarrantyFile other) &&
                id == other.id;
    }

    @Override
    public final int hashCode() {
        return Objects.hashCode(id);
    }
}
