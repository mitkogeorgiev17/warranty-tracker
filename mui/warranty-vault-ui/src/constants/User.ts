export interface User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    warrantyCountsProjection: ExpiringWarranties;
    language: string;
}

interface ExpiringWarranties {
    lessThanOneMonth: number;
    oneToTwelveMonths: number;
    moreThanOneYear: number;
}