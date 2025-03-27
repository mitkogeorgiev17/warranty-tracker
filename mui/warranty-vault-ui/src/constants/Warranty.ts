export enum WarrantyStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CLAIMED_ACTIVE = 'CLAIMED_ACTIVE',
    CLAIMED_EXPIRED = 'CLAIMED_EXPIRED',
  }
  
export interface WarrantyFileDTO {
    id: number;
    filePath: string;
    name: string;
    contentType: string;
    size: number;
    uploadDate: string;
  }
  
export interface WarrantyMetadataDTO {
    note: string;
    createdAt: string;
    updatedAt: string;
  }

export interface CategoryName {
    name: string;
  }
  
export interface WarrantyDTO {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    status: WarrantyStatus;
    category: CategoryName;
    metadata: WarrantyMetadataDTO;
    files: WarrantyFileDTO[];
  }
  
  // Request commands

export interface CreateWarrantyCommand {
    name: string;
    note?: string | null;
    startDate: string;
    endDate: string;
    category?: string | null;
  }

  export interface UpdateWarrantyCommand {
    warrantyId: number;
    name: string;
    startDate: string;
    endDate: string;
    status: WarrantyStatus;
    note: string;
    category: string;
    filesToAdd?: File[];
    filesToDelete?: number[];
  }
  
export const VALIDATION = {
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 64,
      REQUIRED_MESSAGE: 'Provide warranty name.',
      SIZE_MESSAGE: 'Name length must be between 2 and 64.',
    },
    NOTE: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 2048,
      SIZE_MESSAGE: 'Note size must be between 2 and 2048 symbols.',
    },
    CATEGORY: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 64,
      SIZE_MESSAGE: 'Category size should be between 2 and 64 symbols.',
    },
    DATE: {
      REQUIRED_MESSAGE: 'This date is required.',
    },
  };