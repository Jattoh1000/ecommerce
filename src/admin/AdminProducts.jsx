// src/admin/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiEye, 
  FiCopy,
  FiStar,
  FiToggleLeft,
  FiToggleRight,
  FiPackage,
  FiTag
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AdminTable from './components/AdminTable';
import Modal from '../components/Modal';
import ProductForm from './components/ProductForm';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const ITEMS_PER_PAGE = 10;
  
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]);
  
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getAllProducts();
      let data = res.data;
      
      // Apply search filter
      if (searchQuery) {
        data = data.filter(product => 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Paginate
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      setProducts(paginatedData);
      setTotalProducts(data.length);
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
    } catch (error) {
      toast.error('Failed to load products', {
        id: "products_error_toast",
        name_id: "products_error_toast"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };
  
  const handleSort = (key, direction) => {
    const sorted = [...products].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    setProducts(sorted);
  };
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };
  
  const handleDelete = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await productService.deleteProduct(product.id);
        toast.success('Product deleted successfully', {
          id: "product_delete_success",
          name_id: "product_delete_success"
        });
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product', {
          id: "product_delete_error",
          name_id: "product_delete_error"
        });
      }
    }
  };
  
  const handleView = (product) => {
    window.open(`/products/${product.slug}`, '_blank');
  };
  
  const handleToggleFeatured = async (product) => {
    try {
      await productService.updateProduct(product.id, {
        ...product,
        featured: !product.featured
      });
      toast.success(`Product ${product.featured ? 'removed from' : 'added to'} featured`, {
        id: "product_featured_toggle",
        name_id: "product_featured_toggle"
      });
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product', {
        id: "product_update_error",
        name_id: "product_update_error"
      });
    }
  };
  
  const handleDuplicate = async (product) => {
    try {
      const newProduct = {
        ...product,
        id: undefined,
        name_id: undefined,
        name: `${product.name} (Copy)`,
        slug: `${product.slug}-copy`,
        sku: `${product.sku}-COPY`,
        created_at: new Date().toISOString()
      };
      await productService.createProduct(newProduct);
      toast.success('Product duplicated successfully', {
        id: "product_duplicate_success",
        name_id: "product_duplicate_success"
      });
      fetchProducts();
    } catch (error) {
      toast.error('Failed to duplicate product', {
        id: "product_duplicate_error",
        name_id: "product_duplicate_error"
      });
    }
  };
  
  const handleModalClose = () => {
    setShowModal(false);
    setEditingProduct(null);
  };
  
  const handleProductSaved = () => {
    handleModalClose();
    fetchProducts();
    toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully', {
      id: "product_saved_toast",
      name_id: "product_saved_toast"
    });
  };
  
  // Table Columns Configuration
  const columns = [
    {
      key: 'product',
      label: 'Product',
      sortable: true,
      render: (_, product) => (
        <div className="flex items-center space-x-3">
          <img
            id={`product_thumb_${product.id}`}
            name_id={`product_thumb_${product.id}`}
            src={product.thumbnail}
            alt={product.name}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
          />
          <div className="min-w-0">
            <p 
              id={`product_name_${product.id}`}
              name_id={`product_name_${product.id}`}
              className="text-sm font-semibold text-gray-900 dark:text-white truncate"
            >
              {product.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SKU: {product.sku}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value) => (
        <span 
          id={`category_badge_${value}`}
          name_id={`category_badge_${value}`}
          className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full capitalize"
        >
          {value}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (_, product) => (
        <div>
          {product.discount_price ? (
            <div>
              <span 
                id={`discount_price_${product.id}`}
                name_id={`discount_price_${product.id}`}
                className="text-sm font-bold text-primary-600 dark:text-primary-400"
              >
                ₦{product.discount_price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 line-through ml-2">
                ₦{product.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              ₦{product.price.toLocaleString()}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'stock_quantity',
      label: 'Stock',
      sortable: true,
      render: (value) => (
        <span className={`
          px-2 py-1 text-xs font-semibold rounded-full
          ${value > 20 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
            : value > 0 
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }
        `}>
          {value > 0 ? `${value} in stock` : 'Out of stock'}
        </span>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-1">
          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'featured',
      label: 'Featured',
      sortable: true,
      render: (value, product) => (
        <button
          onClick={() => handleToggleFeatured(product)}
          id={`featured_toggle_${product.id}`}
          name_id={`featured_toggle_${product.id}`}
          className="transition-colors"
          title={value ? 'Remove from featured' : 'Add to featured'}
        >
          {value ? (
            <FiToggleRight className="w-6 h-6 text-primary-600" />
          ) : (
            <FiToggleLeft className="w-6 h-6 text-gray-400" />
          )}
        </button>
      )
    }
  ];
  
  // Custom Actions
  const customActions = [
    {
      label: 'Duplicate',
      icon: FiCopy,
      onClick: handleDuplicate
    },
    {
      label: 'View Product',
      icon: FiEye,
      onClick: handleView
    }
  ];
  
  // Add Button Component
  const addButton = (
    <button
      onClick={() => {
        setEditingProduct(null);
        setShowModal(true);
      }}
      id="add_product_button"
      name_id="add_product_button"
      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm font-medium"
    >
      <FiPlus className="w-4 h-4" />
      <span>Add Product</span>
    </button>
  );
  
  return (
    <div 
      id="admin_products_page" 
      name_id="admin_products_page"
      className="p-6"
    >
      {/* Page Header */}
      <div 
        id="page_header" 
        name_id="page_header"
        className="mb-6"
      >
        <h1 
          id="page_title" 
          name_id="page_title"
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
        >
          Products Management
        </h1>
        <p 
          id="page_description" 
          name_id="page_description"
          className="text-gray-500 dark:text-gray-400"
        >
          Manage your product inventory, add new products, and update existing ones.
        </p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { 
            id: "total_products_stat", 
            name_id: "total_products_stat",
            label: 'Total Products', 
            value: totalProducts, 
            icon: FiPackage, 
            color: 'bg-blue-500' 
          },
          { 
            id: "active_products_stat", 
            name_id: "active_products_stat",
            label: 'Active Products', 
            value: products.filter(p => p.stock_quantity > 0).length, 
            icon: FiTag, 
            color: 'bg-green-500' 
          },
          { 
            id: "out_of_stock_stat", 
            name_id: "out_of_stock_stat",
            label: 'Out of Stock', 
            value: products.filter(p => p.stock_quantity === 0).length, 
            icon: FiPackage, 
            color: 'bg-red-500' 
          },
          { 
            id: "featured_products_stat", 
            name_id: "featured_products_stat",
            label: 'Featured', 
            value: products.filter(p => p.featured).length, 
            icon: FiStar, 
            color: 'bg-yellow-500' 
          }
        ].map(stat => (
          <div
            key={stat.id}
            id={stat.id}
            name_id={stat.name_id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center space-x-4"
          >
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Products Table */}
      <AdminTable
        title="All Products"
        columns={columns}
        data={products}
        loading={loading}
        totalItems={totalProducts}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        customActions={customActions}
        addButton={addButton}
        searchable={true}
        sortable={true}
        selectable={true}
        exportable={true}
        itemsPerPage={ITEMS_PER_PAGE}
        emptyMessage="No products found"
      />
      
      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        size="xl"
      >
        <ProductForm
          product={editingProduct}
          onSave={handleProductSaved}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default AdminProducts;