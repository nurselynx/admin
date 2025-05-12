export type IconButtonProps = {
  activeImage: string;
  setActiveImage: (value: string) => void;
  imageSrc: string;
  altText: string;
  value: string;
  text: string;
  resImageSrc: string;
};

export interface TableDataType {
  clientName: string;
  orgName?: string;
  clientAddress: string;
  phoneNumber?: string;
  insuranceProviderName?: string;
  insuranceType?: string;
  groupNumber?: string;
  identificationNumber?: string;
  serviceNeeded?: string;
  schedule?: string;
  frequencyRequired?: string;
  applicantId?: number;
  status?: number;
  insuranceProvider?: string
  documentUrl?: {
    signed_url?: string;
  };
  suggestedProfessionals?: any;
  name: string;
  location: string;
  startDate: string | Date;
  additionalInformation?: any;
  id?: any;
  orgname?: string;
  orgLocation?: string;
  speciality?: string;
  genderPreference?: string;
  timePreference?: string;
  languagePreference?: any;
  experience?: string
}

export type Column = {
  label: string;
  accessor: keyof TableDataType | string; // Allow non-TableData keys
  render?: (row: TableDataType) => any; // Accept row data
  hidden?: boolean;
};

export interface DetailsFacilityProps {
  setShowDetails: (value: null) => void; // Function to set showDetails to null
  showDetails: {
    clientName: string;
    clientAddress: string;
    phoneNumber: string;
    jobType: string;
    speciality: string;
    location: string;
    insuranceType: string;
    insuranceProviderName: string;
    groupNumber: string;
    identificationNumber: string;
    frequencyRequired: string;
    experience: string;
    schedule: string;
    genderPreference: string;
    medicalTitle: string;
    qualification: string;
    startDate: string;
    additionalInformation: string;
    status?: any;
    endDate: string;
    serviceNeeded: string;
    orgName?: string;
    orgLocation?: string;
    timePreference?: string;
    languagePreference?: string;
    applicantId?: number;
    documentUrl?: {
      signed_url?: string;
    };
  } | null;
  setIsSuggestedProfessionals: (value: boolean) => void;
  isStaffingNeeds?: boolean;
  isHomeCare?: boolean;
  isHomeHealth?: boolean;
  isRequests?: boolean;
  handleCancelRequest?: any;
}

export type EventData = {
  date: string; // Expected format: "yyyy-MM-dd"
  schedule: string;
  name: string; // Encrypted name
  jobType: string;
  status?: string;
  startDate: string;
  endDate: string;
};

export type DecodedEvent = {
  date: string;
  time: string;
  title: string;
  color: string;
  status?: string;
};

export type CalendarProps = {
  data: EventData[];
};

export interface ResponsiveTableCardProps {
  patientFacilityName: string;
  location: string;
  phoneNumber?: string;
  date: any;
  schedule: string;
  viewData: any;
  rowIndex: number;
  setIsSuggestedProfessionals: (value: boolean) => void;
  setShowDetails: (data: TableDataType) => void;
  fetchCandidateName?: any;
  jobIDNumber?: any;
  isJobType?: boolean;
  setJobIDNumber?: React.Dispatch<React.SetStateAction<number>>;
  isPhoneNumber?: boolean;
  speciality?: string;
  isRequests?: boolean;
  handleCancelRequest?: any;
  applicantId?: number
}

interface Option {
  value: string;
  label: string;
}

export interface SelectDropdownProps {
  options: Option[];
  selectedValue: string;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
