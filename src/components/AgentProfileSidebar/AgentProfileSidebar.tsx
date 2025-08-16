'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import './AgentProfileSidebar.scss';

interface AgentProfileSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AgentProfileSidebar({ activeTab, onTabChange }: AgentProfileSidebarProps) {
  const t = useTranslations('AgentProfile');
  const locale = useLocale();
  const router = useRouter();

  const sidebarItems = [
    {
      id: 'profile',
      label: t('myProfile'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    {
      id: 'properties',
      label: t('yourProperties'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9,22 9,12 15,12 15,22"/>
        </svg>
      )
    },
    {
      id: 'password',
      label: t('changePassword'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <circle cx="12" cy="16" r="1"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      )
    },
    {
      id: 'signout',
      label: t('signOut'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16,17 21,12 16,7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      )
    }
  ];

  const handleItemClick = (itemId: string) => {
    // Handle navigation or actions based on item
    switch (itemId) {
      case 'profile':
      case 'properties':
      case 'password':
        onTabChange(itemId);
        break;
      case 'signout':
        // TODO: Handle sign out
        if (confirm(t('signOutConfirm'))) {
          console.log('Sign out');
          router.push(`/${locale}/login`);
        }
        break;
    }
  };

  return (
    <div className="agent-profile-sidebar">
      <nav className="agent-profile-sidebar__nav">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            className={`agent-profile-sidebar__item ${
              activeTab === item.id ? 'agent-profile-sidebar__item--active' : ''
            }`}
            onClick={() => handleItemClick(item.id)}
          >
            <span className="agent-profile-sidebar__item-icon">
              {item.icon}
            </span>
            <span className="agent-profile-sidebar__item-label">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
