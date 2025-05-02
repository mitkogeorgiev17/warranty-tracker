package com.mitko.warranty.tracker.account.model.request;

import com.mitko.warranty.tracker.account.model.Language;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
public class UpdateUserCommand {
    private Language updatedLanguage;
}
