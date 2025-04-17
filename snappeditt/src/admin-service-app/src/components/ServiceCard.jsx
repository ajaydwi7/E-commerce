"use client"
import { Link } from "react-router-dom"
import { PencilIcon, TrashIcon } from "./Icons"

function ServiceCard({ service, onDelete }) {
  const { name, description, basePrice, featureImage, category, subcategory, categorySlug, subCategorySlug, slug } =
    service

  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
      <div className="relative h-48 bg-gray-200">
        {featureImage ? (
          <img src={featureImage || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">No Image</div>
        )}
        <div className="absolute top-2 right-2 flex space-x-1">
          <Link
            to={`/services/edit/${categorySlug}/${subCategorySlug}/${slug}`}
            className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
          >
            <PencilIcon className="h-4 w-4 text-gray-600" />
          </Link>
          <button onClick={() => onDelete(service)} className="p-1 bg-white rounded-full shadow hover:bg-gray-100">
            <TrashIcon className="h-4 w-4 text-red-600" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <span className="text-lg font-bold text-indigo-600">${basePrice}</span>
        </div>
        <div className="mt-1 flex space-x-2">
          <span className="badge badge-blue">{category}</span>
          <span className="badge badge-purple">{subcategory}</span>
        </div>
        <p className="mt-2 text-sm text-gray-600">{truncateDescription(description)}</p>
      </div>
    </div>
  )
}

export default ServiceCard

