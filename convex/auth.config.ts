const clerkDomain = process.env.CLERK_JWT_ISSUER_DOMAIN;

if (!clerkDomain) {
  // Convex loads this file at runtime, so fail fast with a clear message.
  throw new Error("CLERK_JWT_ISSUER_DOMAIN is missing.");
}

const authConfig = {
  providers: [
    {
      domain: clerkDomain,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
