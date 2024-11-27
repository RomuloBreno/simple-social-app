
import React, { useState, useEffect} from 'react';
import Posts from '../components/Posts'
import { useAuth } from '../context/authContext';
// import { useNavigate } from 'react-router-dom';


const UserPosts = ({PostsArr}) => {
  document.title="Feed Post Story"
  
  // const navigate = useNavigate()
  const data = useAuth().data;
  const [posts, setPosts] = useState(PostsArr);  // Estado para armazenar os posts
  const [loading, setLoading] = useState(); // Estado para gerenciar o carregamento 
  useEffect(() => {
  }, [data?.user])


  return (
   <div>
    <div>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          // posts?.map((post) => (
          <>
          <div className='container'>
            <h3>My Posts</h3>
         {posts?.map((post) => (
            <Posts key={post?._id} postContent={post} />
          ))}
          </div>
          </>
        )}
        <br />
        <br />
        <br />

      </div>
    </div>

  )
};

export default UserPosts;
