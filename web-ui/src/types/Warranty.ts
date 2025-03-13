export interface Warranty {
    id: number,
    name: string,
    startDate: string,
    endDate: string,
    status: string,
    category: Category,
    notes: string | null
}

export interface WarrantyExtended {
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
    createdAt: Date,
    updatedAt: Date | null
}

interface WarrantyFile {
    id: number,
    file: string
}

export interface CreateWarrantyCommand {
    name: string;
    startDate: Date;
    endDate: Date;
    notes: string | null;
    category: string | null;
    files: File[];
  }