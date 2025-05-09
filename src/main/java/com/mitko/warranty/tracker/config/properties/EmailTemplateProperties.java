package com.mitko.warranty.tracker.config.properties;

public record EmailTemplateProperties(
        BulgarianEmailTemplate bg,
        EnglishEmailTemplate en
) {
}
