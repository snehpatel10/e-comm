import React from "react";

const CategoryForm = ({
    value,
    setValue,
    handleSubmit,
    buttonText = "Submit",
    handleDelete,
  }) => {
    return (
      <div className="p-3 mt-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            className="py-3 input input-border bg-white border-gray-400 px-4 border rounded-lg w-full"
            placeholder="Write category name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
  
          <div className="flex justify-between">
            <button className="btn btn-primary text-white py-2 px-4 rounded-lg ">
              {buttonText}
            </button>
  
            {handleDelete && (
              <button
                onClick={handleDelete}
                className="btn btn-error text-white py-2 px-4 rounded-lg "
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };
  
  export default CategoryForm;