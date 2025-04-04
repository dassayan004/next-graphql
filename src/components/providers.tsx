"use client";
import * as React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "@/services/apollo";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
