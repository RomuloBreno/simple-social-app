// src/pages/Feed.tsx
import React, { useState, useEffect } from 'react';
import Post from '../components/Posts';
import FormPost from '../components/FormPost';
import {fetchApi} from '../utils/fetch';
import { useAuth, useUser } from '../context/authContext';
// import { useNavigate } from 'react-router-dom';


const Feed = () => {
  document.title="Feed"

  // const [posts, setPosts] = useState(null);  // Estado para armazenar os posts
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento
  const [postsFollowing, setPostsFollowing] = useState()
  const [postsToShow, setPostsToShow] = useState(5); // Quantidade inicial de posts a exibir
  const [feedToInteligence] = useState({})
  const [visiblePosts, setVisiblePosts] = useState([]); // Estado para armazenar os posts visíveis
  const [limitLocal, setLimitLocal] = useState(7)

  // const navigate = useNavigate()
  const data = useAuth().data;
  //unused
  // const fetchPosts = async () => {
  //   let response =''
  //   if(!data?.token)
  //     setLoading(true)

  //   response = await fetchApi('v1/posts', null, 'GET', feedToInteligence, data?.token)
  //   if(!response.status)
  //     setLoading(true)

  //   // setPosts(response.result)
  //   setLoading(false)
  // }
  const fetchPostsFollowing = async () => {
    let response =''
    if(!data?.token)
      setLoading(true)

    response = await fetchApi(`v1/posts-feed-following/${data?.user?._id}`, null, 'POST', {limit:limitLocal}, data?.token)
    if(!response.status)
      setLoading(true)

    setPostsFollowing(response.result)
    setLoading(false)
  }
   
  useEffect(() => {
    // validar quais posts podem ser requisitados com base no usuario
    fetchPostsFollowing();
    setVisiblePosts(postsFollowing);
    
  }, [data?.user, limitLocal])

  useEffect(() => {
    setVisiblePosts(postsFollowing);
    
  }, [data?.user,limitLocal])
  
  const handleLoadMore = () => {
    setLoading(true);
    setLimitLocal((prev) => prev + 5)
    setTimeout(() => {
      setPostsToShow((prev) => prev + 5); // Aumenta a quantidade de posts a mostrar em 5
    }, 100); // Simula um atraso de carregamento
    setLoading(false);
  };

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
          <div className='container'>
          {visiblePosts?.map((post) => (
            <Post key={post?._id} postContent={post} />
          ))}
          {postsToShow < postsFollowing?.length && (
            <div className='container text-center'>
            <button onClick={handleLoadMore} disabled={loading} className="">
              {loading ? 'Carregando...' : postsFollowing.length > 0 ? 'Mostrar mais' : <></>}
            </button>
            </div>
          )}
        </div>
        )}
        <br />
        <br />
        <br />

      </div>
    </div>

  )
};

export default Feed;
