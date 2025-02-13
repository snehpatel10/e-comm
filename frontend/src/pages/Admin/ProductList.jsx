import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  useEffect(() => {
      document.body.style.overflowX = "hidden";
      return () => {
        document.body.style.overflowX = "auto";
      };
    }, []);

  // Custom Validation Function
  const validateForm = () => {
    const errors = {};
    if (!image) errors.image = "Image is required";  // Added validation for image
    if (!name.trim()) errors.name = "Name is required";
    if (!description.trim()) errors.description = "Description is required";
    if (!price || isNaN(price) || price < 0) errors.price = "Price must be a number and >= 0";
    if (!quantity || isNaN(quantity) || quantity < 0) errors.quantity = "Quantity must be a number and >= 0";
    if (!stock || isNaN(stock) || stock < 0) errors.stock = "Stock must be a number and >= 0";
    if (!category) errors.category = "Category is required";
    if (!brand.trim()) errors.brand = "Brand is required";

    setErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Only proceed if the form is valid

    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-3">
          <div className="h-12 text-xl">Create Product</div>

          {imageUrl && (
            <div className="text-center">
              <img
                src={imageUrl}
                alt="product"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-3">
            <div className=" text-white px-4 block w-full text-center rounded-lg font-bold py-11">

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={uploadFileHandler}
                className="file-input file-input-bordered text-white"
              />
            </div>
            {errors.image && <div className="text-red-500 text-sm">{errors.image}</div>}  {/* Display image error */}
          </div>

          <div className="p-3">
            {/* Name and Price */}
            <div className="flex flex-wrap justify-between">
              <div className="w-[48%]">
                <label htmlFor="name" className="text-white">
                  Name
                </label>{" "}
                <br />
                <input
                  type="text"
                  className={`p-4 mb-3 w-full border rounded-lg input input-bordered text-white ${errors.name ? 'border-red-500' : ''}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
              </div>
              <div className="w-[48%]">
                <label htmlFor="price" className="text-white">
                  Price
                </label>{" "}
                <br />
                <input
                  type="number"
                  className={`p-4 mb-3 w-full border rounded-lg input input-bordered text-white ${errors.price ? 'border-red-500' : ''}`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                {errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}
              </div>
            </div>

            {/* Quantity and Brand */}
            <div className="flex flex-wrap justify-between">
              <div className="w-[48%]">
                <label htmlFor="quantity" className="text-white">
                  Quantity
                </label>{" "}
                <br />
                <input
                  type="number"
                  className={`p-4 mb-3 w-full border rounded-lg input input-bordered text-white ${errors.quantity ? 'border-red-500' : ''}`}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                {errors.quantity && <div className="text-red-500 text-sm">{errors.quantity}</div>}
              </div>
              <div className="w-[48%]">
                <label htmlFor="brand" className="text-white">
                  Brand
                </label>{" "}
                <br />
                <input
                  type="text"
                  className={`p-4 mb-3 w-full border rounded-lg input input-bordered text-white ${errors.brand ? 'border-red-500' : ''}`}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
                {errors.brand && <div className="text-red-500 text-sm">{errors.brand}</div>}
              </div>
            </div>

            <label htmlFor="" className="my-5">
              Description
            </label>
            <textarea
              type="text"
              className={`p-2 mb-3 textarea textarea-bordered border rounded-lg w-[100%] text-white ${errors.description ? 'border-red-500' : ''}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}

            <div className="flex flex-wrap justify-between">
              <div className="w-[48%]">
                <label htmlFor="stock" className="text-white">
                  Purchase limit
                </label>{" "}
                <br />
                <input
                  type="number"
                  className={`p-4 mb-3 w-full border rounded-lg input input-bordered text-white ${errors.stock ? 'border-red-500' : ''}`}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
                {errors.stock && <div className="text-red-500 text-sm">{errors.stock}</div>}
              </div>
              <div className="w-[48%]">
                <label htmlFor="category" className="text-white">
                  Category
                </label>{" "}
                <br />
                <select
                  id="category"
                  className={` mb-3 w-full border rounded-lg select select-bordered  text-white ${errors.category ? 'border-red-500' : ''}`}
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
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

            <button
              onClick={handleSubmit}
              className=" mt-5 rounded-lg text-lg font-bold btn btn-primary"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
