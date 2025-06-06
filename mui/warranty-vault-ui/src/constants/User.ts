export interface User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    warrantyCountsProjection: ExpiringWarranties;
    language: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
}

interface ExpiringWarranties {
    lessThanOneMonth: number;
    oneToTwelveMonths: number;
    moreThanOneYear: number;
}