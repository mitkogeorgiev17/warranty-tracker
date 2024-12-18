export interface Warranty {
    id: number,
    name: string,
    startDate: Date,
    endDate: Date,
    status: string,
    category: string,
    metadata?: WarrantyMetadata | null,
    files?: WarrantyFile[] | null
}

interface WarrantyMetadata {
    note: string,
    createdAt: Date,
    updatedAt: Date
}

interface WarrantyFile {
    id: number,
    file: string
}