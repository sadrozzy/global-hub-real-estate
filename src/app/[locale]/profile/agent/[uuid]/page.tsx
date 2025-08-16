'use client';

import { use, useState } from 'react';
import { useTranslations } from 'next-intl';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import AgentProfileSidebar from '@/components/AgentProfileSidebar/AgentProfileSidebar';
import AgentProfileContent from '@/components/AgentProfileContent/AgentProfileContent';
import AgentProperties from '@/components/AgentProperties/AgentProperties';
import AgentChangePassword from '@/components/AgentChangePassword/AgentChangePassword';
import ListPropertyModal from '@/components/ListPropertyModal/ListPropertyModal';
import './page.scss';

export default function AgentProfilePage({
  params
}: {
  params: Promise<{ locale: string; uuid: string }>;
}) {
  const { locale, uuid } = use(params);
  const t = useTranslations('AgentProfile');
  const [activeTab, setActiveTab] = useState('profile');
  const [isListPropertyModalOpen, setIsListPropertyModalOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handlePostListingClick = () => {
    setIsListPropertyModalOpen(true);
  };

  const handleCloseListPropertyModal = () => {
    setIsListPropertyModalOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'properties':
        return <AgentProperties uuid={uuid} />;
      case 'password':
        return <AgentChangePassword uuid={uuid} />;
      case 'profile':
      default:
        return <AgentProfileContent uuid={uuid} />;
    }
  };

  return (
    <div className="agent-profile-page">
      <Header locale={locale} />
      <main className="agent-profile-page__main">
        <div className="agent-profile-page__container">
          {/* Breadcrumb */}
          <div className="agent-profile-page__breadcrumb">
            <span className="agent-profile-page__breadcrumb-item">{t('home')}</span>
            <span className="agent-profile-page__breadcrumb-separator">/</span>
            <span className="agent-profile-page__breadcrumb-item agent-profile-page__breadcrumb-item--current">
              {t('myProfile')}
            </span>
          </div>

          {/* Post Your Listing Button */}
          <div className="agent-profile-page__header">
            <button 
              className="agent-profile-page__post-listing-btn"
              onClick={handlePostListingClick}
            >
              {t('postYourListing')}
            </button>
          </div>

          {/* Main Content Layout */}
          <div className="agent-profile-page__content">
            <AgentProfileSidebar 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
            {renderContent()}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
      
      {/* List Property Modal */}
      <ListPropertyModal
        isOpen={isListPropertyModalOpen}
        onClose={handleCloseListPropertyModal}
      />
    </div>
  );
}
