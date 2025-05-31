package com.mitko.warranty.tracker.account.model.response;

import com.mitko.warranty.tracker.account.model.Language;
import com.mitko.warranty.tracker.warranty.repository.WarrantyCountsProjection;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@NoArgsConstructor
@Accessors(chain = true)
public class UserAccountResponse {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private WarrantyCountsProjection warrantyCountsProjection;
    private Language language;
    private boolean emailNotifications;
    private boolean pushNotifications;
}