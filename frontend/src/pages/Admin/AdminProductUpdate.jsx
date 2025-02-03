import React, { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const { _id: productId } = useParams(); // Destructure params to ensure the _id exists

  // Fetch product data
  const { data: productData, isLoading, isError } = useGetProductByIdQuery(productId);

  // Initialize state
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");

  // Hooks
  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Populate form with product data
  useEffect(() => {
    if (productData && productData._id) {
      setImage(productData.image);
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id || "");
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setStock(productData.countInStock);
    }
  }, [productData]);

  // Upload image handler
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully!");
      setImage(res.image);
    } catch (err) {
      toast.error("Failed to upload image. Please try again.");
    }
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedProduct = {
        image,
        name,
        description,
        price,
        category,
        quantity,
        brand,
        countInStock: stock,
      };

      const res = await updateProduct({ productId, formData: updatedProduct }).unwrap();
      toast.success(`Product "${res.name}" updated successfully!`);
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Failed to update product. Please try again.");
    }
  };

  // Delete product handler
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const res = await deleteProduct(productId).unwrap();
      toast.success(`Product "${res.name}" deleted successfully!`);
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Failed to delete product. Please try again.");
    }
  };

  if (isLoading) return <p>Loading product details...</p>;
  if (isError) return <p>Error fetching product details. Please try again.</p>;

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12">Update / Delete Product</div>

          {image && (
            <div className="text-center">
              <img src={image} alt="product" className="block mx-auto w-full h-[40%]" />
            </div>
          )}

          <div className="mb-3">
            <label className="text-white py-2 px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {image ? image.name : "Upload image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="text-white"
              />
            </label>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-3">
              {/* Name and Price */}
              <div className="flex flex-wrap">
                <div>
                  <label htmlFor="name">Name</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="price">Price</label> <br />
                  <input
                    type="number"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Quantity and Brand */}
              <div className="flex flex-wrap">
                <div>
                  <label htmlFor="quantity">Quantity</label> <br />
                  <input
                    type="number"
                    min="1"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="brand">Brand</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <label htmlFor="description" className="my-5">Description</label>
              <textarea
                type="text"
                className="p-2 mb-3 bg-[#101011] border rounded-lg w-[95%] text-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Stock and Category */}
              <div className="flex justify-between">
                <div>
                  <label htmlFor="stock">Count In Stock</label> <br />
                  <input
                    type="text"
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="category">Category</label> <br />
                  <select
                    className="p-4 mb-3 w-[30rem] border rounded-lg bg-[#101011] text-white mr-[5rem]"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categories?.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit and Delete Buttons */}
              <div className="">
                <button
                  type="submit"
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-green-600 mr-6"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="py-4 px-10 mt-5 rounded-lg text-lg font-bold bg-pink-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
  