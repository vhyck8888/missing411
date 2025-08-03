import React, { useState, useRef } from 'react';
import { FiAlertCircle, FiCheckCircle, FiMapPin, FiUser, FiCalendar, FiClock, FiUpload, FiX } from 'react-icons/fi';

const SubmitCase = ({ user, setCases }) => {
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    status: 'Missing',
    date: new Date().toISOString().split('T')[0],
    description: '',
    lastSeen: '',
    photo: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setSubmitStatus({ type: 'error', message: 'Please upload an image file (JPEG, PNG)' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setSubmitStatus({ type: 'error', message: 'File size too large (max 5MB)' });
        return;
      }

      setFormData(prev => ({ ...prev, photo: file }));

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitStatus(null);

  if (isNaN(formData.latitude) || isNaN(formData.longitude)) {
    setSubmitStatus({ type: 'error', message: 'Please enter valid coordinates' });
    setIsSubmitting(false);
    return;
  }

  try {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('status', formData.status);
    data.append('date', formData.date);
    data.append('lastSeen', formData.lastSeen);
    data.append('latitude', formData.latitude);
    data.append('longitude', formData.longitude);
    data.append('description', formData.description);
    if (formData.photo) {
      data.append('photo', formData.photo);
    }

    const response = await fetch('http://localhost:5000/api/cases', {
      method: 'POST',
      body: data
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Submission failed');
    }

    const savedCase = await response.json();
    setCases(prev => [...prev, savedCase]);
    setSubmitStatus({ type: 'success', message: 'Case submitted successfully!' });

    setFormData({
      name: '',
      latitude: '',
      longitude: '',
      status: 'Missing',
      date: new Date().toISOString().split('T')[0],
      description: '',
      lastSeen: '',
      photo: null
    });
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTimeout(() => setSubmitStatus(null), 5000);
  } catch (error) {
    setSubmitStatus({ type: 'error', message: error.message });
  } finally {
    setIsSubmitting(false);
  }
};

  

  return (
    <div style={{
      maxWidth: '768px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginTop: '32px',
      marginBottom: '48px'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Report a Missing Person</h2>
        <p style={{ color: '#4b5563' }}>
          Provide details to help us locate the missing individual. All fields are required.
        </p>
      </div>

      {submitStatus && (
        <div
          style={{
            marginBottom: '24px',
            padding: '16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'flex-start',
            backgroundColor: submitStatus.type === 'success' ? '#ecfdf5' : '#fef2f2',
            color: submitStatus.type === 'success' ? '#065f46' : '#991b1b'
          }}
        >
          {submitStatus.type === 'success' ? (
            <FiCheckCircle style={{ fontSize: '1.25rem', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
          ) : (
            <FiAlertCircle style={{ fontSize: '1.25rem', marginRight: '12px', marginTop: '2px', flexShrink: 0 }} />
          )}
          <div>
            <p style={{ fontWeight: 500 }}>{submitStatus.message}</p>
            {submitStatus.type === 'success' && (
              <p style={{ fontSize: '0.875rem', marginTop: '4px', opacity: 0.9 }}>
                The case has been added to our database. Thank you for your contribution.
              </p>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }} encType="multipart/form-data">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div style={{ display: 'grid', gap: '4px' }}>
            <label htmlFor="name" style={{ 
  display: 'flex',
  fontSize: '0.875rem', 
  fontWeight: 500, 
  color: '#374151', 
  alignItems: 'center' 
}}>
  <FiUser style={{ marginRight: '8px' }} /> Full Name
</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: '4px' }}>
            <label htmlFor="name" style={{ 
  display: 'flex',
  fontSize: '0.875rem', 
  fontWeight: 500, 
  color: '#374151', 
  alignItems: 'center' 
}}>
  <FiUser style={{ marginRight: '8px' }} /> Status
</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            >
              <option value="Missing">Missing</option>
              <option value="Searching">Searching</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div style={{ display: 'grid', gap: '4px' }}>
            <label htmlFor="name" style={{ 
  display: 'flex',
  fontSize: '0.875rem', 
  fontWeight: 500, 
  color: '#374151', 
  alignItems: 'center' 
}}>
  <FiUser style={{ marginRight: '8px' }} /> Date
</label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              max={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: '4px' }}>
         <label htmlFor="lastSeen" style={{ 
  display: 'flex', 
  fontSize: '0.875rem', 
  fontWeight: 500, 
  color: '#374151', 
  alignItems: 'center' 
}}>
              <FiMapPin style={{ marginRight: '8px' }} /> Last Seen Location
            </label>
            <input
              id="lastSeen"
              name="lastSeen"
              value={formData.lastSeen}
              onChange={handleChange}
              placeholder="Central Park, New York"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                outline: 'none',
                transition: 'all 0.2s'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          <div style={{ display: 'grid', gap: '4px' }}>
            <label htmlFor="latitude" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
              Latitude
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                type="number"
                step="any"
                placeholder="e.g., 37.7749"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  paddingRight: '40px'
                }}
              />
              <span style={{ position: 'absolute', right: '12px', top: '14px', color: '#9ca3af', fontSize: '0.875rem' }}>°N</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Decimal format (e.g., 40.7128)</p>
          </div>

          <div style={{ display: 'grid', gap: '4px' }}>
            <label htmlFor="longitude" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
              Longitude
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                type="number"
                step="any"
                placeholder="e.g., -122.4194"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                  outline: 'none',
                  transition: 'all 0.2s',
                  paddingRight: '40px'
                }}
              />
              <span style={{ position: 'absolute', right: '12px', top: '14px', color: '#9ca3af', fontSize: '0.875rem' }}>°W</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>Decimal format (e.g., -74.0060)</p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '4px' }}>
          <label htmlFor="description" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Physical description, clothing, circumstances..."
            required
            rows={4}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              outline: 'none',
              transition: 'all 0.2s'
            }}
          />
        </div>

        <div style={{ display: 'grid', gap: '4px' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
            Photo of Missing Person
          </label>
          <div style={{ marginTop: '4px', display: 'flex', alignItems: 'center' }}>
            <label
              htmlFor="photo-upload"
              style={{
                cursor: 'pointer',
                backgroundColor: 'white',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FiUpload style={{ marginRight: '8px' }} />
              Upload Photo
            </label>
            <input
              id="photo-upload"
              name="photo"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}
            />
            <p style={{ marginLeft: '16px', fontSize: '0.875rem', color: '#6b7280' }}>
              {formData.photo ? formData.photo.name : 'No file chosen'}
            </p>
            {formData.photo && (
              <button
                type="button"
                onClick={removeImage}
                style={{ marginLeft: '8px', color: '#ef4444' }}
              >
                <FiX />
              </button>
            )}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
            JPEG or PNG (Max 5MB). Helps with identification.
          </p>

          {previewImage && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ position: 'relative', width: '192px', height: '192px', border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    padding: '4px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <FiX style={{ color: '#ef4444' }} />
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: 500,
            transition: 'all 0.3s',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isSubmitting ? '#60a5fa' : '#2563eb',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: isSubmitting ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          {isSubmitting ? (
            <>
              <svg
                style={{ animation: 'spin 1s linear infinite', height: '20px', width: '20px', color: 'white' }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  style={{ opacity: 0.25 }}
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  style={{ opacity: 0.75 }}
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <FiCheckCircle style={{ fontSize: '1.125rem' }} />
              <span>Submit Case</span>
            </>
          )}
        </button>
      </form>

      <div style={{
        marginTop: '32px',
        padding: '16px',
        backgroundColor: '#eff6ff',
        borderRadius: '8px',
        border: '1px solid #dbeafe'
      }}>
        <h3 style={{ color: '#1e40af', fontWeight: 500, marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <FiAlertCircle style={{ marginRight: '8px' }} /> Important Notes
        </h3>
        <ul style={{ color: '#1c51b9', fontSize: '0.875rem', display: 'grid', gap: '4px', listStyleType: 'disc', paddingLeft: '20px' }}>
          <li>Double-check all information before submitting</li>
          <li>Use decimal degrees format for coordinates (GPS preferred)</li>
          <li>Include as much detail as possible in the description</li>
          <li>All submissions are reviewed before being published</li>
          <li>Clear photos help significantly with identification</li>
        </ul>
      </div>
    </div>
  );
};

export default SubmitCase;