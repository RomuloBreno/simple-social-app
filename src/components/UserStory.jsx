
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

  useEffect(() => {
  }, [data?.user])

  return (
    <div>
     <div>
         {loading ? (
           <p>Carregando...</p>
         ) : (
           <>
           <div className='container'>
           <h3>My Stories</h3>
              {stories?.map((story) => (
                <Posts key={story._id} postContent={story} />
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

export default UseStory;
