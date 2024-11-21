// src/pages/Feed.tsx
import React, { useState, useEffect } from 'react';
import Post from '../components/Posts';
import FormPost from '../components/FormPost';
import {fetchApi} from '../utils/fetch';
import { useAuth, useUser } from '../context/authContext';
// import { useNavigate } from 'react-router-dom';


const Feed = () => {
  document.title="Feed"

  const [posts, setPosts] = useState(null);  // Estado para armazenar os posts
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento
  const [postsFollowing, setPostsFollowing] = useState()
  const [feedToInteligence] = useState({})

  // const navigate = useNavigate()
  const data = useAuth().data;
  const fetchPosts = async () => {
    let response =''
    if(!data?.token)
      setLoading(true)

    response = await fetchApi('v1/posts', posts, 'GET', feedToInteligence, data?.token)
    if(!response.status)
      setLoading(true)

    setPosts(response.result)
    setLoading(false)
  }
  const fetchPostsFollowing = async () => {
    let response =''
    if(!data?.token)
      setLoading(true)

    response = await fetchApi(`v1/posts-feed-following/${data?.user?._id}`, posts, 'GET', feedToInteligence, data?.token)
    if(!response.status)
      setLoading(true)

    setPostsFollowing(response.result)
    setLoading(false)
  }
   
  useEffect(() => {
    // validar quais posts podem ser requisitados com base no usuario
    fetchPostsFollowing();
    fetchPosts();
  }, [data?.user])





  return (
    <div className='container' style={{ padding: ' 0px' }}>
      <div style={{}}>
        <h2 style={{ marginRight: '70%' }} > 📃 Feed</h2><br />
        <div className="card container gedf-card" style={{ width: '79%', marginRight: '6%', marginLeft: '2%', justifySelf: 'center' }}>
      <FormPost/>
    </div>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          // posts?.map((post) => (
          postsFollowing?.map((post) => (
            <Post key={post._id} postContent={post} />
          ))
        )}
        <br />
        <br />
        <br />

      </div>
    </div>

  )
};

export default Feed;
