// src/pages/Feed.tsx
import React, { useState, useEffect, useRef } from 'react';
import Post from '../components/Posts';
import {fetchApi} from '../utils/fetch';
import { useAuth } from '../authContext';
import { useNavigate } from 'react-router-dom';
const Feed = () => {
  const navigate = useNavigate()
  const user = useAuth();
  const token = user
  if (!user) {
    console.error('Acesso negado: usuário não autenticado', user);
    navigate("/")
  
  }
  const [posts, setPosts] = useState(null);  // Estado para armazenar os posts
  const [loading, setLoading] = useState(true); // Estado para gerenciar o carregamento
  const [feedToInteligence] = useState({})
  
  useEffect(() => {
    document.title="Feed"
    // validar quais posts podem ser requisitados com base no usuario
    const fetchPosts = async () => {
      let result = await fetchApi('v1/posts', posts, 'GET', feedToInteligence, token)
      let postsJson = await result.json()
      setPosts(postsJson.result)
      setLoading(false)
    }
    fetchPosts();

  }, [])





  return (
    <div className='container' style={{ padding: ' 0px' }}>
      <div style={{}}>
        <h2 style={{ marginRight: '70%' }} > 📃 Feed</h2><br />
        <div class="card gedf-card">
          <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs" id="myTab" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" id="posts-tab" data-toggle="tab" href="#posts" role="tab" aria-controls="posts" aria-selected="true">Make
                  a publication</a>
              </li>

            </ul>
          </div>
          <div class="card-body">
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active" id="posts" role="tabpanel" aria-labelledby="posts-tab">
                <div class="form-group">
                  <label class="sr-only" for="message">post</label>
                  <textarea class="form-control" id="message" rows="3" placeholder="What are you thinking?"></textarea>
                </div>

              </div>
              <div class="tab-pane fade" id="images" role="tabpanel" aria-labelledby="images-tab">
                <div class="form-group">
                  <div class="custom-file">
                    <input type="file" class="custom-file-input" id="customFile" />
                    <label class="custom-file-label" for="customFile">Upload image</label>
                  </div>
                </div>
                <div class="py-4"></div>
              </div>
            </div>
            <div class="btn-toolbar justify-content-between">
              <div class="btn-group">
                <button type="submit" class="btn btn-primary">share</button>
              </div>
              <div class="btn-group">
                <button id="btnGroupDrop1" type="button" class="btn btn-link dropdown-toggle" data-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false">
                  <i class="fa fa-globe"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="btnGroupDrop1">
                  <a class="dropdown-item" href="#"><i class="fa fa-globe"></i> Public</a>
                  <a class="dropdown-item" href="#"><i class="fa fa-users"></i> Friends</a>
                  <a class="dropdown-item" href="#"><i class="fa fa-user"></i> Just me</a>
                </div>
              </div>
            </div>
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
