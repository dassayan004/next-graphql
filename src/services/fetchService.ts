import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products {
      id
      name
      desc
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      desc
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($data: CreateProductInput!) {
    createProduct(data: $data) {
      id
      name
      desc
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $data: UpdateProductInput!) {
    updateProduct(id: $id, data: $data) {
      id
      name
      desc
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    removeProduct(id: $id) {
      id
      name
      desc
    }
  }
`;
