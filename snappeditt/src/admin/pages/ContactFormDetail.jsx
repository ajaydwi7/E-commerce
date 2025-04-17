"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import * as contactApi from "../api/contactApi"
import { ArrowLeftIcon, MailIcon, PhoneIcon, CalendarIcon, UserIcon } from "../components/Icons"

function ContactFormDetail() {
  const { formId } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [note, setNote] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetchFormDetails()
  }, [formId])

  const fetchFormDetails = async () => {
    try {
      setLoading(true)
      const data = await contactApi.getContactFormById(formId)
      setForm(data)
      setStatus(data.status || "new")
    } catch (err) {
      setError(err.message || "Failed to fetch contact form details")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value
    setStatus(newStatus)

    try {
      await contactApi.updateContactFormStatus(formId, newStatus)
      setForm({ ...form, status: newStatus })
    } catch (err) {
      setError(err.message || "Failed to update status")
    }
  }

  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!note.trim()) return

    try {
      const updatedForm = await contactApi.addNoteToContactForm(formId, note)
      setForm(updatedForm)
      setNote("")
    } catch (err) {
      setError(err.message || "Failed to add note")
    }
  }

  const handleDeleteForm = async () => {
    if (window.confirm("Are you sure you want to delete this contact form submission? This action cannot be undone.")) {
      try {
        await contactApi.deleteContactForm(formId)
        navigate("/admin/contact-forms")
      } catch (err) {
        setError(err.message || "Failed to delete contact form")
      }
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
          <Link to="/admin/contact-forms" className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Contact Forms
          </Link>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">Contact form not found</p>
              </div>
            </div>
          </div>
          <Link to="/admin/contact-forms" className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Contact Forms
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link to="/admin/contact-forms" className="inline-flex items-center text-indigo-600 hover:text-indigo-900">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to Contact Forms
          </Link>
          <div className="flex space-x-3">
            <button
              onClick={handleDeleteForm}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Contact Form Details</h2>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">Status:</span>
                <select
                  value={status}
                  onChange={handleStatusChange}
                  className="border border-gray-300 rounded-md text-sm p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Name</p>
                      <p className="text-sm text-gray-600">
                        {form.firstName} {form.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MailIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{form.email}</p>
                    </div>
                  </div>
                  {form.phone && (
                    <div className="flex items-start">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{form.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Submitted On</p>
                      <p className="text-sm text-gray-600">{formatDate(form.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Message Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Topic</p>
                    <p className="text-sm text-gray-600">{form.topic}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Message</p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{form.message}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Terms Accepted</p>
                    <p className="text-sm text-gray-600">{form.acceptTerms ? "Yes" : "No"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Notes</h3>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Note
                  </button>
                </form>
              </div>

              {form.notes && form.notes.length > 0 ? (
                <div className="space-y-4">
                  {form.notes.map((noteItem, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-600 whitespace-pre-line">{noteItem.text}</p>
                        <p className="text-xs text-gray-400">{formatDate(noteItem.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No notes added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactFormDetail

