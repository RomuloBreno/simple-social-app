import React, { useEffect, useState } from 'react';
import { fetchApi } from '../utils/fetch';
import { useAuth } from '../context/authContext';

const FormPost = () => {
  const data = useAuth().data
  
  const [error, setError] = useState('');
  const [postContent, setPostContent] = useState('');
  const [path, setPath] = useState()
  const [title, setTitle] = useState('')
  const [owner, setOwner] = useState()
  const [loading, setLoading] = useState(false); // Estado para gerenciar o carregamento
  const [selectedFiles, setSelectedFiles] = useState([]); // Agora é um array para múltiplos arquivos
  const [activeTab, setActiveTab] = useState('posts'); // Estado para rastrear a aba ativa

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handlePostChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Converte FileList para array
    setSelectedFiles(files)
  };

  const handleDeleteFileChange = (index) => {
    
    const files = selectedFiles.filter(x => x !== index)
    setSelectedFiles(files)
  };

  const getNameFiles = (selectedFiles) => {
    return selectedFiles.map((file) => file.name); // Cria um array com os nomes dos arquivos
  }

  const handleSubmit = async (event) => {
    
    event.preventDefault();
    setLoading(true);
 
    //pega todos os nomes dos arquivos para salavr no banco
    const  pathsName = getNameFiles(selectedFiles) 
    //faz request para criação de post
    const dataPost = { title: title, description: postContent, path: pathsName, owner: data?.user._id }
    let postPublished = await fetchApi('v1/publish', null, 'POST', dataPost, data?.token)
    if (!postPublished.status) {
      setError(postPublished.result)
      setLoading(false)
    }
    setLoading(false)
    
    // para cada arquivo cria uma URL assinada para publicação
    selectedFiles.map(async (file, index) => {

      const keyPath =`${postPublished.result.id}/${data?.user._id}-${file.name}` 
      
      let signedUrl = await fetchApi(`auth/s3-post-img-url`, null, 'POST', {key:keyPath, fileName:file.name}, data?.token )
      if(!signedUrl.status)
          return
        
      //envia file pro storage
      const optionsS3 = {
        method: 'PUT',
        headers: {
          'Content-Type': `image/${file.type}` // Define o tipo de conteúdo do arquivo
        },
        body: file
      };
      const storageStatus = await fetch(signedUrl.result, optionsS3);

      if(!storageStatus.status){
        let storageResponsJson = await storageStatus.json()
        setError(storageResponsJson.message)
      }
      window.location.href="/"
    })
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab); // Define a aba ativa
  };

  useEffect(()=>{

  },[loading,path])


  return (
<>
      {loading ? (
      <div style={{ textAlign: 'center',marginTop: '2%', width: '94%',height: '94%',zIndex: '12',position: 'absolute',alignContent: 'center', background: '#808080ad' }}>
        <div className="container spinner-border p-10"role="status" >
          <span className="sr-only"></span>
        </div>
      </div>
      ):(
        <div>

        </div>
      )}
    <div>
      <div className="card-header">
        <ul className="nav nav-tabs card-header-tabs" id="myTab" role="tablist">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => handleTabChange('posts')}
            >
              Make a publication
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'images' ? 'active' : ''}`}
              onClick={() => handleTabChange('images')}
            >
              Upload Images
            </button>
          </li>
        </ul>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="tab-content" id="myTabContent">
            {activeTab === 'posts' && (
              <div className="tab-pane fade show active" id="posts" role="tabpanel" aria-labelledby="posts-tab">
                <div className="form-group">
                  <label className="sr-only" htmlFor="message">Post</label>
                  <input
                    className="form-control"
                    id="title"
                    rows="3"
                    placeholder="title"
                    value={title}
                    onChange={handleTitleChange}
                  />
                  <textarea
                    className="form-control"
                    id="message"
                    rows="3"
                    placeholder="What are you thinking?"
                    value={postContent}
                    onChange={handlePostChange}
                    required
                  />
                </div>
              </div>
            )}
            {activeTab === 'images' && (
              <div className="tab-pane fade show active" id="images" role="tabpanel" aria-labelledby="images-tab">
                <div className="form-group">
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="customFile"
                      accept="image/*"
                      multiple // Permite múltiplas imagens
                      onChange={handleFileChange}
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                      {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Upload images'}
                    </label>
                  </div>
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="d-flex mt-3 z-10" style={{ maxWidth: '50%' }}>
                      <div className='' style={{ zIndex: 9 }}>
                        <img
                          key={index}
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          style={{ width: '100%', maxWidth: '150px', height: 'auto' }}
                        />
                      </div>
                      <div key={index} className='' style={{ zIndex: 10, position: 'absolute', marginRight: '100%' }}>
                        <button onClick={() => handleDeleteFileChange(file)} index={index}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <br />
          <button type="submit" className="btn btn-primary">Submit</button>
          <br/>
          {error && <p className="text-danger mt-3">{error}</p>}

        </form>
      </div>
    </div>
</>
  );
};

export default FormPost;
