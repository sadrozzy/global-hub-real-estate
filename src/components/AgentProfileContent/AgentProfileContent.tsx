'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import EditProfileModal from '../EditProfileModal/EditProfileModal';
import './AgentProfileContent.scss';

interface AgentProfileContentProps {
  uuid: string;
}

interface AgentData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  street: string;
  state: string;
  joined: string;
  licenseNumber: string;
  avatar: string;
}

export default function AgentProfileContent({ uuid }: AgentProfileContentProps) {
  const t = useTranslations('AgentProfile');
  const [agentData, setAgentData] = useState<AgentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch agent data
    const fetchAgentData = async () => {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app, this would come from API
      const mockData: AgentData = {
        firstName: 'Jack',
        lastName: 'Holland',
        phone: '(555) 980-90821',
        email: 'jackholland@email.com',
        street: 'No 44 Elm Street, Memford',
        state: 'Texas, USA',
        joined: '14 January 2024',
        licenseNumber: '123456',
        avatar: '/images/profiles/agent/profile.png'
      };
      
      setAgentData(mockData);
      setIsLoading(false);
    };

    fetchAgentData();
  }, [uuid]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveProfile = (updatedData: any) => {
    // Update the agent data with the new information
    setAgentData(prev => prev ? {
      ...prev,
      firstName: updatedData.firstName,
      lastName: updatedData.lastName,
      phone: updatedData.phoneNumber,
      email: updatedData.emailAddress,
      street: updatedData.personalAddress,
      licenseNumber: updatedData.realEstateLicenseNumber
    } : null);
    
    console.log('Profile updated:', updatedData);
  };

  if (isLoading) {
    return (
      <div className="agent-profile-content">
        <div className="agent-profile-content__loading">
          <div className="agent-profile-content__loading-spinner"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!agentData) {
    return (
      <div className="agent-profile-content">
        <div className="agent-profile-content__error">
          <p>{t('errorLoadingProfile')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-profile-content">
      <div className="agent-profile-content__card">
        {/* Header with Avatar and Name */}
        <div className="agent-profile-content__header">
          <div className="agent-profile-content__avatar">
            <Image
              src={agentData.avatar}
              alt={`${agentData.firstName} ${agentData.lastName}`}
              width={80}
              height={80}
              className="agent-profile-content__avatar-img"
            />
          </div>
          <div className="agent-profile-content__name-section">
            <h1 className="agent-profile-content__name">
              {agentData.firstName} {agentData.lastName}
            </h1>
            <button 
              className="agent-profile-content__edit-btn"
              onClick={handleEditClick}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              {t('edit')}
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="agent-profile-content__info">
          {/* Name Section */}
          <div className="agent-profile-content__section">
            {/* Header Row */}
            <div className="agent-profile-content__row agent-profile-content__row--header">
              <div className="agent-profile-content__label">{t('name')}</div>
              <div className="agent-profile-content__field-label">{t('firstName')}</div>
              <div className="agent-profile-content__field-label">{t('lastName')}</div>
            </div>
            {/* Value Row */}
            <div className="agent-profile-content__row agent-profile-content__row--value">
              <div className="agent-profile-content__label-spacer"></div>
              <div className="agent-profile-content__field-value">{agentData.firstName}</div>
              <div className="agent-profile-content__field-value">{agentData.lastName}</div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="agent-profile-content__section">
            {/* Header Row */}
            <div className="agent-profile-content__row agent-profile-content__row--header">
              <div className="agent-profile-content__label">{t('contact')}</div>
              <div className="agent-profile-content__field-label">{t('phone')}</div>
              <div className="agent-profile-content__field-label">{t('email')}</div>
            </div>
            {/* Value Row */}
            <div className="agent-profile-content__row agent-profile-content__row--value">
              <div className="agent-profile-content__label-spacer"></div>
              <div className="agent-profile-content__field-value">{agentData.phone}</div>
              <div className="agent-profile-content__field-value">{agentData.email}</div>
            </div>
          </div>

          {/* Address Section */}
          <div className="agent-profile-content__section">
            {/* Header Row */}
            <div className="agent-profile-content__row agent-profile-content__row--header">
              <div className="agent-profile-content__label">{t('address')}</div>
              <div className="agent-profile-content__field-label">{t('street')}</div>
              <div className="agent-profile-content__field-label">{t('states')}</div>
            </div>
            {/* Value Row */}
            <div className="agent-profile-content__row agent-profile-content__row--value">
              <div className="agent-profile-content__label-spacer"></div>
              <div className="agent-profile-content__field-value">{agentData.street}</div>
              <div className="agent-profile-content__field-value">{agentData.state}</div>
            </div>
          </div>

          {/* Joined Section */}
          <div className="agent-profile-content__section">
            {/* Header Row */}
            <div className="agent-profile-content__row agent-profile-content__row--header">
              <div className="agent-profile-content__label">{t('joined')}</div>
              <div className="agent-profile-content__field-label">{t('date')}</div>
            </div>
            {/* Value Row */}
            <div className="agent-profile-content__row agent-profile-content__row--value">
              <div className="agent-profile-content__label-spacer"></div>
              <div className="agent-profile-content__field-value">{agentData.joined}</div>
            </div>
          </div>

          {/* License Number Section */}
          <div className="agent-profile-content__section">
            {/* Header Row */}
            <div className="agent-profile-content__row agent-profile-content__row--header">
              <div className="agent-profile-content__label">{t('licenseNumber')}</div>
              <div className="agent-profile-content__field-label">{t('agentLicenseNumber')}</div>
            </div>
            {/* Value Row */}
            <div className="agent-profile-content__row agent-profile-content__row--value">
              <div className="agent-profile-content__label-spacer"></div>
              <div className="agent-profile-content__field-value">{agentData.licenseNumber}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        agentData={agentData}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
