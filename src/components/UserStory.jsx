
import React, { useState, useEffect } from 'react';
import Posts from '../components/Posts'
import { useAuth } from '../context/authContext';
// import { useNavigate } from 'react-router-dom';


const UseStory = ({StoriesArr}) => {
  document.title = "Feed Post Story"
  // const navigate = useNavigate()
  const data = useAuth().data;
  const [stories, setStories] = useState(StoriesArr);  // Estado para armazenar os posts
  const [loading, setLoading] = useState();
  const [storiesToShow, setStoriesToShow] = useState(7); // Quantidade inicial de posts a exibir
  const [visibleStories, setVisibleStories] = useState([]); // Estado para armazenar os posts visíveis

  useEffect(() => {
    // Atualiza os posts visíveis sempre que `posts` ou `postsToShow` mudar
    setVisibleStories(stories.slice(0, storiesToShow));
    // setVisibleStories(stories);
  }, [stories, storiesToShow]);


  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setStoriesToShow((prev) => prev + 5); // Aumenta a quantidade de posts a mostrar em 5
      setLoading(false);
    }, 500); // Simula um atraso de carregamento
  };
  return (
    <div>
      <div className='container'>
        <h3>My Posts</h3>
        {visibleStories.map((story) => (
          <Posts key={story?._id} postContent={story} />
        ))}
        {storiesToShow < stories.length && (
          <div className='container text-center'>
          <button onClick={handleLoadMore} disabled={loading} className="">
            {loading ? 'Carregando...' : stories.length > 0 ? 'Mostrar mais' : <></>}
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

export default UseStory;
