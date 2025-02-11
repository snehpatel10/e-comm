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
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params.id);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(productData?.description || "");
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);
  
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category || "");
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully");
      setImage(res.image);
    } catch (err) {
      toast.error("Failed to upload image");
    }
  };

  const validateFields = () => {
    let tempErrors = {};
    let formIsValid = true;

    if (!name) {
      formIsValid = false;
      tempErrors.name = "Name is required.";
    }
    if (!price || isNaN(price) || price < 0) {
      formIsValid = false;
      tempErrors.price = "Price must be a number greater than or equal to 0.";
    }
    if (!quantity || isNaN(quantity) || quantity < 0) {
      formIsValid = false;
      tempErrors.quantity = "Quantity must be a number greater than or equal to 0.";
    }
    if (!stock || isNaN(stock) || stock < 0) {
      formIsValid = false;
      tempErrors.stock = "Purchase limit must be a number greater than or equal to 0.";
    }
    if (!category) {
      formIsValid = false;
      tempErrors.category = "Category is required.";
    }
    if (!description) {
      formIsValid = false;
      tempErrors.description = "Description is required.";
    }

    setErrors(tempErrors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validateFields()) {
      return; // If validation fails, don't submit the form
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      const data = await updateProduct({ productId: params.id, formData });

      if (data?.error) {
        toast.error(data.error);
      } else {
        toast.success("Product updated successfully");
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm("Are you sure you want to delete this product?");
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" deleted successfully`);
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12">Update / Delete Product</div>

          {image && (
            <div className="text-center">
              <img
                src={image}
                alt="product"
                className="block mx-auto max-h-[200px] mb-4"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="border text-white px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11">
              {image ? image.name : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          <div className="p-3">
            {/* Name and Price */}
            <div className="flex flex-wrap justify-between">
              <div className="w-[48%]">
                <label htmlFor="name" className="text-white">Name</label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
              </div>
              <div className="w-[48%]">
                <label htmlFor="price" className="text-white">Price</label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                {errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}
              </div>
            </div>

            {/* Quantity and Brand */}
            <div className="flex flex-wrap justify-between">
              <div className="w-[48%]">
                <label htmlFor="quantity" className="text-white">Quantity</label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                {errors.quantity && <div className="text-red-500 text-sm">{errors.quantity}</div>}
              </div>
              <div className="w-[48%]">
                <label htmlFor="brand" className="text-white">Brand</label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="" className="my-5">Description</label>
            <textarea
              className="p-2 mb-3 bg-[#101011] border rounded-lg w-full text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}

            <div className="flex flex-wrap justify-between">
              <div className="w-[48%]">
                <label htmlFor="stock" className="text-white">Purchase limit</label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
                {errors.stock && <div className="text-red-500 text-sm">{errors.stock}</div>}
              </div>
              <div className="w-[48%]">
                <label htmlFor="category" className="text-white">Category</label>
                <select
                  className="p-4 mb-3 w-full border rounded-lg bg-[#101011] text-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category && <div className="text-red-500 text-sm">{errors.category}</div>}
              </div>
            </div>

            <div className="mt-5 flex justify-between">
              <button
                onClick={handleSubmit}
                className="py-4 px-10 rounded-lg text-lg font-bold bg-green-600"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="py-4 px-10 rounded-lg text-lg font-bold bg-pink-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
