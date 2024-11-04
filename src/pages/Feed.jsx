// src/pages/Feed.tsx
import React, { useState, useEffect } from 'react';
import Post from '../components/Posts';
import {fetchApi} from '../utils/fetch';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';


const Feed = () => {
  const [posts, setPosts] = useState(null);  // Estado para armazenar os posts
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento
  const [feedToInteligence] = useState({})
  const [postContent, setPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate()
  const user = useAuth();
  const token = user.user.token

  const handlePostChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode lidar com o envio do postContent e selectedFile
  };
  if (!user) {
    navigate("/")
  
  }
  useEffect(() => {
    document.title="Feed"
    // validar quais posts podem ser requisitados com base no usuario
    let response =''
    const fetchPosts = async () => {
      if(user?.user)
        response = await fetchApi('v1/posts', posts, 'GET', feedToInteligence, token)
      if(!response.status)
        return
      setPosts(response.result)
      setLoading(false)
    }
    fetchPosts();

  }, [token,feedToInteligence,posts,user])





  return (
    <div className='container' style={{ padding: ' 0px' }}>
      <div style={{}}>
        <h2 style={{ marginRight: '70%' }} > 📃 Feed</h2><br />
        <div className="card container gedf-card" style={{ width: '79%', marginRight: '6%', marginLeft: '2%', justifySelf: 'center' }}>
      <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs" id="myTab" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" id="posts-tab" data-toggle="tab" href="#posts" role="tab" aria-controls="posts" aria-selected="true">
              Make a publication
            </a>
          </li>
        </ul>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active" id="posts" role="tabpanel" aria-labelledby="posts-tab">
              <div className="form-group">
                <label className="sr-only" htmlFor="message">Post</label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="3"
                  placeholder="What are you thinking?"
                  value={postContent}
                  onChange={handlePostChange}
                />
              </div>
            </div>
            <div className="tab-pane fade" id="images" role="tabpanel" aria-labelledby="images-tab">
              <div className="form-group">
                <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input"
                    id="customFile"
                    onChange={handleFileChange}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    {selectedFile ? selectedFile.name : 'Upload image'}
                  </label>
                </div>
              </div>
              <div className="py-4"></div>
            </div>
          </div>
          <br/>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          posts?.map((post) => (
            <Post key={post._id} dataUser={post} />
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
