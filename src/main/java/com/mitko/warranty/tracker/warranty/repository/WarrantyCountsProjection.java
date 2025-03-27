package com.mitko.warranty.tracker.warranty.repository;

public interface WarrantyCountsProjection {
    Long getLessThanOneMonth();
    Long getOneToTwelveMonths();
    Long getMoreThanOneYear();
}