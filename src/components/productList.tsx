"use client";

import {
  CreateProductMutation,
  CreateProductMutationVariables,
  DeleteProductMutation,
  DeleteProductMutationVariables,
  GetAllProductsQuery,
  GetAllProductsQueryVariables,
  GetProductQuery,
  GetProductQueryVariables,
  Product,
  UpdateProductInput,
  UpdateProductMutation,
  UpdateProductMutationVariables,
} from "@/graphql/__generated__/types";
import {
  GET_ALL_PRODUCTS,
  DELETE_PRODUCT,
  GET_PRODUCT,
  UPDATE_PRODUCT,
  CREATE_PRODUCT,
} from "@/services/fetchService";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import Swal from "sweetalert2"; // Optional for better alerts

export default function ProductList() {
  const { data, loading, error, refetch } = useQuery<
    GetAllProductsQuery,
    GetAllProductsQueryVariables
  >(GET_ALL_PRODUCTS);
  const [createProduct] = useMutation<
    CreateProductMutation,
    CreateProductMutationVariables
  >(CREATE_PRODUCT);

  const [deleteProduct] = useMutation<
    DeleteProductMutation,
    DeleteProductMutationVariables
  >(DELETE_PRODUCT);
  const [getProduct] = useLazyQuery<GetProductQuery, GetProductQueryVariables>(
    GET_PRODUCT
  );
  const [updateProduct] = useMutation<
    UpdateProductMutation,
    UpdateProductMutationVariables
  >(UPDATE_PRODUCT);
  const handleCreate = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Create Product",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" />
        <textarea id="swal-desc" class="swal2-textarea" placeholder="Description"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Create",
      preConfirm: () => {
        const name = (document.getElementById("swal-name") as HTMLInputElement)
          .value;
        const desc = (
          document.getElementById("swal-desc") as HTMLTextAreaElement
        ).value;

        if (!name || !desc) {
          Swal.showValidationMessage("Both fields are required");
          return null;
        }

        return { name, desc };
      },
    });

    if (formValues) {
      try {
        await createProduct({ variables: { data: formValues } });
        await refetch();
        Swal.fire("Created!", "Product has been added.", "success");
      } catch (err: any) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const { data } = await getProduct({ variables: { id } });
      const product = data?.product;
      if (product) {
        Swal.fire({
          title: product.name,
          html: `
          <p><strong>ID:</strong> ${product.id}</p>
            <p><strong>Description:</strong> ${product.desc}</p>
            <p><strong>Created:</strong> ${new Date(
              product.createdAt
            ).toLocaleString()}</p>
            <p><strong>Updated:</strong> ${new Date(
              product.updatedAt
            ).toLocaleString()}</p>
          `,
          icon: "info",
        });
      } else {
        Swal.fire("Not found", "Product details not available", "error");
      }
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmed.isConfirmed) {
      try {
        await deleteProduct({
          variables: { id },
        });
        await refetch(); // Refresh the list after deletion
        Swal.fire("Deleted!", "Product has been removed.", "success");
      } catch (err: any) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };
  const handleUpdate = async (product: Product) => {
    if (!product) {
      Swal.fire("Error", "Product not found", "error");
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: "Update Product",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Name" value="${product.name}" />
        <textarea id="swal-desc" class="swal2-textarea" placeholder="Description">${product.desc}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        const name = (document.getElementById("swal-name") as HTMLInputElement)
          .value;
        const desc = (
          document.getElementById("swal-desc") as HTMLTextAreaElement
        ).value;

        if (!name || !desc) {
          Swal.showValidationMessage("Both fields are required");
          return null;
        }

        return { name, desc };
      },
    });

    if (formValues) {
      const updatedData: Partial<UpdateProductInput> = {};

      if (formValues.name !== product.name) {
        updatedData.name = formValues.name;
      }
      if (formValues.desc !== product.desc) {
        updatedData.desc = formValues.desc;
      }

      // Only send update if at least one field changed
      if (Object.keys(updatedData).length === 0) {
        Swal.fire("No changes", "Nothing was updated", "info");
        return;
      }

      try {
        await updateProduct({
          variables: {
            id: product.id,
            data: updatedData,
          },
        });
        await refetch();
        Swal.fire("Updated!", "Product has been updated.", "success");
      } catch (err: any) {
        Swal.fire("Error", err.message, "error");
      }
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="mb-4">
        <button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
        >
          + Create Product
        </button>
      </div>
      <ul>
        {data?.products?.map((product) =>
          product ? (
            <li key={product.id} className="mb-2">
              <strong>{product.name}</strong>: {product.desc}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => handleViewDetails(product.id)}
                  className="text-blue-500 hover:underline"
                >
                  View
                </button>
                <button
                  onClick={() => handleUpdate(product as Product)}
                  className="text-green-500 hover:underline"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ) : null
        )}
      </ul>
    </>
  );
}
