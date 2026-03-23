export type ContractStatus = "draft" | "ready";

export type PersonSection = {
  firstName: string;
  lastName: string;
  pesel: string;
  nip?: string;
  regon?: string;
  idDocumentNumber: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  postalCode: string;
  city: string;
  country: string;
};

export type VehicleSection = {
  brand: string;
  model: string;
  version?: string;
  year: number;
  vin: string;
  registrationNumber: string;
  mileage: number;
  color?: string;
  engineCapacity: number;
  fuelType: string;
  firstRegistrationDate: string;
  vehicleCardNumber?: string;
};

export type SaleTermsSection = {
  saleDate: string;
  salePlace: string;
  price: number;
  paymentMethod: string;
  handoverDate: string;
};

export type DeclarationsSection = {
  sellerOwnsVehicle: boolean;
  vehicleFreeOfLiens: boolean;
  buyerKnowsTechnicalState: boolean;
  defectsDescription?: string;
  documentsTransferred: boolean;
  keysTransferred: boolean;
  additionalNotes?: string;
};

export type ContractDraft = {
  _id: string;
  _creationTime: number;
  ownerTokenIdentifier: string;
  title: string;
  status: ContractStatus;
  seller: Partial<PersonSection>;
  buyer: Partial<PersonSection>;
  vehicle: Partial<VehicleSection>;
  saleTerms: Partial<SaleTermsSection>;
  declarations: Partial<DeclarationsSection>;
  updatedAt: number;
  generatedPdfUrl?: string;
};
