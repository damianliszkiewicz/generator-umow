"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function useClerkConvexAuth() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  return {
    isLoading: !isLoaded,
    isAuthenticated: !!isSignedIn,
    fetchAccessToken: async () => (await getToken({ template: "convex" })) ?? null,
  };
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithAuth client={convex} useAuth={useClerkConvexAuth}>
      {children}
    </ConvexProviderWithAuth>
  );
}
