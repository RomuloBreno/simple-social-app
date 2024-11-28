import React, { useState, useEffect } from 'react';
import Posts from '../components/Posts';
import { useAuth } from '../context/authContext';

const UserPosts = ({ PostsArr }) => {
  document.title = "Feed Post Story";

  const data = useAuth().data;
  const [posts, setPosts] = useState(PostsArr); // Estado para armazenar todos os posts
  const [visiblePosts, setVisiblePosts] = useState([]); // Estado para armazenar os posts visíveis
  const [postsToShow, setPostsToShow] = useState(7); // Quantidade inicial de posts a exibir
  const [loading, setLoading] = useState(false); // Estado para gerenciar o carregamento

  useEffect(() => {
    // Atualiza os posts visíveis sempre que `posts` ou `postsToShow` mudar
    setVisiblePosts(posts.slice(0, postsToShow));
    // setVisiblePosts(posts);
  }, [posts, postsToShow]);

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setPostsToShow((prev) => prev + 5); // Aumenta a quantidade de posts a mostrar em 5
      setLoading(false);
    }, 500); // Simula um atraso de carregamento
  };

  return (
    <div>
      <div className='container'>
        <h3>My Posts</h3>
        {visiblePosts.map((post) => (
          <Posts key={post?._id} postContent={post} />
        ))}
        {postsToShow < posts.length && (
          <div className='container text-center'>
          <button onClick={handleLoadMore} disabled={loading} className="">
            {loading ? 'Carregando...' : posts.length > 0 ? 'Mostrar mais' : <></>}
          </button>
          </div>
        )}
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};

export default UserPosts;
