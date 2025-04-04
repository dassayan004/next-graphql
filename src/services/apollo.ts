import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:5000/graphql", // Replace with your NestJS GraphQL endpoint
    credentials: "include", // If using cookies/authentication
  }),
  cache: new InMemoryCache(),
});

export default client;
