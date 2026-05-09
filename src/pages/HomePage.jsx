// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ProductSkeleton } from "../components/LoadingSkeleton";
import api from "../services/api";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, bannersRes] = await Promise.all([
        api.get("/products"),
        api.get("/categories"),
        api.get("/banners"),
      ]);

      setProducts(productsRes.data.filter((p) => p.featured).slice(0, 8));
      setCategories(categoriesRes.data);
      setBanners(bannersRes.data.filter((b) => b.active));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="homepage" name_id="homepage" className="min-h-screen">
      {/* Hero Section */}
      <section
        id="hero_section"
        name_id="hero_section"
        className="relative bg-gradient-to-r from-primary-600 to-primary-800 dark:from-gray-800 dark:to-gray-900 text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-slide-up">
              <h1
                id="hero_title"
                name_id="hero_title"
                className="text-4xl md:text-6xl font-bold mb-4"
              >
                Shop the Latest Trends
              </h1>
              <p
                id="hero_subtitle"
                name_id="hero_subtitle"
                className="text-xl mb-8 text-primary-100"
              >
                Discover amazing products at unbeatable prices. Free shipping on
                orders over ₦50,000!
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/products"
                  id="shop_now_button"
                  name_id="shop_now_button"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold hover:bg-primary-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Shop Now
                </Link>
                <Link
                  to="/deals"
                  id="view_deals_button"
                  name_id="view_deals_button"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  View Deals
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                id="hero_image"
                name_id="hero_image"
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600"
                alt="Shopping"
                className="rounded-lg shadow-2xl animate-fade-in"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section
        id="categories_section"
        name_id="categories_section"
        className="py-16 bg-gray-50 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="categories_title"
            name_id="categories_title"
            className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
          >
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                id={`category_card_${category.id}`}
                name_id={`category_card_${category.id}`}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-all transform hover:scale-105 group"
              >
                <img
                  id={`category_image_${category.id}`}
                  name_id={`category_image_${category.id}`}
                  src={category.image}
                  alt={category.name}
                  className="w-16 h-16 mx-auto mb-3 rounded-full object-cover"
                />
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.product_count} Products
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        id="featured_products_section"
        name_id="featured_products_section"
        className="py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2
              id="featured_products_title"
              name_id="featured_products_title"
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              Featured Products
            </h2>
            <Link
              to="/products"
              id="view_all_products_link"
              name_id="view_all_products_link"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
              : products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section
        id="promo_section"
        name_id="promo_section"
        className="py-16 bg-gradient-to-r from-purple-600 to-pink-600"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Flash Sale! 50% Off</h2>
          <p className="text-xl mb-8">
            Limited time offer on selected items. Don't miss out!
          </p>
          <Link
            to="/flash-sale"
            id="flash_sale_button"
            name_id="flash_sale_button"
            className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors"
          >
            Shop Flash Sale
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
