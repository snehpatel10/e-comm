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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);


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
    if (!productData || !productData.name) {
      toast.error("Product data is not available.");
      return;
    }
    try {
      const { data } = await deleteProduct(params.id); 
      toast.success(`"${data.name}" deleted successfully`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container xl:ml-[10rem] sm:ml-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12 text-xl">Update / Delete Product</div>

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
            <label className=" text-white px-4 block w-full text-center rounded-lg font-bold py-11">
              {image ? image.name : "Upload Image"}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="file-input file-input-bordered text-white"
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
                  className="p-4 mb-3 w-full border rounded-lg input input-bordered text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
              </div>
              <div className="w-[48%]">
                <label htmlFor="price" className="text-white">Price</label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg input input-bordered text-white"
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
                  className="p-4 mb-3 w-full border rounded-lg input input-bordered text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                {errors.quantity && <div className="text-red-500 text-sm">{errors.quantity}</div>}
              </div>
              <div className="w-[48%]">
                <label htmlFor="brand" className="text-white">Brand</label>
                <input
                  type="text"
                  className="p-4 mb-3 w-full border rounded-lg input input-bordered text-white"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>

            <label htmlFor="" className="my-5">Description</label>
            <textarea
              className="p-2 mb-3 textarea textarea-bordered border rounded-lg w-full text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}

            <div className="flex flex-wrap justify-between">
              <div className="w-[48%]">
                <label htmlFor="stock" className="text-white">Purchase limit</label>
                <input
                  type="number"
                  className="p-4 mb-3 w-full border rounded-lg input input-bordered text-white"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
                {errors.stock && <div className="text-red-500 text-sm">{errors.stock}</div>}
              </div>
              <div className="w-[48%]">
                <label htmlFor="category" className="text-white">Category</label>
                <select
                  className=" mb-3 w-full border rounded-lg select select-bordered text-white"
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
                className=" rounded-lg btn btn-success text-lg font-bold "
              >
                Update
              </button>
              {productData && (
                <button
                  onClick={() => setIsModalOpen(true)} 
                  className="btn btn-primary rounded-lg text-lg font-bold text-white"
                >
                  Delete
                </button>
              )}

            </div>
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 flex justify-center items-center z-50 x bg-opacity-50">
              <div className="modal modal-open">
                <div className="modal-box bg-[#434343] text-white p-6 rounded-lg">
                  <h2 className="text-lg">Are you sure you want to delete this product?</h2>
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      className="btn btn-secondary border-none text-sm text-white px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
                      onClick={() => setIsModalOpen(false)}  // Close modal
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-danger border-none text-sm text-white px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                      onClick={() => {
                        handleDelete();
                        setIsModalOpen(false);  // Close modal after deletion
                      }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
