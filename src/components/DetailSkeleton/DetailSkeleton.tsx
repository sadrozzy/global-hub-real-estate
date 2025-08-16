import './DetailSkeleton.scss';

export default function DetailSkeleton() {
  return (
    <div className="detail-skeleton">
      {/* Header Section - Blue Background */}
      <div className="detail-skeleton__header">
        <div className="detail-skeleton__header-container">
          <div className="detail-skeleton__header-content">
            <div className="detail-skeleton__header-left">
              <div className="detail-skeleton__badges">
                <div className="detail-skeleton__badge"></div>
                <div className="detail-skeleton__badge"></div>
              </div>
              <div className="detail-skeleton__title"></div>
              <div className="detail-skeleton__location"></div>
            </div>
            <div className="detail-skeleton__header-right">
              <div className="detail-skeleton__price"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-skeleton__container">
        {/* Property Details Grid */}
        <div className="detail-skeleton__details">
          <div className="detail-skeleton__details-title"></div>
          <div className="detail-skeleton__details-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="detail-skeleton__detail-card">
                <div className="detail-skeleton__detail-label"></div>
                <div className="detail-skeleton__detail-value"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="detail-skeleton__gallery">
          <div className="detail-skeleton__main-image"></div>
          <div className="detail-skeleton__thumbnails">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="detail-skeleton__thumbnail"></div>
            ))}
          </div>
        </div>

        {/* About and Agent/Map Row */}
        <div className="detail-skeleton__info-row">
          {/* About This Home */}
          <div className="detail-skeleton__about">
            <div className="detail-skeleton__about-title"></div>
            <div className="detail-skeleton__about-content">
              <div className="detail-skeleton__about-text">
                <div className="detail-skeleton__description-text"></div>
                <div className="detail-skeleton__description-text"></div>
                <div className="detail-skeleton__description-text detail-skeleton__description-text--short"></div>
              </div>
              <div className="detail-skeleton__about-image"></div>
            </div>
          </div>

          {/* Agent and Map Cards */}
          <div className="detail-skeleton__agent-map">
            {/* Agent Card */}
            <div className="detail-skeleton__agent-card">
              <div className="detail-skeleton__agent-title"></div>
              <div className="detail-skeleton__agent-info">
                <div className="detail-skeleton__agent-avatar"></div>
                <div className="detail-skeleton__agent-details">
                  <div className="detail-skeleton__agent-name"></div>
                  <div className="detail-skeleton__agent-role"></div>
                </div>
              </div>
              <div className="detail-skeleton__agent-button"></div>
            </div>

            {/* Map Card */}
            <div className="detail-skeleton__map-card">
              <div className="detail-skeleton__map-title"></div>
              <div className="detail-skeleton__map-box"></div>
              <div className="detail-skeleton__map-address"></div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
