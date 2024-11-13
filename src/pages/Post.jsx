// src/components/Post.tsx
import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/fetch';
import { formatDate } from '../utils/formatText';
import { useAuth } from '../context/authContext';
import Feedbacks from '../components/Feedbacks';
import { useParams } from 'react-router-dom';


const Post = () => {
    const { postId } = useParams();
    const data = useAuth().data
    const [user, setUser] = useState(null);  // Estado para armazenar os user
    // const [comments, setComments] = useState()
    const [images, setImages] = useState([null])
    const [showComments, setShowComments] = useState(false);
    const [feedToInteligence] = useState({})
    const [post, setPost] = useState();


    const [title, setTile] = useState();
    const [owner, setOwner] = useState();
    const [creationDate, setCreationDate] = useState();
    const [description, setDescription] = useState();
    const [path, setPath] = useState();




    const [loading, setLoading] = useState(null);


    const convertDate = (givenDate) => {
        return formatDate(givenDate)
    }

    const getImagesUrls = async () => {
        if (path?.length !== 0) {
            path?.map((fileName) => {
                const imagesGet = `https://storage-fdback.s3.us-east-2.amazonaws.com/temp/${post?._id}/${owner}-${fileName}`;
                setImages(prevImages => [...prevImages, imagesGet]);
            })
        }
    }
    // const getCommentsUrls = async () => {
    //     let getFeedback = await fetchApi(`v1/feedbacks/${post?._id}`, null, 'GET', null, data?.token)
    //     if (!getFeedback.status)
    //         return
    //     setComments(getFeedback.result)
    // }
    const getPost = async () => {
        let response = await fetchApi(`v1/post/${postId}`, null, 'GET', null, data?.token)
        if (!response.status)
            setLoading(true)

        setPost(response.result)
        const { title, description, owner, path, creationDate } = response.result
        setTile(title)
        setDescription(description)
        setOwner(owner)
        setPath(path)
        setCreationDate(creationDate)
    }

    const fetchUser = async () => {
        // debugger
        if (!owner)
            return
        const ownerPost = await fetchApi(`v1/user/${owner}`, null, 'GET', null, data?.token)
        if (!ownerPost.status)
            return
        setUser(ownerPost.result)
    }
    // const toggleComments = () => setShowComments(!showComments);
    const toggleComments = () => {
        setShowComments(!showComments);
        // setShowComments(true);
    }


    useEffect(() => {
        setImages([]);
        getPost();
        getImagesUrls();
        toggleComments();
        fetchUser();
        // 
    }, [feedToInteligence, data.user])

    useEffect(() => {
        // 
    }, [showComments, path])

    return (
        <div className="container">
            <div className="container" style={{ display: '', border: '0px solid #ddd', padding: '10px', margin: '10px 0', maxHeight: 'auto' }}>
                <div>


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
                                            style={{ width: 'auto', height: 'auto', maxHeight: '100%', maxWidth: '100%' }}
                                        />
                                    )) : <></>}
                                </div>
                            </div>

                        </div>
                        <br />
                        <div style={{ display: '', flexDirection: 'column', marginLeft: '10px' }}>
                            <button>❤</button>
                            <button onClick={toggleComments}>💬</button>
                            <button>🔗</button>
                        </div>
                        <br />
                        {showComments && (
                            <div style={styles.blueBox}>
                                <Feedbacks postId={post?._id} />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

const styles = {
    container: {
        position: 'relative',
        display: '',
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
        width: '100%',
        height: 'auto',//deve ser auto
        maxHeight: 'auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        zIndex: 1,
        transition: 'height 0.5s ease, opacity 0.5s ease', // Animação suave
    },
    blueBox: {
        padding: '30px',
        marginLeft: '0px', // Animação no marginLeft
        opacity: '1',
        overflow: 'auto',
        transition: 'margin-left 0.5s ease, opacity 0.5s ease', // Animação suave
        backgroundColor: '#fff',
        borderRadius: '10px',
        zIndex: 0,
    },
};

export default Post;
