// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiShoppingCart, FiMinus, FiPlus } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import { PageLoader } from "../components/LoadingSkeleton";
import api from "../services/api";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const productsRes = await api.get("/products");
      const foundProduct = productsRes.data.find((p) => p.slug === slug);

      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedColor(foundProduct.colors[0] || "Default");
        setSelectedSize(foundProduct.sizes[0] || "Standard");

        // Get related products
        const related = productsRes.data
          .filter(
            (p) =>
              p.category === foundProduct.category && p.id !== foundProduct.id,
          )
          .slice(0, 4);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageZoom = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize);
  };

  if (loading) return <PageLoader />;
  if (!product)
    return <div className="text-center py-16">Product not found</div>;

  return (
    <div
      id="product_detail_page"
      name_id="product_detail_page"
      className="min-h-screen bg-white dark:bg-gray-900 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-xl mb-4">
              <img
                id="product_main_image"
                name_id="product_main_image"
                src={product.images[selectedImage]?.url}
                alt={product.name}
                className={`w-full h-96 object-cover cursor-zoom-in transition-transform duration-300 ${
                  isZoomed ? "scale-150" : ""
                }`}
                onMouseMove={isZoomed ? handleImageZoom : undefined}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : {}
                }
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  id={`thumbnail_button_${image.id}`}
                  name_id={`thumbnail_button_${image.id}`}
                  className={`border-2 rounded-lg overflow-hidden ${
                    selectedImage === index
                      ? "border-primary-600"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    id={`thumbnail_image_${image.id}`}
                    name_id={`thumbnail_image_${image.id}`}
                    src={image.url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1
              id="product_title"
              name_id="product_title"
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="w-5 h-5 text-yellow-400" />
              ))}
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                {product.rating} ({product.reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {product.discount_price ? (
                <div className="flex items-center space-x-4">
                  <span
                    id="discount_price"
                    name_id="discount_price"
                    className="text-4xl font-bold text-primary-600 dark:text-primary-400"
                  >
                    ₦{product.discount_price.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <span
                    id="save_badge"
                    name_id="save_badge"
                    className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-3 py-1 rounded-lg font-semibold"
                  >
                    Save ₦
                    {(product.price - product.discount_price).toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ₦{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p
              id="product_description"
              name_id="product_description"
              className="text-gray-600 dark:text-gray-300 mb-6"
            >
              {product.description}
            </p>

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="mb-4">
                <label
                  id="color_label"
                  name_id="color_label"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Color: {selectedColor}
                </label>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      id={`color_button_${color.toLowerCase()}`}
                      name_id={`color_button_${color.toLowerCase()}`}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? "border-primary-600 bg-primary-50 dark:bg-primary-900 text-primary-600"
                          : "border-gray-300 dark:border-gray-600 hover:border-primary-400 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="mb-6">
                <label
                  id="size_label"
                  name_id="size_label"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Size: {selectedSize}
                </label>
                <div className="flex space-x-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      id={`size_button_${size.toLowerCase()}`}
                      name_id={`size_button_${size.toLowerCase()}`}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        selectedSize === size
                          ? "border-primary-600 bg-primary-50 dark:bg-primary-900 text-primary-600"
                          : "border-gray-300 dark:border-gray-600 hover:border-primary-400 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label
                id="quantity_label"
                name_id="quantity_label"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  id="quantity_decrease_button"
                  name_id="quantity_decrease_button"
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span
                  id="quantity_display"
                  name_id="quantity_display"
                  className="text-xl font-semibold text-gray-900 dark:text-white w-12 text-center"
                >
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  id="quantity_increase_button"
                  name_id="quantity_increase_button"
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              id="add_to_cart_detail_button"
              name_id="add_to_cart_detail_button"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-all hover:shadow-lg active:scale-95 mb-4"
            >
              <FiShoppingCart className="w-6 h-6" />
              <span>
                Add to Cart - ₦
                {(
                  (product.discount_price || product.price) * quantity
                ).toLocaleString()}
              </span>
            </button>

            {/* Additional Info */}
            <div className="border-t dark:border-gray-700 pt-4 space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">SKU:</span> {product.sku}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Category:</span>{" "}
                {product.category}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Brand:</span> {product.brand}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Stock:</span>{" "}
                {product.stock_quantity} available
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16">
          <h2
            id="reviews_title"
            name_id="reviews_title"
            className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Customer Reviews
          </h2>

          {product.reviews.length > 0 ? (
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  id={`review_card_${review.id}`}
                  name_id={`review_card_${review.id}`}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {review.user}
                      </p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2
              id="related_products_title"
              name_id="related_products_title"
              className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
