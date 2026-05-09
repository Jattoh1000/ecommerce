// src/admin/AdminCategories.jsx
import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiGrid,
  FiPackage,
  FiTag,
  FiImage,
  FiFolder
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AdminTable from './components/AdminTable';
import Modal from '../components/Modal';
import { ButtonSpinner } from '../components/LoadingSkeleton';
import { categoryService } from '../services/categoryService';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
    product_count: 0
  });
  const [formErrors, setFormErrors] = useState({});
  
  const ITEMS_PER_PAGE = 10;
  
  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchQuery]);
  
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAllCategories();
      let data = res.data;
      
      // Apply search filter
      if (searchQuery) {
        data = data.filter(category => 
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Paginate
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      
      setCategories(paginatedData);
      setTotalCategories(data.length);
      setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE));
    } catch (error) {
      toast.error('Failed to load categories', {
        id: "categories_error_toast",
        name_id: "categories_error_toast"
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
    const sorted = [...categories].sort((a, b) => {
      if (direction === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      }
      return a[key] < b[key] ? 1 : -1;
    });
    setCategories(sorted);
  };
  
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      slug: category.slug || '',
      image: category.image || '',
      product_count: category.product_count || 0
    });
    setFormErrors({});
    setShowModal(true);
  };
  
  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      slug: '',
      image: '',
      product_count: 0
    });
    setFormErrors({});
    setShowModal(true);
  };
  
  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
      try {
        await categoryService.deleteCategory(category.id);
        toast.success('Category deleted successfully', {
          id: "category_delete_success",
          name_id: "category_delete_success"
        });
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category', {
          id: "category_delete_error",
          name_id: "category_delete_error"
        });
      }
    }
  };
  
  const handleView = (category) => {
    window.open(`/products?category=${category.slug}`, '_blank');
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
    
    // Auto-generate slug from name
    if (name === 'name') {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Category name is required';
    }
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors', {
        id: "form_validation_error",
        name_id: "form_validation_error"
      });
      return;
    }
    
    setSaving(true);
    
    try {
      const categoryData = {
        ...formData,
        id: editingCategory?.id || `cat_${Date.now()}`,
        name_id: formData.name.toLowerCase().replace(/\s+/g, '_'),
        image: formData.image || 'https://images.unsplash.com/photo-1498049794561-1f5b1ae4aaa5?w=300'
      };
      
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, categoryData);
        toast.success('Category updated successfully', {
          id: "category_update_success",
          name_id: "category_update_success"
        });
      } else {
        await categoryService.createCategory(categoryData);
        toast.success('Category created successfully', {
          id: "category_create_success",
          name_id: "category_create_success"
        });
      }
      
      setShowModal(false);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to save category', {
        id: "category_save_error",
        name_id: "category_save_error"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Table Columns Configuration
  const columns = [
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (_, category) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            {category.image ? (
              <img
                id={`category_thumb_${category.id}`}
                name_id={`category_thumb_${category.id}`}
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FiFolder className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div className="min-w-0">
            <p 
              id={`category_name_${category.id}`}
              name_id={`category_name_${category.id}`}
              className="text-sm font-semibold text-gray-900 dark:text-white truncate"
            >
              {category.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              /{category.slug}
            </p>
          </div>
        </div>
      )
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
      render: (value) => (
        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate">
          {value || 'No description'}
        </p>
      )
    },
    {
      key: 'product_count',
      label: 'Products',
      sortable: true,
      render: (value) => (
        <div className="flex items-center space-x-2">
          <span 
            id={`product_count_badge`}
            name_id={`product_count_badge`}
            className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
          >
            {value || 0} products
          </span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: false,
      render: (_, category) => {
        const isActive = (category.product_count || 0) > 0;
        return (
          <span className={`
            px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center space-x-1
            ${isActive 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }
          `}>
            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span>{isActive ? 'Active' : 'Empty'}</span>
          </span>
        );
      }
    }
  ];
  
  // Add Button Component
  const addButton = (
    <button
      onClick={handleAddNew}
      id="add_category_button"
      name_id="add_category_button"
      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors text-sm font-medium"
    >
      <FiPlus className="w-4 h-4" />
      <span>Add Category</span>
    </button>
  );
  
  return (
    <div 
      id="admin_categories_page" 
      name_id="admin_categories_page"
      className="p-6"
    >
      {/* Page Header */}
      <div 
        id="page_header" 
        name_id="page_header"
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 
              id="page_title" 
              name_id="page_title"
              className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            >
              Categories Management
            </h1>
            <p 
              id="page_description" 
              name_id="page_description"
              className="text-gray-500 dark:text-gray-400"
            >
              Organize your products into categories for better navigation.
            </p>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { 
            id: "total_categories_stat", 
            name_id: "total_categories_stat",
            label: 'Total Categories', 
            value: totalCategories, 
            icon: FiGrid, 
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
          },
          { 
            id: "active_categories_stat", 
            name_id: "active_categories_stat",
            label: 'Active Categories', 
            value: categories.filter(c => (c.product_count || 0) > 0).length, 
            icon: FiTag, 
            color: 'bg-green-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
          },
          { 
            id: "empty_categories_stat", 
            name_id: "empty_categories_stat",
            label: 'Empty Categories', 
            value: categories.filter(c => (c.product_count || 0) === 0).length, 
            icon: FiFolder, 
            color: 'bg-yellow-500',
            bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
          },
          { 
            id: "total_products_stat", 
            name_id: "total_products_stat",
            label: 'Total Products', 
            value: categories.reduce((sum, cat) => sum + (cat.product_count || 0), 0), 
            icon: FiPackage, 
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
          }
        ].map(stat => (
          <div
            key={stat.id}
            id={stat.id}
            name_id={stat.name_id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow"
          >
            <div className={`${stat.bgColor} p-3 rounded-xl`}>
              <stat.icon className={`w-5 h-5 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Categories Table */}
      <AdminTable
        title="All Categories"
        columns={columns}
        data={categories}
        loading={loading}
        totalItems={totalCategories}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onSearch={handleSearch}
        onSort={handleSort}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        addButton={addButton}
        searchable={true}
        sortable={true}
        selectable={true}
        exportable={true}
        itemsPerPage={ITEMS_PER_PAGE}
        emptyMessage="No categories found"
      />
      
      {/* Add/Edit Category Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        size="md"
      >
        <form 
          onSubmit={handleSubmit} 
          id="category_form" 
          name_id="category_form"
          className="space-y-5"
        >
          {/* Category Name */}
          <div id="category_name_field" name_id="category_name_field">
            <label 
              htmlFor="category_name_input"
              id="category_name_label"
              name_id="category_name_label"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Category Name *
            </label>
            <input
              type="text"
              id="category_name_input"
              name_id="category_name_input"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="e.g., Electronics, Fashion, Beauty"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors ${
                formErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>
          
          {/* Slug */}
          <div id="category_slug_field" name_id="category_slug_field">
            <label 
              htmlFor="category_slug_input"
              id="category_slug_label"
              name_id="category_slug_label"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Slug *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                /
              </span>
              <input
                type="text"
                id="category_slug_input"
                name_id="category_slug_input"
                name="slug"
                value={formData.slug}
                onChange={handleFormChange}
                placeholder="category-slug"
                className={`w-full pl-7 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors ${
                  formErrors.slug ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>
            {formErrors.slug && (
              <p className="text-red-500 text-xs mt-1">{formErrors.slug}</p>
            )}
          </div>
          
          {/* Description */}
          <div id="category_description_field" name_id="category_description_field">
            <label 
              htmlFor="category_description_input"
              id="category_description_label"
              name_id="category_description_label"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description *
            </label>
            <textarea
              id="category_description_input"
              name_id="category_description_input"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              rows="3"
              placeholder="Brief description of the category..."
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors resize-none ${
                formErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {formErrors.description && (
              <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
            )}
          </div>
          
          {/* Image URL */}
          <div id="category_image_field" name_id="category_image_field">
            <label 
              htmlFor="category_image_input"
              id="category_image_label"
              name_id="category_image_label"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Image URL
            </label>
            <div className="flex space-x-3">
              <input
                type="url"
                id="category_image_input"
                name_id="category_image_input"
                name="image"
                value={formData.image}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors"
              />
              {formData.image && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                  <img
                    id="category_image_preview"
                    name_id="category_image_preview"
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/48';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Product Count (Read-only for existing categories) */}
          {editingCategory && (
            <div id="category_product_count_field" name_id="category_product_count_field">
              <label 
                id="category_product_count_label"
                name_id="category_product_count_label"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Number of Products
              </label>
              <div className="px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300">
                {formData.product_count} products in this category
              </div>
            </div>
          )}
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              id="cancel_category_button"
              name_id="cancel_category_button"
              className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              id="save_category_button"
              name_id="save_category_button"
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-medium flex items-center space-x-2 transition-colors"
            >
              {saving ? (
                <ButtonSpinner />
              ) : (
                <>
                  <FiPlus className="w-4 h-4" />
                  <span>{editingCategory ? 'Update Category' : 'Create Category'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategories;