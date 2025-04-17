import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ServiceView = () => {
  const { category, subcategory, slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/services/admin/services/${category}/${subcategory}/${slug}`
        );
        if (!response.ok) throw new Error('Service not found');
        const data = await response.json();
        setService(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [category, subcategory, slug]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <img
          src={service.featureImage}
          alt={service.name}
          className="w-full h-64 object-cover mb-6 rounded-lg"
        />
        <h1 className="text-3xl font-bold mb-4">{service.name}</h1>
        <p className="text-2xl text-gray-600 mb-4">${service.basePrice}</p>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-600">{service.description}</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Features</h2>
          <ul className="list-disc pl-6">
            {service.features.map((feature, index) => (
              <li key={index} className="text-gray-600">
                {feature.name} - {feature.included ? 'Included' : 'Not Included'}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServiceView;