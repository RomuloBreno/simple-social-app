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
    postsToShow();
  }, [postsFollowing, limitShowLocal])


  const postsToShow = () => {
    setVisiblePosts(postsFollowing?.slice(0, limitShowLocal))
  }


  const handleLoadMore = () => {
    setLimitShowLocal((prev) => prev + 5)
      document.getElementById("LastPost").scrollIntoView({ behavior: 'smooth' });
  };

  const lastVisibleIndex = limitShowLocal - 1;
  return (
    <div className='container' style={{ padding: ' 0px' }}>
      <div style={{}}>
        <h2 style={{ marginRight: '70%' }} > 📃 Feed</h2><br />
        <div className="card container" style={{ width: '100%', marginRight: '0%', marginLeft: '0%', }}>
          <FormPost />
        </div>
        {loading && visiblePosts?.length < 1 ? (
          // TODO refazer logica de poosts
          <p>Carregando...</p>
        ) : (
          <div className='container'>
            {visiblePosts?.map((post, index) => {
              const isLastVisible = index === lastVisibleIndex;
              console.log(isLastVisible)
                return (
                  <div id={isLastVisible ? 'LastPost' :'' }>
                    <Post key={(post?._id).toString()} postContent={post} />
                  </div>
                )
            }
            )}
            {true && visiblePosts?.length && (
              <div className='container text-center'>
                <br />
                <button style={style.btn} onClick={handleLoadMore} disabled={loading} className="">
                  {loading ? 'Carregando...' : visiblePosts?.length > 0 ? 'Mostrar mais' : <></>}
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
