import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/services/categories`, // Add environment variable
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        navigate('/admin/services/categories');
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Category Name</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label>Slug</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Category
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;