// src/pages/Feed.tsx
import React, { useState, useEffect, useRef } from 'react';
import Post from '../components/post/Posts';
import FormPost from '../components/forms/FormPost';
import { fetchApi } from '../utils/fetch';
import { useAuth } from '../context/authContext';
// import { useNavigate } from 'react-router-dom';


const Feed = () => {
  document.title = "Feed"

  // const [posts, setPosts] = useState(null);  // Estado para armazenar os posts
  const [loading, setLoading] = useState(false); // Estado para gerenciar o carregamento
  const [postsFollowing, setPostsFollowing] = useState() // Quantidade inicial de posts a exibir
  const [feedToInteligence] = useState({})
  const [visiblePosts, setVisiblePosts] = useState([]); // Estado para armazenar os posts visíveis
  const [getLimitLocal, setGetLimitLocal] = useState(10)
  const [limitShowLocal, setLimitShowLocal] = useState(5)
  const [newPost, setNewPost] = useState()

  const data = useAuth().data;
  const fetchPostsFollowing = async () => {
    let response = ''
    // setLoading(false)
    if (!data?.user) return
    response = await fetchApi(`v1/posts-feed-following/${data?.user?._id}`, null, 'POST', { limit: getLimitLocal }, data?.token)
    // if (!response.status)
    // setLoading(true)
    const postsResultMap = response?.result?.map((item, index) => ({
      ...item,
      index: index
    }));
    setPostsFollowing(postsResultMap)
  }


  useEffect(() => {
    fetchPostsFollowing();
  }, [data?.user])
 
  useEffect(() => {
    // fetchPostsFollowing();
    {setTimeout(() => {
           fetchPostsFollowing() // Remove a mensagem após 5 segundos
           setNewPost('')
          }, 3000)}
  }, [newPost])
 

  useEffect(() => {
    postsToShow();
  }, [postsFollowing, limitShowLocal])


  const postsToShow = () => {
    setVisiblePosts(postsFollowing?.slice(0, limitShowLocal))
  }

  const handleNewPost = (newPost) => {
    setNewPost(newPost);
  };

  const handleLoadMore = () => {
    setLimitShowLocal((prev) => prev + 5)
    document.getElementById("LastPost")?.scrollIntoView({ behavior: 'smooth' });
  };

  const lastVisibleIndex = limitShowLocal - 1;
  return (
    <div className='container' style={{ padding: ' 0px' }}>
      <div style={{}}>
        <h2 style={{ marginRight: '70%' }} > 📃 Feed</h2><br />
        <div className="card container" style={{ width: '100%', marginRight: '0%', marginLeft: '0%', }}>
          <FormPost onPost={handleNewPost}/>
        </div>
        {loading && visiblePosts?.length < 1 ? (
          // TODO refazer logica de poosts
          <p>Carregando...</p>
        ) : (
          <div className='container'>
             {newPost && <Post postContent={newPost} disableURLs={null}/>}
            {visiblePosts?.map((post, index) => {
              const isLastVisible = index === lastVisibleIndex;
              const key = post?._id?.toString?.() ?? `fallback-${index}`;
              return (
                <div key={key} id={isLastVisible ? 'LastPost' : ''}>
                  <Post postContent={post} disableURLs={'notDisable'} />
                </div>
              );
            })}
            {true && visiblePosts?.length && (
              <div className='container text-center'>
                <br />
                <button style={style.btn} onClick={handleLoadMore} disabled={loading} className="">
                  {loading ? 'Carregando...' : postsFollowing?.length > limitShowLocal  ? 'Mostrar mais' : <></>}
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

const style = {
  btn: {
    color: "grey",
    width: '100%',
    background: "none",
    border: "none",
    cursor: "pointer",
  },
}
export default Feed;
