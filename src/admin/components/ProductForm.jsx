// src/admin/components/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { FiUpload, FiX, FiPlus } from "react-icons/fi";
import { ButtonSpinner } from "../../components/LoadingSkeleton";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import toast from "react-hot-toast";

const ProductForm = ({ product = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    short_description: "",
    category: "",
    brand: "",
    price: "",
    discount_price: "",
    stock_quantity: "",
    sku: "",
    tags: "",
    colors: "",
    sizes: "",
    featured: false,
    images: [],
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        short_description: product.short_description || "",
        category: product.category || "",
        brand: product.brand || "",
        price: product.price || "",
        discount_price: product.discount_price || "",
        stock_quantity: product.stock_quantity || "",
        sku: product.sku || "",
        tags: product.tags?.join(", ") || "",
        colors: product.colors?.join(", ") || "",
        sizes: product.sizes?.join(", ") || "",
        featured: product.featured || false,
        images: product.images || [],
      });
      setImagePreview(product.images?.map((img) => img.url) || []);
    }
  }, [product]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      setCategories(res.data);
    } catch (error) {
      console.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const newImages = Array.from(files);
      const previews = newImages.map((file) => URL.createObjectURL(file));
      setImagePreview((prev) => [...prev, ...previews]);

      const imageObjects = newImages.map((file, index) => ({
        id: `product_image_${Date.now()}_${index}`,
        name_id: `product_image_${Date.now()}_${index}`,
        url: URL.createObjectURL(file),
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageObjects],
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRemoveImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.stock_quantity || formData.stock_quantity < 0)
      newErrors.stock_quantity = "Valid stock quantity is required";
    if (!formData.images.length)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors", {
        id: "form_validation_error",
        name_id: "form_validation_error",
      });
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        name_id: formData.name.toLowerCase().replace(/\s+/g, "_"),
        slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        colors: formData.colors
          .split(",")
          .map((color) => color.trim())
          .filter(Boolean),
        sizes: formData.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),
        price: parseFloat(formData.price),
        discount_price: formData.discount_price
          ? parseFloat(formData.discount_price)
          : null,
        stock_quantity: parseInt(formData.stock_quantity),
        rating: product?.rating || 0,
        reviews: product?.reviews || [],
        thumbnail: formData.images[0]?.url || "",
        created_at: product?.created_at || new Date().toISOString(),
      };

      if (product?.id) {
        await productService.updateProduct(product.id, productData);
      } else {
        await productService.createProduct(productData);
      }

      onSave();
    } catch (error) {
      toast.error("Failed to save product", {
        id: "product_save_error",
        name_id: "product_save_error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    {
      id: "product_name_field",
      name: "name",
      label: "Product Name *",
      type: "text",
      placeholder: "Enter product name",
    },
    {
      id: "product_description_field",
      name: "description",
      label: "Description *",
      type: "textarea",
      placeholder: "Enter product description",
      rows: 4,
    },
    {
      id: "product_short_description_field",
      name: "short_description",
      label: "Short Description",
      type: "text",
      placeholder: "Brief product description",
    },
    {
      id: "product_category_field",
      name: "category",
      label: "Category *",
      type: "select",
      options: categories.map((cat) => ({ value: cat.slug, label: cat.name })),
    },
    {
      id: "product_brand_field",
      name: "brand",
      label: "Brand",
      type: "text",
      placeholder: "Enter brand name",
    },
    {
      id: "product_price_field",
      name: "price",
      label: "Price (₦) *",
      type: "number",
      placeholder: "0",
      min: 0,
    },
    {
      id: "product_discount_price_field",
      name: "discount_price",
      label: "Discount Price (₦)",
      type: "number",
      placeholder: "0",
      min: 0,
    },
    {
      id: "product_stock_field",
      name: "stock_quantity",
      label: "Stock Quantity *",
      type: "number",
      placeholder: "0",
      min: 0,
    },
    {
      id: "product_sku_field",
      name: "sku",
      label: "SKU",
      type: "text",
      placeholder: "Enter SKU",
    },
    {
      id: "product_tags_field",
      name: "tags",
      label: "Tags (comma-separated)",
      type: "text",
      placeholder: "e.g., wireless, headphones, audio",
    },
    {
      id: "product_colors_field",
      name: "colors",
      label: "Colors (comma-separated)",
      type: "text",
      placeholder: "e.g., Black, White, Blue",
    },
    {
      id: "product_sizes_field",
      name: "sizes",
      label: "Sizes (comma-separated)",
      type: "text",
      placeholder: "e.g., S, M, L, XL",
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      id="product_form"
      name_id="product_form"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {formFields.map((field) => (
          <div
            key={field.name}
            id={field.id}
            name_id={field.id}
            className={field.type === "textarea" ? "md:col-span-2" : ""}
          >
            <label
              htmlFor={field.name}
              id={`${field.name}_label`}
              name_id={`${field.name}_label`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {field.label}
            </label>

            {field.type === "select" ? (
              <select
                name={field.name}
                id={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${
                  errors[field.name]
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">Select {field.label}</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                name={field.name}
                id={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                rows={field.rows || 3}
                placeholder={field.placeholder}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${
                  errors[field.name]
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                min={field.min}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white ${
                  errors[field.name]
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
            )}

            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}

        {/* Image Upload */}
        <div className="md:col-span-2">
          <label
            id="product_images_label"
            name_id="product_images_label"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Product Images *
          </label>

          <div className="grid grid-cols-4 gap-4 mb-4">
            {imagePreview.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  id={`product_img_preview_${index}`}
                  name_id={`product_img_preview_${index}`}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  id={`remove_image_${index}`}
                  name_id={`remove_image_${index}`}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}

            <label
              id="upload_image_button"
              name_id="upload_image_button"
              className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors"
            >
              <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload Image</span>
              <input
                type="file"
                id="product_images_input"
                name_id="product_images_input"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>

          {errors.images && (
            <p className="text-red-500 text-xs">{errors.images}</p>
          )}
        </div>

        {/* Featured Toggle */}
        <div className="md:col-span-2">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="featured"
              id="product_featured_checkbox"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Feature this product
            </span>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          id="cancel_product_button"
          name_id="cancel_product_button"
          className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          id="save_product_button"
          name_id="save_product_button"
          className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          {loading ? (
            <ButtonSpinner />
          ) : (
            <>
              <FiPlus className="w-4 h-4" />
              <span>{product ? "Update Product" : "Add Product"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
