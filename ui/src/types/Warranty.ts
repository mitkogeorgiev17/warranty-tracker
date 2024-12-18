export interface Warranty {
    id: number,
    name: string,
    startDate: string,
    endDate: string,
    status: string,
    category: string,
    metadata?: WarrantyMetadata | null,
    files?: WarrantyFile[] | null
}

interface WarrantyMetadata {
    note: string,
    createdAt: string,
    updatedAt: string
}

interface WarrantyFile {
    id: number,
    file: string
}