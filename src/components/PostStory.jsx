// src/components/Post.tsx
import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/fetch';
import { formatDate } from '../utils/formatText';
import { useAuth } from '../context/authContext';
import FeedbacksPost from './FeedbacksPost';
import { useParams } from 'react-router-dom';


const PostStory = ({postContent}) => {
    const data = useAuth().data
    const [user, setUser] = useState(null);  // Estado para armazenar os user
    // const [comments, setComments] = useState()
    const [images, setImages] = useState([null])
    const [showComments, setShowComments] = useState(true);
    const [feedToInteligence] = useState({})
    const [post, setPost] = useState();
    
    const {title, owner,creationDate,description,comments,path} = postContent

    const [qtdLikes, setQtdLikes] = useState();
    const [qtdCommnets, setQtdCommnets] = useState();
    const [toggleLike, setToggleLike] = useState();
    const [youLikedPost, setYouLikedPost] = useState();

    const [isClickedLike, setIsClickedLike] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [loading, setLoading] = useState(null);
    // Função de toggle para alterar o estado
    const toggleDivShare = () => {
        setIsVisible((prevState) => !prevState); // Inverte o estado atual
    };

    const postToggleLike = async () => {
        setIsClickedLike(true)
        setYouLikedPost(!youLikedPost)
        let toggleLike = await fetchApi(`v1/publish-like/${postContent?._id}`, null, 'POST', { userId: data?.user?._id }, data?.token)
        if (!toggleLike.status)
            return
        setToggleLike(toggleLike.result)
        window.location.reload()
    }

    const getYouLiked = async () => {
        let youLiked = await fetchApi(`v1/you-like-post/${postContent?._id}/${data?.user?._id}`, null, 'GET', null, data?.token)
        if (!youLiked.status)
            return
        setYouLikedPost(youLiked.result)
    }
    const getQtdLikes = async () => {
        if(!postContent?._id)
            return
        let qtdLikes = await fetchApi(`v1/likes-qtd/${postContent?._id}`, null, 'GET', null, data?.token)
        if (!qtdLikes.status)
            return
        setQtdLikes(qtdLikes.result)
    }

    const convertDate = (givenDate) => {
        return formatDate(givenDate)
    }

    const getImagesUrls = async () => {
        if (path?.length !== 0) {
            path?.map((fileName) => {
                const imagesGet = `https://storage-fdback.s3.us-east-2.amazonaws.com/temp/${postContent?._id}/${owner}-${fileName}`;
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
     const fetchUser = async () => {
        // 
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
        getImagesUrls();
        toggleComments();
        fetchUser();
        // 
    }, [feedToInteligence, data.user])

    useEffect(() => {
        // 
    }, [showComments, path])
    
    useEffect(() => {
        getYouLiked();
        getQtdLikes();
    }, [data?.user, toggleLike])

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
                                            <button className="btn btn-link dropdown-toggle" onClick={toggleDivShare} type="button" id="gedf-drop1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fa fa-ellipsis-h"></i>
                                            </button>
                                                {isVisible && (
                                                <div className="dropdown-menu dropdown-menu-right d-block" aria-labelledby="gedf-drop1">
                                                    <div className="h6 dropdown-header">Configuration</div>
                                                    <div className='d-flex' style={{ alignItems: 'center', padding:'0px', margin:'10px' }}>
                                                        <button className={styles.buttonPost}>🔗 Share</button>
                                                    </div>
                                                    <a className="dropdown-item">Save</a>
                                                    <a className="dropdown-item" href="/report">Report</a> {/* //TODO: Criar Formulário de report */}
                                                </div>
                                            )}
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
                        <div className='d-flex text-center' style={{ alignItems: 'center' }}>
                        </div>
                        <div className='text-center d-flex' style={{ alignItems: 'center' }}>
                            <div>
                            <button style={youLikedPost ? styles.buttonLiked : styles.buttonLike} onClick={!isClickedLike ? postToggleLike : null}>❤</button>
                            <br />
                            <span>{qtdLikes | ''}</span>
                            </div>
                            <div>
                            <button className={styles.buttonPost} onClick={toggleComments}>💬</button>
                            <br />
                            <span>{comments?.length | ''}</span>
                            </div>
                        </div>
                        </div>
                        {showComments && (
                            <div style={styles.blueBox}>
                                <FeedbacksPost postId={postContent?._id} />
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
    buttonPost: {
        width: '100%',
    },
    buttonLiked: {
        cursor: 'grab',
        color: 'red',
    },
    buttonLike: {
        cursor: 'grab',
        color: 'white'
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

export default PostStory;
