"use client"
import { useState, useEffect } from "react"
import useAuth from "../../store/auth"
import { FaSave, FaEdit, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa"
import './profile.css'
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import CountryStateSelector from "../GlobalComponents/CountryStateSelector/CountryStateSelector"
import { Country, State } from 'country-state-city'

const UserProfile = () => {
  const { state, logout, updateUser } = useAuth()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({ address: {} })
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const navigate = useNavigate()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  useEffect(() => {
    if (state.user) {
      fetchUserData(state.user.id)
    }
  }, [state.user])

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
        credentials: "include",
      })
      const userData = await response.json()

      // Initialize address if missing
      const userWithAddress = {
        ...userData,
        address: userData.address || {}
      }

      // Set country/state selections
      if (userWithAddress.address?.isoCode) {
        const countryData = Country.getCountryByCode(userWithAddress.address.isoCode)
        setSelectedCountry({
          value: countryData?.isoCode,
          label: countryData?.name
        })

        if (userWithAddress.address.stateCode) {
          setSelectedState({
            value: userWithAddress.address.stateCode,
            label: userWithAddress.address.state
          })
        }
      }

      setUser(userWithAddress)
      setEditedUser(userWithAddress)
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption)
    setSelectedState(null)
    setEditedUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        country: selectedOption.label,
        isoCode: selectedOption.value,
        state: '',
        stateCode: ''
      }
    }))
  }

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption)
    setEditedUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        state: selectedOption.label,
        stateCode: selectedOption.value
      }
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...editedUser,
          address: editedUser.address || {}
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditedUser(updatedUser);
        setIsEditing(false);
        updateUser(updatedUser); // Add this line to sync global state
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      toast.error("Error updating profile");
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const error = await response.json();
        toast.error(error.error);
      }
    } catch (error) {
      toast.error('Error changing password');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="avatar-container">
          <img
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.firstName}&backgroundColor=ff0000`}
            alt="user-avatar"
            className="profile-avatar"
            loading="lazy"
            width={100}
            height={100}
          />
          <button className="avatar-edit-btn">
            <FaEdit size={18} />
          </button>
        </div>

        <div className="profile-actions">
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <div className="action-buttons">
              <button onClick={handleSave} className="save-btn">
                <FaSave /> Save Changes
              </button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="form-section">
        <h2>Profile Information</h2>
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={editedUser.firstName || ""}
              onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={editedUser.lastName || ""}
              onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={editedUser.email || ""}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={editedUser.phone || ""}
              onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </form>
      </div>

      <div className="form-section">
        <h2>Address Information</h2>
        <form onSubmit={handleSave}>
          <CountryStateSelector
            country={selectedCountry}
            state={selectedState}
            onCountryChange={handleCountryChange}
            onStateChange={handleStateChange}
            isEditing={isEditing}
          />

          <div className="form-group">
            <label>Street Number</label>
            <input
              type="text"
              value={editedUser.address?.streetNumber || ""}
              onChange={(e) => setEditedUser({
                ...editedUser,
                address: { ...editedUser.address, streetNumber: e.target.value }
              })}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Street Name</label>
            <input
              type="text"
              value={editedUser.address?.streetName || ""}
              onChange={(e) => setEditedUser({
                ...editedUser,
                address: { ...editedUser.address, streetName: e.target.value }
              })}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Apartment/Unit</label>
            <input
              type="text"
              value={editedUser.address?.apartmentUnit || ""}
              onChange={(e) => setEditedUser({
                ...editedUser,
                address: { ...editedUser.address, apartmentUnit: e.target.value }
              })}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={editedUser.address?.city || ""}
              onChange={(e) => setEditedUser({
                ...editedUser,
                address: { ...editedUser.address, city: e.target.value }
              })}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label>Postal Code</label>
            <input
              type="text"
              value={editedUser.address?.postalCode || ""}
              onChange={(e) => setEditedUser({
                ...editedUser,
                address: { ...editedUser.address, postalCode: e.target.value }
              })}
              disabled={!isEditing}
            />
          </div>
        </form>
      </div>

      <div className="form-section">
        <h2>Security Settings</h2>
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Current Password</label>
            <div className="password-input-container">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>New Password</label>
            <div className="password-input-container">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="8"
              />
              <span
                className="toggle-password"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="password-strength">
              {[1, 2, 3, 4].map((_, index) => (
                <div
                  key={index}
                  className="strength-bar"
                  style={{
                    background: newPassword.length > index * 2 ?
                      (newPassword.length > 6 ? '#4CAF50' : '#FF9800') : '#eee'
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="save-btn"
            disabled={!currentPassword || !newPassword}
          >
            <FaSave /> Update Password
          </button>
        </form>
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-label">Member Since</span>
          <span className="stat-value">
            {new Date(user?.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short'
            })}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{user?.totalOrders || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default UserProfile