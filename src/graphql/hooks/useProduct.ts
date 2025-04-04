import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import Swal from "sweetalert2";

import type {
  GetAllProductsQuery,
  GetAllProductsQueryVariables,
  GetProductQuery,
  GetProductQueryVariables,
  CreateProductMutation,
  CreateProductMutationVariables,
  DeleteProductMutation,
  DeleteProductMutationVariables,
  UpdateProductMutation,
  UpdateProductMutationVariables,
} from "../__generated__/types";
import {
  GET_ALL_PRODUCTS,
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
  GET_PRODUCT,
} from "@/services/fetchService";

export const useProducts = () => {
  const { data, loading, error, refetch } = useQuery<
    GetAllProductsQuery,
    GetAllProductsQueryVariables
  >(GET_ALL_PRODUCTS);

  const [createProductMutation, { loading: creating }] = useMutation<
    CreateProductMutation,
    CreateProductMutationVariables
  >(CREATE_PRODUCT, {
    onCompleted: () => {
      refetch();
      Swal.fire("Created!", "Product has been added.", "success");
    },
    onError: (error) => {
      Swal.fire("Error", error.message, "error");
    },
  });

  const [deleteProductMutation, { loading: deleting }] = useMutation<
    DeleteProductMutation,
    DeleteProductMutationVariables
  >(DELETE_PRODUCT, {
    onCompleted: () => {
      refetch();
      Swal.fire("Deleted!", "Product has been removed.", "success");
    },
    onError: (error) => {
      Swal.fire("Error", error.message, "error");
    },
  });

  const [updateProductMutation, { loading: updating }] = useMutation<
    UpdateProductMutation,
    UpdateProductMutationVariables
  >(UPDATE_PRODUCT, {
    onCompleted: () => {
      refetch();
      Swal.fire("Updated!", "Product has been updated.", "success");
    },
    onError: (error) => {
      Swal.fire("Error", error.message, "error");
    },
  });

  const [getProductLazy, { loading: fetchingOne }] = useLazyQuery<
    GetProductQuery,
    GetProductQueryVariables
  >(GET_PRODUCT);

  return {
    products: data?.products || [],
    loadingAll: loading,
    error,
    refetch,
    createProduct: createProductMutation,
    createLoading: creating,
    deleteProduct: deleteProductMutation,
    deleteLoading: deleting,
    updateProduct: updateProductMutation,
    updateLoading: updating,
    getProduct: getProductLazy,
    getProductLoading: fetchingOne,
  };
};
