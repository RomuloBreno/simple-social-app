import React, { useState, useEffect } from 'react';
import UserPosts from './UserPosts';

import { fetchApi } from '../utils/fetch';
import UserStory from './UserStory';
import { useAuth, useUser } from '../context/authContext';

// Definição do componente pai
const ProfilePosts = ({profileId}) => {
  const data = useAuth().data;
  // Define qual aba está ativa (inicia na aba 1).
  const [activeTab, setActiveTab] = useState(0);
  const profile = profileId
  const [postsByUser, setPostsByUser] = useState();  // Estado para armazenar os posts
  const [storiesByUser, setStoriesByUser] = useState();  // Estado para armazenar os posts

  const fetchPostsByUser= async () => {
    let response = ''
    if (!data?.token)
      return
    response = await fetchApi(`v1/posts/user/${profile}`, null, 'POST', {limit:50}, data?.token)
    if (response.status) {
      setPostsByUser(response.result.filter(x=>x.postStoryPattern == undefined || x.postStoryPattern == ''))
      setStoriesByUser(response.result.filter(x=>x.postStoryPattern))
    }
  }
  useEffect(() => {
    fetchPostsByUser();
    console.log(postsByUser)
  }, [data?.user, profileId])


  return (
    <div>
      {/* Cabeçalho das abas */}
      <div className="tabs container text-center">
        <button style={{cursor:'pointer', backgroundColor:`${activeTab === 1 ? '#aeaeae' : '#fff'}`}}
          className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          Posts
        </button>
        <button style={{cursor:'pointer', backgroundColor:`${activeTab === 2 ? '#aeaeae' : '#fff'}`}}
          className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
          onClick={() => setActiveTab(2)}
        >
         Stories
        </button>
      </div>

      {/* Conteúdo das abas */}
      <div className="tab-content" >
        {activeTab === 1 && <UserPosts PostsArr={postsByUser} />}
        {activeTab === 2 && <UserStory StoriesArr={storiesByUser} />}
      </div>
    </div>
  );
};

export default ProfilePosts
