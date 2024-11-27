import React, { useState } from 'react';
import UserPosts from '../components/UserPosts';

// Definição do componente pai
const ProfilePosts = () => {
  // Define qual aba está ativa (inicia na aba 1).
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div>
      {/* Cabeçalho das abas */}
      <div className="tabs container text-center">
        <button
          className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          Aba 1
        </button>
        <button
          className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => setActiveTab(2)}
        >
          Aba 2
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="tab-content container d-flex" >
        {activeTab === 1 && <UserPosts />}
        {activeTab === 2 && <UserPosts />}
      </div>
    </div>
  );
};

export default ProfilePosts
