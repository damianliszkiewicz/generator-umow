import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const personSection = v.object({
  firstName: v.optional(v.string()),
  lastName: v.optional(v.string()),
  pesel: v.optional(v.string()),
  nip: v.optional(v.string()),
  regon: v.optional(v.string()),
  idDocumentNumber: v.optional(v.string()),
  street: v.optional(v.string()),
  houseNumber: v.optional(v.string()),
  apartmentNumber: v.optional(v.string()),
  postalCode: v.optional(v.string()),
  city: v.optional(v.string()),
  country: v.optional(v.string()),
});

const vehicleSection = v.object({
  brand: v.optional(v.string()),
  model: v.optional(v.string()),
  version: v.optional(v.string()),
  year: v.optional(v.number()),
  vin: v.optional(v.string()),
  registrationNumber: v.optional(v.string()),
  mileage: v.optional(v.number()),
  color: v.optional(v.string()),
  engineCapacity: v.optional(v.number()),
  fuelType: v.optional(v.string()),
  firstRegistrationDate: v.optional(v.string()),
  vehicleCardNumber: v.optional(v.string()),
});

const saleTermsSection = v.object({
  saleDate: v.optional(v.string()),
  salePlace: v.optional(v.string()),
  price: v.optional(v.number()),
  paymentMethod: v.optional(v.string()),
  handoverDate: v.optional(v.string()),
});

const declarationsSection = v.object({
  sellerOwnsVehicle: v.optional(v.boolean()),
  vehicleFreeOfLiens: v.optional(v.boolean()),
  buyerKnowsTechnicalState: v.optional(v.boolean()),
  defectsDescription: v.optional(v.string()),
  documentsTransferred: v.optional(v.boolean()),
  keysTransferred: v.optional(v.boolean()),
  additionalNotes: v.optional(v.string()),
});

export default defineSchema({
  contracts: defineTable({
    ownerTokenIdentifier: v.string(),
    title: v.string(),
    status: v.union(v.literal("draft"), v.literal("ready")),
    seller: personSection,
    buyer: personSection,
    vehicle: vehicleSection,
    saleTerms: saleTermsSection,
    declarations: declarationsSection,
    generatedPdfUrl: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_ownerTokenIdentifier", ["ownerTokenIdentifier"])
    .index("by_ownerTokenIdentifier_and_updatedAt", ["ownerTokenIdentifier", "updatedAt"]),
});
