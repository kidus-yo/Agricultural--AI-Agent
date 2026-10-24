import { useState } from 'react';
import '../css-files/home-page.css';
import { Search, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

export default function Homepage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advisoryResult, setAdvisoryResult] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    executeSearch(searchQuery);
  };

  const handleChipClick = (questionText) => {
    setSearchQuery(questionText);
    executeSearch(questionText);
  };

  const executeSearch = async (query) => {
    setIsLoading(true);
    setAdvisoryResult(null);

    try {
      console.log('Executing Search Query:', query);
      // Simulate backend AI search & tool execution
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAdvisoryResult({
        success: true,
        query: query,
        diagnosis: 'Nitrogen leaching / temporary deficiency induced by excessive root-zone moisture following heavy rainfall.',
        guidelineRef: 'GUIDE-001 (Maize Crop Management & Nutrient Recovery)',
        recommendations: [
          'Apply side-dress nitrogen fertilizer (Urea or Ammonium Nitrate) once surface soil dries sufficiently.',
          'Ensure proper drainage channels are cleared to prevent prolonged waterlogging.',
          'Monitor lower canopy leaves over the next 7-10 days for green recovery.',
        ],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAdvisoryResult(null);
    setSearchQuery('');
  };

  return (
    <div className="homepage-wrapper">
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>

      <div className="homepage-container">
        {/* Top Text Search Banner */}
        <div className="text-search-hero-card">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI Agricultural Extension Search Engine</span>
          </div>
          <h1 className="hero-title">Search Crop Guidance & Diagnostic Advisories</h1>
          <p className="hero-subtitle">
            Enter your field symptoms or agricultural queries below to search verified crop guidelines and retrieve instant advisories.
          </p>

          {/* Text-Based Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="text-search-bar">
            <div className="text-search-input-wrapper">
              <Search size={20} className="search-bar-icon" />
              <input
                type="text"
                className="text-search-input"
                placeholder="Type your symptoms or questions (e.g., Yellow leaves on maize after heavy rain)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="text-search-btn" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search Guidance'}
              </button>
            </div>
          </form>

          {/* Quick Preset Text Chips (Amharic suggestion removed) */}
          <div className="suggested-queries">
            <span className="suggested-label">POPULAR EXTENSION SEARCHES:</span>
            <div className="query-chips">
              <button
                type="button"
                className="query-chip"
                onClick={() => handleChipClick('Yellow maize leaves after heavy rain')}
              >
                "Yellow maize leaves after rain"
              </button>
              <button
                type="button"
                className="query-chip"
                onClick={() => handleChipClick('Ragged holes in leaf whorl pest control')}
              >
                "Ragged holes in leaf whorl (Pest)"
              </button>
            </div>
          </div>
        </div>

        {/* Generated Advisory Result View (Appears only when a search is performed) */}
        {advisoryResult && (
          <div className="form-card advisory-result-card animate-fade-in">
            <div className="card-header">
              <div className="icon-badge accent-sprout">
                <Sparkles size={22} />
              </div>
              <div>
                <h2>AgriGuide Agent Advisory</h2>
                <p>Results for: "{advisoryResult.query}"</p>
              </div>
            </div>

            <div className="advisory-meta-grid">
              <div className="meta-item">
                <span className="meta-label">Reference Guideline</span>
                <span className="meta-value badge-guide">{advisoryResult.guidelineRef}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Status</span>
                <span className="meta-value">Verified Advisory</span>
              </div>
            </div>

            <div className="advisory-section">
              <h3>Diagnostic Assessment</h3>
              <p className="diagnostic-text">{advisoryResult.diagnosis}</p>
            </div>

            <div className="advisory-section">
              <h3>Recommended Action Plan</h3>
              <ul className="recommendation-list">
                {advisoryResult.recommendations.map((rec, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={16} className="text-emerald" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="advisory-footer-actions">
              <button type="button" onClick={handleReset} className="btn btn-update">
                <RotateCcw size={18} />
                <span>Search Another Query</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}