import React, { useEffect, useState, useCallback } from 'react';
import { fetchApi } from '../../utils/fetch';
import { useAuth } from '../../context/authContext';
import ErrorSpan from '../error/ErrorSpan';

const FilePreview = ({ file, onDelete }) => {
  return (
    <div className="d-flex mt-3" style={{ maxWidth: '50%' }}>
      <div style={{ zIndex: 9 }}>
        <img
          src={URL.createObjectURL(file)}
          alt={`Preview ${file.name}`}
          style={{ width: '100%', maxWidth: '150px', height: 'auto' }}
        />
      </div>
      <div style={{ zIndex: 10, position: 'absolute', marginRight: '100%' }}>
        <button onClick={() => onDelete(file)} className="btn btn-danger">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const FormPost = ({ onPost }) => {
  const { data } = useAuth();
  const [error, setError] = useState('');
  const [postContent, setPostContent] = useState('');
  const [title, setTitle] = useState('');
  const [postStoryChecked, setPostStoryChecked] = useState(false);
  const [postsStory, setPostsStory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPostsStoryValue, setSelectedPostsStoryValue] = useState('');

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handlePostChange = (e) => setPostContent(e.target.value);

  const handleFileChange = (e) => setSelectedFiles(Array.from(e.target.files));

  const handleDeleteFileChange = (file) => setSelectedFiles(selectedFiles.filter((f) => f !== file));

  const fetchPostsStory = useCallback(async () => {
    try {
      const posts = await fetchApi(`v1/posts-story-owner/${data?.user?._id}`, null, 'GET', null, data?.token);
      if (posts.status) {
        setPostsStory(posts.result);
      }
    } catch (err) {
      setError('Falha na busca por Posts Stories');
    }
  }, [data?.user?._id, data?.token]);

  const handleCheckPostStory = async (e) => {
    setPostStoryChecked(e.target.checked);
    if (e.target.checked) {
      await fetchPostsStory();
    }
  };

  const factoryDataPost = (title, postContent, pathsName, id, selectedPostsStoryValue) => ({
    title,
    description: postContent,
    path: pathsName,
    owner: id,
    ...(selectedPostsStoryValue !=null && { postStoryPattern: selectedPostsStoryValue }),
  });

  const handleSelectChange = (e) => setSelectedPostsStoryValue(e.target.value);

  const handleTabChange = (tab) => setActiveTab(tab);

  const getNameFiles = useCallback(() => selectedFiles.map((file) => file.name), [selectedFiles]);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {
      const pathsName = getNameFiles();
      let dataPost = {}
      if (postStoryChecked && !(selectedPostsStoryValue.valueOf() === 'default')) {
        dataPost = factoryDataPost(title, postContent, pathsName, data?.user._id,selectedPostsStoryValue)
        onPost(dataPost)
      } else {
        dataPost = factoryDataPost(title, postContent, pathsName, data?.user._id,null)
        onPost(dataPost)
      }
      setTitle('')
      setPostContent('')
      setPostStoryChecked(false)
      const postPublished = await fetchApi('v1/publish', null, 'POST', dataPost, data?.token);
      
      if (!postPublished.status) {
        setError(postPublished.result);
        setLoading(false);
        return;
      }

      await Promise.all(
        selectedFiles.map(async (file) => {
          const keyPath = `${postPublished.result.id}/${data?.user._id}-${file.name}`;
          const signedUrl = await fetchApi('auth/s3-post-img-url', null, 'POST', { key: keyPath, fileName: file.name }, data?.token);

          if (!signedUrl.status) {
            throw new Error(`Erro no upload do arquivo ${file.name}`);
          }

          const storageStatus = await fetch(signedUrl.result, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
          });

          if (!storageStatus.ok) {
            const storageResponseJson = await storageStatus.json();
            throw new Error(`Erro no upload do arquivo ${file.name}: ${storageResponseJson.message}`);
          }
        })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postStoryChecked && (selectedPostsStoryValue.valueOf() === 'default' || selectedPostsStoryValue.valueOf() === '')) {
      setError('Não selecionar uma opção de Post Story torna esse Post atual um Post Story');
    } else {
      setError('');
    }
  }, [postStoryChecked, selectedPostsStoryValue]);

  useEffect(() => {
    if (!postStoryChecked) return
  }, [postStoryChecked]);


  return (
    <>
      {loading && (
        <div className='' style={{ textAlign: 'center', width: '97%', height: '100%', zIndex: '12', position: 'absolute', background: 'rgb(128 128 128 / 11%)', alignContent: 'center' }}>
          <div className="spinner-border" role="status">
          </div>
        </div>
      )}

      <div className="card-header bg-white" style={{ color: 'black' }}>
        <ul className="nav nav-tabs card-header-tabs" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => handleTabChange('posts')}
            >
              Criar Post
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'images' ? 'active' : ''}`}
              onClick={() => handleTabChange('images')}
            >
              Carregar Imagem
            </button>
          </li>
        </ul>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="tab-content">
            {activeTab === 'posts' && (
              <div className="tab-pane fade show active">
                <div className="form-group">
                  <input
                    className="form-control"
                    placeholder="Titulo"
                    value={title}
                    onChange={handleTitleChange}
                    maxLength={100}
                  />
                  <textarea
                    className="form-control"
                    placeholder="Descrição"
                    value={postContent}
                    onChange={handlePostChange}
                    required
                    maxLength={300}
                  />
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="tab-pane fade show active">
                <div className="form-group">
                  <input
                    type="file"
                    className="custom-file-input"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                  <label className="custom-file-label">
                    {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Upload images'}
                  </label>
                  {selectedFiles.map((file) => (
                    <FilePreview key={file.name} file={file} onDelete={handleDeleteFileChange} />
                  ))}
                </div>
              </div>
            )}
          </div>
          <br />
          <div>
    <div className="form-check form-switch align-items-center gap-2">
      <label className="form-check-label" htmlFor="postStorySwitch">
        {postStoryChecked ? '' : ''}
      </label><span className='p-2'>Marque a opção caso queira criar um Novo Post Story, ou adicionar a um existente</span>
      <input
        className="form-check-input"
        type="checkbox"
        id="postStorySwitch"
        checked={postStoryChecked}
        onChange={handleCheckPostStory}
      />
    </div>
            {/* <input type="checkbox" className="btn btn-primary" onClick={handleCheckPostStory} defaultChecked={postStoryChecked} /> */}
            
            {/* {postStoryChecked && selectedPostsStoryValue && (
              <span> Marking the option creates a post story if it doesn't selected.</span>
            )} */}
            <br />
            {postStoryChecked > 0 && (
              <select
                value={selectedPostsStoryValue}
                onChange={handleSelectChange}
                style={{ marginLeft: '10px' }}
              >
                Post Story: <option value="default">Select...</option>
                {postsStory.map((option) => (
                  <option key={option._id} value={option._id}>
                    {option.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <br />
          <button type="submit" className="btn btn-primary">Publicar</button>
          {error && <ErrorSpan message={error} />}
        </form>
      </div>
    </>
  );
};

export default FormPost;
