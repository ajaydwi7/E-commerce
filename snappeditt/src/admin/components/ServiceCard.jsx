"use client"
import { Link } from "react-router-dom"
import { PencilIcon, TrashIcon, EyeIcon } from "./Icons"

function ServiceCard({ service, onDelete }) {
  const {
    _id,
    name,
    description,
    basePrice,
    featureImage,
    category, // From flattened data
    subcategory, // From flattened data
    categorySlug, // For delete URL
    subCategorySlug, // For delete URL
    slug,
  } = service

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 bg-gray-200">
        {featureImage ? (
          <img src={featureImage || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">No Image</div>
        )}
        <div className="absolute top-2 right-2 flex space-x-1">
          <Link
            to={`/admin/services/view/${categorySlug}/${subCategorySlug}/${slug}`}
            className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
            title="View Details"
          >
            <EyeIcon className="h-4 w-4 text-indigo-600" />
          </Link>
          <Link
            to={`/admin/services/edit/${categorySlug}/${subCategorySlug}/${slug}`}
            className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
            title="Edit Service"
          >
            <PencilIcon className="h-4 w-4 text-gray-600" />
          </Link>
          <button
            onClick={() => onDelete(service)}
            className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
            title="Delete Service"
          >
            <TrashIcon className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>
      <Link to={`/admin/services/view/${categorySlug}/${subCategorySlug}/${slug}`} className="block p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <span className="text-lg font-bold text-indigo-600">${basePrice}</span>
        </div>
        <div className="mt-1 flex space-x-2">
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
            {category}
          </span>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-purple-100 text-purple-800">
            {subcategory}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-600">{truncateDescription(description)}</p>
      </Link>
    </div>
  )
}

export default ServiceCard

