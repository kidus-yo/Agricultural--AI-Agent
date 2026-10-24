import { useState } from 'react';
import './FarmerReportForm.css';
import { demoLocations, caseHistories } from '../data/demoData';
import { MapPin, User, Sprout, Activity, ClipboardList } from 'lucide-react';

export default function FarmerReportForm({ onSubmitReport, isLoading }) {
  const [selectedLocation, setSelectedLocation] = useState('SITE-A');
  const [selectedCaseId, setSelectedCaseId] = useState('');
  const [formData, setFormData] = useState({
    farmerName: '',
    crop: 'Maize',
    growthStage: '',
    symptoms: '',
    fieldConditions: '',
  });

  const [errors, setErrors] = useState({});

  const availableCases = caseHistories.filter((c) => c.location_id === selectedLocation);

  const handleLocationChange = (e) => {
    const locId = e.target.value;
    setSelectedLocation(locId);
    setSelectedCaseId('');
    setFormData((prev) => ({
      ...prev,
      farmerName: '',
      growthStage: '',
      symptoms: '',
      fieldConditions: '',
    }));
  };

  const handleCaseSelect = (e) => {
    const caseId = e.target.value;
    setSelectedCaseId(caseId);

    if (!caseId) {
      setFormData((prev) => ({
        ...prev,
        farmerName: '',
        growthStage: '',
        symptoms: '',
        fieldConditions: '',
      }));
      return;
    }

    const matchedCase = caseHistories.find((c) => c.case_id === caseId);
    if (matchedCase) {
      setSelectedLocation(matchedCase.location_id);
      setFormData({
        farmerName: matchedCase.farmer_name,
        crop: matchedCase.crop,
        growthStage: matchedCase.growth_stage,
        symptoms: matchedCase.recorded_facts,
        fieldConditions: 'Recent heavy rain observed in the field area.',
      });
      setErrors({});
    }
  };

  const handleQuickPreset = (type) => {
    if (type === 'yellowing') {
      setSelectedLocation('SITE-A');
      setSelectedCaseId('CASE-001');
      setFormData({
        farmerName: 'Abebe Tadesse',
        crop: 'Maize',
        growthStage: 'Vegetative (V8)',
        symptoms: 'Yellow leaves observed across the lower canopy following heavy rain.',
        fieldConditions: 'Heavy rain for 3 days on moist soil.',
      });
    } else if (type === 'holes') {
      setSelectedLocation('SITE-B');
      setSelectedCaseId('CASE-002');
      setFormData({
        farmerName: 'Tigist Bekele',
        crop: 'Maize',
        growthStage: 'Early Whorl',
        symptoms: 'Scattered ragged holes in central leaves with visible chewing marks.',
        fieldConditions: 'Dry spell conditions with warm weather.',
      });
    }
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.farmerName.trim()) {
      newErrors.farmerName = 'Farmer name is required.';
    }

    if (!formData.growthStage.trim()) {
      newErrors.growthStage = 'Growth stage is required.';
    }

    if (!formData.symptoms.trim()) {
      newErrors.symptoms = 'Observed symptoms are required.';
    } else if (formData.symptoms.trim().length < 10) {
      newErrors.symptoms = 'Please provide more detail (at least 10 characters).';
    }

    if (!formData.fieldConditions.trim()) {
      newErrors.fieldConditions = 'Recent field conditions are required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmitReport({
        ...formData,
        locationId: selectedLocation,
        caseId: selectedCaseId || null,
      });
    }
  };

  return (
    <div className="farmer-report-wrapper">
      <div className="page-header-section">
        <span className="badge-tag">AGRIVERSE INTELLIGENCE</span>
        <h1 className="page-main-title">AgriGuide — AI Extension Agent</h1>
        <p className="page-subtitle">Submit field conditions to retrieve guidance and generate a referenced advisory.</p>
      </div>

      <form onSubmit={handleSubmit} className="farmer-form" noValidate>
        {/* Card 1: Telemetry & Location Setup */}
        <div className="form-card">
          <div className="card-header-flex">
            <div className="icon-badge blue-badge">
              <MapPin size={22} />
            </div>
            <div>
              <h2>Telemetry & Location Setup</h2>
              <p>Select demo telemetry node and inspect historical cases</p>
            </div>
          </div>

          <div className="preset-container">
            <span className="preset-label">Test Subjects:</span>
            <div className="preset-buttons">
              <button type="button" className="preset-btn" onClick={() => handleQuickPreset('yellowing')}>
                GUIDE-001 (Yellow Leaves)
              </button>
              <button type="button" className="preset-btn" onClick={() => handleQuickPreset('holes')}>
                CASE-002 (Pest / Holes)
              </button>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="locationSelect" className="form-label">
                Demo Location <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <MapPin size={18} className="field-icon" />
                <select
                  id="locationSelect"
                  className="form-select icon-padding"
                  value={selectedLocation}
                  onChange={handleLocationChange}
                >
                  {demoLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group half-width">
              <label htmlFor="caseSelect" className="form-label">
                Case History (Read Case History)
              </label>
              <div className="input-with-icon">
                <ClipboardList size={18} className="field-icon" />
                <select
                  id="caseSelect"
                  className="form-select icon-padding"
                  value={selectedCaseId}
                  onChange={handleCaseSelect}
                >
                  <option value="">-- New Report / No History --</option>
                  {availableCases.map((c) => (
                    <option key={c.case_id} value={c.case_id}>
                      {c.case_id} — {c.farmer_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Crop & Field Observations */}
        <div className="form-card">
          <div className="card-header-flex">
            <div className="icon-badge green-badge">
              <Sprout size={22} />
            </div>
            <div>
              <h2>Crop & Field Observations</h2>
              <p>Provide agronomic details and observed symptoms for AI analysis</p>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="farmerName" className="form-label">
                Farmer Name <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <User size={18} className="field-icon" />
                <input
                  type="text"
                  id="farmerName"
                  name="farmerName"
                  value={formData.farmerName}
                  onChange={handleChange}
                  placeholder="e.g., Abebe Tadesse"
                  className={`form-input icon-padding ${errors.farmerName ? 'input-error' : ''}`}
                />
              </div>
              {errors.farmerName && <span className="error-text">{errors.farmerName}</span>}
            </div>

            <div className="form-group half-width">
              <label htmlFor="crop" className="form-label">
                Crop <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <Sprout size={18} className="field-icon" />
                <select id="crop" name="crop" value={formData.crop} onChange={handleChange} className="form-select icon-padding">
                  <option value="Maize">Maize (Corn)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="growthStage" className="form-label">
              Growth Stage <span className="required">*</span>
            </label>
            <div className="input-with-icon">
              <Activity size={18} className="field-icon" />
              <input
                type="text"
                id="growthStage"
                name="growthStage"
                value={formData.growthStage}
                onChange={handleChange}
                placeholder="e.g., Vegetative (V8)"
                className={`form-input icon-padding ${errors.growthStage ? 'input-error' : ''}`}
              />
            </div>
            {errors.growthStage && <span className="error-text">{errors.growthStage}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="symptoms" className="form-label">
              Observed Symptoms <span className="required">*</span>
            </label>
            <textarea
              id="symptoms"
              name="symptoms"
              rows="3"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="e.g., Yellow leaves following heavy rain..."
              className={`form-textarea ${errors.symptoms ? 'input-error' : ''}`}
            />
            {errors.symptoms && <span className="error-text">{errors.symptoms}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fieldConditions" className="form-label">
              Recent Field Conditions <span className="required">*</span>
            </label>
            <textarea
              id="fieldConditions"
              name="fieldConditions"
              rows="2"
              value={formData.fieldConditions}
              onChange={handleChange}
              placeholder="e.g., Heavy rain for 3 days on moist soil..."
              className={`form-textarea ${errors.fieldConditions ? 'input-error' : ''}`}
            />
            {errors.fieldConditions && <span className="error-text">{errors.fieldConditions}</span>}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Agent Analyzing & Searching Guidance...' : 'Run Agent Workflow (Preview Advisory)'}
        </button>
      </form>
    </div>
  );
}