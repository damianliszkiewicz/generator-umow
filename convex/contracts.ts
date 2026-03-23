import { v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";

const personInput = {
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
};

const vehicleInput = {
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
};

const saleTermsInput = {
  saleDate: v.optional(v.string()),
  salePlace: v.optional(v.string()),
  price: v.optional(v.number()),
  paymentMethod: v.optional(v.string()),
  handoverDate: v.optional(v.string()),
};

const declarationsInput = {
  sellerOwnsVehicle: v.optional(v.boolean()),
  vehicleFreeOfLiens: v.optional(v.boolean()),
  buyerKnowsTechnicalState: v.optional(v.boolean()),
  defectsDescription: v.optional(v.string()),
  documentsTransferred: v.optional(v.boolean()),
  keysTransferred: v.optional(v.boolean()),
  additionalNotes: v.optional(v.string()),
};

async function requireIdentityTokenIdentifier(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Not authenticated");
  }

  return identity.tokenIdentifier;
}

export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const tokenIdentifier = await requireIdentityTokenIdentifier(ctx);

    return await ctx.db
      .query("contracts")
      .withIndex("by_ownerTokenIdentifier_and_updatedAt", (q) => q.eq("ownerTokenIdentifier", tokenIdentifier))
      .order("desc")
      .take(100);
  },
});

export const getById = query({
  args: {
    contractId: v.id("contracts"),
  },
  handler: async (ctx, args) => {
    const tokenIdentifier = await requireIdentityTokenIdentifier(ctx);
    const contract = await ctx.db.get(args.contractId);

    if (!contract) {
      throw new Error("Nie znaleziono umowy.");
    }

    if (contract.ownerTokenIdentifier !== tokenIdentifier) {
      throw new Error("Unauthorized");
    }

    return contract;
  },
});

export const createDraft = mutation({
  args: {
    seller: v.object(personInput),
  },
  handler: async (ctx, args) => {
    const tokenIdentifier = await requireIdentityTokenIdentifier(ctx);
    const now = Date.now();

    return await ctx.db.insert("contracts", {
      ownerTokenIdentifier: tokenIdentifier,
      title: `Umowa ${new Date(now).toLocaleDateString("pl-PL")}`,
      status: "draft",
      seller: args.seller,
      buyer: {},
      vehicle: {},
      saleTerms: {},
      declarations: {
        sellerOwnsVehicle: true,
        vehicleFreeOfLiens: true,
        buyerKnowsTechnicalState: true,
        documentsTransferred: true,
        keysTransferred: true,
      },
      updatedAt: now,
    });
  },
});

async function getOwnedContractOrThrow(
  ctx: MutationCtx,
  contractId: Id<"contracts">,
): Promise<Doc<"contracts">> {
  const tokenIdentifier = await requireIdentityTokenIdentifier(ctx);
  const contract = await ctx.db.get(contractId);

  if (!contract) {
    throw new Error("Nie znaleziono umowy.");
  }

  if (contract.ownerTokenIdentifier !== tokenIdentifier) {
    throw new Error("Unauthorized");
  }

  return contract;
}

export const updateSeller = mutation({
  args: {
    contractId: v.id("contracts"),
    seller: v.object(personInput),
  },
  handler: async (ctx, args) => {
    const contract = await getOwnedContractOrThrow(ctx, args.contractId);
    const mergedSeller = { ...contract.seller, ...args.seller };

    await ctx.db.patch(args.contractId, {
      seller: mergedSeller,
      title: `Umowa ${mergedSeller.firstName ?? ""} ${mergedSeller.lastName ?? ""}`.trim(),
      updatedAt: Date.now(),
    });
  },
});

export const updateBuyer = mutation({
  args: {
    contractId: v.id("contracts"),
    buyer: v.object(personInput),
  },
  handler: async (ctx, args) => {
    const contract = await getOwnedContractOrThrow(ctx, args.contractId);
    const mergedBuyer = { ...contract.buyer, ...args.buyer };

    await ctx.db.patch(args.contractId, {
      buyer: mergedBuyer,
      updatedAt: Date.now(),
    });
  },
});

export const updateVehicle = mutation({
  args: {
    contractId: v.id("contracts"),
    vehicle: v.object(vehicleInput),
  },
  handler: async (ctx, args) => {
    const contract = await getOwnedContractOrThrow(ctx, args.contractId);
    const mergedVehicle = { ...contract.vehicle, ...args.vehicle };

    await ctx.db.patch(args.contractId, {
      vehicle: mergedVehicle,
      updatedAt: Date.now(),
    });
  },
});

export const updateSaleTerms = mutation({
  args: {
    contractId: v.id("contracts"),
    saleTerms: v.object(saleTermsInput),
  },
  handler: async (ctx, args) => {
    const contract = await getOwnedContractOrThrow(ctx, args.contractId);
    const mergedSaleTerms = { ...contract.saleTerms, ...args.saleTerms };

    await ctx.db.patch(args.contractId, {
      saleTerms: mergedSaleTerms,
      updatedAt: Date.now(),
    });
  },
});

export const updateDeclarations = mutation({
  args: {
    contractId: v.id("contracts"),
    declarations: v.object(declarationsInput),
  },
  handler: async (ctx, args) => {
    const contract = await getOwnedContractOrThrow(ctx, args.contractId);
    const mergedDeclarations = { ...contract.declarations, ...args.declarations };

    await ctx.db.patch(args.contractId, {
      declarations: mergedDeclarations,
      updatedAt: Date.now(),
    });
  },
});
