export interface Warranty {
    id: number,
    name: string,
    startDate: string,
    endDate: string,
    status: string,
    category: Category,
    metadata?: WarrantyMetadata | null,
    files?: WarrantyFile[] | null
}

export interface Category {
    name: string
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