import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categorySlug, subCategorySlug, serviceSlug } = useParams();
  const isEditMode = !!categorySlug && !!subCategorySlug && !!serviceSlug;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    basePrice: 0,
    featureImage: '',
    features: [],
    images: [],
    variationTypes: [],
    priceCombinations: [],

  });


  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [showNewSubcategory, setShowNewSubcategory] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState({ name: '', slug: '' });

  // Add these handler functions
  const handleCreateCategory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/services/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newCategory)
      });

      if (response.ok) {
        const updatedCategories = await fetch(`${import.meta.env.VITE_API_URL}/services/categories-with-subcategories`);
        setCategories(await updatedCategories.json());
        setShowNewCategory(false);
        setNewCategory({ name: '', slug: '' });
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleCreateSubcategory = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services/categories/${formData.category}/subcategories`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(newSubcategory)
        }
      );

      if (response.ok) {
        const updatedCategories = await fetch(`${import.meta.env.VITE_API_URL}/services/categories-with-subcategories`);
        setCategories(await updatedCategories.json());
        setShowNewSubcategory(false);
        setNewSubcategory({ name: '', slug: '' });
      }
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catResponse, serviceResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/services/categories-with-subcategories`),
          isEditMode
            ? fetch(`${import.meta.env.VITE_API_URL}/services/admin/services/${categorySlug}/${subCategorySlug}/${serviceSlug}`)
            : null
        ]);

        const categoriesData = await catResponse.json();
        setCategories(categoriesData);

        if (isEditMode && serviceResponse) {
          const serviceData = await serviceResponse.json();
          setFormData({
            ...serviceData,
            category: serviceData.categorySlug,
            subcategory: serviceData.subCategorySlug
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isEditMode]);


  const handleArrayUpdate = (field, index, key, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = { ...updatedArray[index], [key]: value };
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addArrayItem = (field, template) => {
    setFormData({ ...formData, [field]: [...formData[field], template] });
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditMode
        ? `${import.meta.env.VITE_API_URL}/services/categories/${formData.category}/subcategories/${formData.subcategory}/services/${formData.slug}`
        : `${import.meta.env.VITE_API_URL}/services/categories/${formData.category}/${formData.subcategory}/services`;

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Submission failed');
      }

      navigate('/admin/services');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {id ? 'Edit Service' : 'Create New Service'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Category Management</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Category</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory(true)}
                  className="text-blue-500 text-sm"
                >
                  + Create New Category
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Subcategory</label>
                <select
                  className="w-full p-2 border rounded"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  disabled={!formData.category}
                >
                  <option value="">Select Subcategory</option>
                  {categories.find(c => c.slug === formData.category)?.subCategories.map(sub => (
                    <option key={sub._id} value={sub.slug}>{sub.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewSubcategory(true)}
                  className="text-blue-500 text-sm"
                >
                  + Create New Subcategory
                </button>
              </div>
            </div>

            {/* New Category/Subcategory Forms */}
            {showNewCategory && (
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium mb-2">Create New Category</h4>
                <input
                  type="text"
                  placeholder="Category Name"
                  className="w-full p-2 border rounded mb-2"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Category Slug"
                  className="w-full p-2 border rounded mb-2"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showNewSubcategory && (
              <div className="border p-4 rounded-lg">
                <h4 className="font-medium mb-2">Create New Subcategory</h4>
                <input
                  type="text"
                  placeholder="Subcategory Name"
                  className="w-full p-2 border rounded mb-2"
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Subcategory Slug"
                  className="w-full p-2 border rounded mb-2"
                  value={newSubcategory.slug}
                  onChange={(e) => setNewSubcategory({ ...newSubcategory, slug: e.target.value })}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCreateSubcategory}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewSubcategory(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Service Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-md"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Slug</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border rounded-md"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Base Price</label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 border rounded-md"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Feature Image URL</label>
              <input
                type="url"
                required
                className="w-full px-4 py-2 border rounded-md"
                value={formData.featureImage}
                onChange={(e) => setFormData({ ...formData, featureImage: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows="4"
              className="w-full px-4 py-2 border rounded-md"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Features</h3>
              <button
                type="button"
                onClick={() => addArrayItem('features', { name: '', included: true })}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add Feature
              </button>
            </div>

            {formData.features.map((feature, fIndex) => (
              <div key={fIndex} className="border p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Feature #{fIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('features', fIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                      type="text"
                      required
                      className="w-full p-2 border rounded"
                      value={feature.name}
                      onChange={(e) => handleArrayUpdate('features', fIndex, 'name', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="block text-sm font-medium">Included</label>
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={feature.included}
                      onChange={(e) => handleArrayUpdate('features', fIndex, 'included', e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Before/After Images</h3>
              <button
                type="button"
                onClick={() => addArrayItem('images', { before: '', after: '' })}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add Image Pair
              </button>
            </div>

            {formData.images.map((image, imgIndex) => (
              <div key={imgIndex} className="border p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Image Pair #{imgIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('images', imgIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Before Image URL</label>
                    <input
                      type="url"
                      required
                      className="w-full p-2 border rounded"
                      value={image.before}
                      onChange={(e) => handleArrayUpdate('images', imgIndex, 'before', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">After Image URL</label>
                    <input
                      type="url"
                      className="w-full p-2 border rounded"
                      value={image.after}
                      onChange={(e) => handleArrayUpdate('images', imgIndex, 'after', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Variation Types */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Variation Types</h3>
              <button
                type="button"
                onClick={() => addArrayItem('variationTypes', { name: '', options: [], required: false })}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add Variation Type
              </button>
            </div>

            {formData.variationTypes.map((vt, vtIndex) => (
              <div key={vtIndex} className="border p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Variation Type #{vtIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('variationTypes', vtIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">Name</label>
                      <input
                        type="text"
                        required
                        className="w-full p-2 border rounded"
                        value={vt.name}
                        onChange={(e) => handleArrayUpdate('variationTypes', vtIndex, 'name', e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="block text-sm font-medium">Required</label>
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={vt.required}
                        onChange={(e) => handleArrayUpdate('variationTypes', vtIndex, 'required', e.target.checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-medium">Options</h5>
                      <button
                        type="button"
                        onClick={() => handleArrayUpdate('variationTypes', vtIndex, 'options', [...vt.options, { name: '', description: '' }])}
                        className="px-2 py-1 bg-gray-200 rounded text-sm"
                      >
                        Add Option
                      </button>
                    </div>

                    {vt.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Option name"
                          className="flex-1 p-2 border rounded"
                          value={option.name}
                          onChange={(e) => {
                            const newOptions = [...vt.options];
                            newOptions[optIndex].name = e.target.value;
                            handleArrayUpdate('variationTypes', vtIndex, 'options', newOptions);
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Description"
                          className="flex-1 p-2 border rounded"
                          value={option.description}
                          onChange={(e) => {
                            const newOptions = [...vt.options];
                            newOptions[optIndex].description = e.target.value;
                            handleArrayUpdate('variationTypes', vtIndex, 'options', newOptions);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = vt.options.filter((_, i) => i !== optIndex);
                            handleArrayUpdate('variationTypes', vtIndex, 'options', newOptions);
                          }}
                          className="text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Combinations */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Price Combinations</h3>
              <button
                type="button"
                onClick={() => addArrayItem('priceCombinations', { combination: [], price: 0 })}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add Price Combination
              </button>
            </div>

            {formData.priceCombinations.map((pc, pcIndex) => (
              <div key={pcIndex} className="border p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">Combination #{pcIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('priceCombinations', pcIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Options Combination</label>
                    <select
                      multiple
                      className="w-full p-2 border rounded h-32"
                      value={pc.combination}
                      onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                        handleArrayUpdate('priceCombinations', pcIndex, 'combination', selected);
                      }}
                    >
                      {formData.variationTypes.flatMap(vt =>
                        vt.options.map(opt => (
                          <option key={opt.name} value={opt.name}>
                            {vt.name}: {opt.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Price</label>
                    <input
                      type="number"
                      required
                      className="w-full p-2 border rounded"
                      value={pc.price}
                      onChange={(e) => handleArrayUpdate('priceCombinations', pcIndex, 'price', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/services')}
              className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;