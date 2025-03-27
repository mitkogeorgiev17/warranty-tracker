package com.mitko.warranty.tracker.account.model.response;

import lombok.Data;

@Data
public class ExpiringWarrantiesCount {
    private int expiringLessThan1Month = 0;
    private int expiring1To12Months = 0;
    private int expiringMoreThan1Year = 0;
}
