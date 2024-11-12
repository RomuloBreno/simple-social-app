// src/components/Post.tsx
import React, { useState, useEffect } from 'react';
import { fetchApi, fetchImage } from '../utils/fetch';
import { formatDate } from '../utils/formatText';
import { useAuth } from '../context/authContext';
import Feedbacks from './Feedbacks';


const Post = ({postContent }) => {
    const data = useAuth().data
    const [user, setUser] = useState(null);  // Estado para armazenar os user
    const { title, description, comments, owner, path, creationDate } = postContent
    const [images, setImages] = useState([null])
    const [showComments, setShowComments] = useState(false);
    const [feedToInteligence] = useState({})
    

    const convertDate = (givenDate) =>{
        return formatDate(givenDate)
    }

    const getImagesUrls= async () => {
        if (path?.length !== 0){
            path?.map((fileName) => {
                const imagesGet = `https://storage-fdback.s3.us-east-2.amazonaws.com/temp/${postContent._id}/${owner}-${fileName}`;
                setImages(prevImages => [...prevImages, imagesGet]);
            })
        }
    }
    useEffect(() => {
        console.log()
        setImages([]);
        const fetchUser = async () => {
            debugger
            const ownerPost = await fetchApi(`v1/user/${owner}`, user, 'GET', feedToInteligence, data?.token)
            if (!ownerPost.status)
                return
            setUser(ownerPost.result)            
        }
        getImagesUrls();
        fetchUser();
        // 
    }, [feedToInteligence, data.user])

    // const toggleComments = () => setShowComments(!showComments);
    const toggleComments = () => {
        setShowComments(!showComments);
    }
    return (
        <div className="container" style={{ display: 'flex', border: '0px solid #ddd', padding: '10px', margin: '10px 0', maxHeight: 'auto' }}>
            <div style={{ flex: 1 }}>


                <div style={styles.container}>
                    <div style={styles.blackBox}>
                        <div className="card gedf-card">
                            <div className="card-header">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex justify-content-between align-items-center">

                                        <div className="d-flex">
                                            <img className="rounded-circle" width="65" src="https://picsum.photos/50/50" alt="" />
                                            <div className="h7 text-muted px-2">
                                                {user?.name}
                                                <p>{user?.email}</p>
                                            </div>
                                        </div>



                                    </div>
                                    <div>
                                        <div className="dropdown">
                                            <button className="btn btn-link dropdown-toggle" type="button" id="gedf-drop1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fa fa-ellipsis-h"></i>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="gedf-drop1">
                                                <div className="h6 dropdown-header">Configuration</div>
                                                <a className="dropdown-item" href="/">Save</a>
                                                <a className="dropdown-item" href="/">Hide</a>
                                                <a className="dropdown-item" href="/">Report</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            {/* CONTEUDO DO POST */}
                            <div className="card-body container">
                                <div className="text-muted h7 mb-2"> <i className="fa fa-clock-o"></i>publicado em: {convertDate(creationDate)}</div>
                                <h4 className="card-title">{title}</h4>
                                <p className="card-text">
                                    {description}
                                </p>
                                {images.length !== 0 ? images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Preview ${index + 1}`}
                                        style={{ width: 'auto', height: 'auto', maxHeight:'100%', maxWidth:'100%' }}
                                    />
                                )):<></>}
                            </div>
                        </div>

                    </div>

                    {showComments && (
                        <div style={styles.blueBox}>
                            <Feedbacks Feedbacks={comments} postId={postContent._id} />
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                        <button>❤</button>
                        <button onClick={toggleComments}>💬</button>
                        <button>🔗</button>
                    </div>

                </div>
            </div>

        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff', // Cor de fundo para facilitar a visualização
    },
    circle: {
        backgroundColor: 'black',
        borderRadius: '50%',
        top: '20px',
        left: '20px',
    },
    horizontalBar: {
        textAlign: 'left',
        padding: '10px',
        width: '100%',
        height: 'fit-content',
        borderRadius: '10px',
    },
    blackBox: {
        width: '80%',
        height: 'auto',//deve ser auto
        maxHeight: 'auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        zIndex: 1,
        transition: 'height 0.5s ease, opacity 0.5s ease', // Animação suave
    },
    blueBox: {
        marginLeft: '0px', // Animação no marginLeft
        opacity: '1',
        overflow: 'auto',
        transition: 'margin-left 0.5s ease, opacity 0.5s ease', // Animação suave
        width: '30%',
        minHeight: '620px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        zIndex: 0,
    },
};

export default Post;
