export interface User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    warrantyCountsProjection: ExpiringWarranties;
}

interface ExpiringWarranties {
    lessThanOneMonth: number;
    oneToTwelveMonths: number;
    moreThanOneYear: number;
}