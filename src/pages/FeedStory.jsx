
import React, { useState, useEffect} from 'react';
import PostStory from '../components/PostStory';
import {fetchApi} from '../utils/fetch';
import { useAuth, useUser } from '../context/authContext';
import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';


const FeedStory = () => {
  document.title="Feed Post Story"
  
  // const navigate = useNavigate()
  const data = useAuth().data;
  const { postStoryPatternId } = useParams();
  const [posts, setPosts] = useState(null);  // Estado para armazenar os posts
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento
  const [feedToInteligence] = useState({})
  
  const [postsStory, setPostsStory] = useState()
//   UNUSED
  const fetchPosts = async (postsId) => {
    let postsArr = []
    let response =''
    if(!data?.token)
    postsId?.foreach(async(postId)=>{
        if(!postId)
            return
        response = await fetchApi(`v1/post/${postId}`, null, 'GET', null, data?.token)
        if(response.status){
            postsArr.push(response.result)
        }
        setPosts(postsArr)
    })
    setPosts(response.result)
  }

  const fetchPostsStory = async () => {
    let response =''
    if(!data?.token)
        return
    if(!postStoryPatternId)
        return
    debugger
    response = await fetchApi(`v1/posts-story/${postStoryPatternId}`, null, 'GET', null, data?.token)
    if(!response.status)
        return
    setPosts(response.result);
  }
   
  useEffect(() => {
    // validar quais posts podem ser requisitados com base no usuario
    fetchPostsStory();
  }, [data?.user])




  return (
   <div>
    <div>
        {false ? (
          <p>Carregando...</p>
        ) : (
          // posts?.map((post) => (
          <>
          <div className='container'>
            <h3>Feed de posts</h3>
         {posts?.map((post) => (
            <PostStory key={post._id} postContent={post} />
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

export default FeedStory;
