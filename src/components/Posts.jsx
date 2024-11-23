// src/components/Post.tsx
import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/fetch';
import { formatDate } from '../utils/formatText';
import { useAuth } from '../context/authContext';
import Feedbacks from './Feedbacks';


const Post = ({ postContent }) => {
    const data = useAuth().data
    const [user, setUser] = useState(null);  // Estado para armazenar os user
    const { title, description, owner, path, creationDate, comments } = postContent
    //const [comments, setComments] = useState()
    const [images, setImages] = useState([null])
    const [showComments, setShowComments] = useState(false);
    const [isClickedLike, setIsClickedLike] = useState(false);
    const [qtdLikes, setQtdLikes] = useState();
    const [qtdCommnets, setQtdCommnets] = useState();
    const [toggleLike, setToggleLike] = useState();
    const [youLikedPost, setYouLikedPost] = useState();
    const [feedToInteligence] = useState({})

    const [isVisible, setIsVisible] = useState(false);

    // Função de toggle para alterar o estado
    const toggleDivShare = () => {
        setIsVisible((prevState) => !prevState); // Inverte o estado atual
    };

    const convertDate = (givenDate) => {
        return formatDate(givenDate)
    }
    const getImagesUrls = async () => {
        if (path?.length !== 0) {
            path?.map((fileName) => {
                const imagesGet = `https://storage-fdback.s3.us-east-2.amazonaws.com/temp/${postContent._id}/${owner}-${fileName}`;
                setImages(prevImages => [...prevImages, imagesGet]);
            })
        }
    }
    const postToggleLike = async () => {
        setIsClickedLike(true)
        setYouLikedPost(!youLikedPost)
        let toggleLike = await fetchApi(`v1/publish-like/${postContent._id}`, null, 'POST', { userId: data?.user?._id }, data?.token)
        if (!toggleLike.status)
            return
        setToggleLike(toggleLike.result)
    }
    const getYouLiked = async () => {
        let youLiked = await fetchApi(`v1/you-like-post/${postContent._id}/${data?.user?._id}`, null, 'GET', null, data?.token)
        if (!youLiked.status)
            return
        setYouLikedPost(youLiked.result)
    }
    const getQtdLikes = async () => {

        let qtdLikes = await fetchApi(`v1/likes-qtd/${postContent._id}`, null, 'GET', null, data?.token)
        if (!qtdLikes.status)
            return
        setQtdLikes(qtdLikes.result)
    }
    const fetchUser = async () => {
        const ownerPost = await fetchApi(`v1/user/${owner}`, user, 'GET', feedToInteligence, data?.token)
        if (!ownerPost.status)
            return
        setUser(ownerPost.result)
    }
    const toggleComments = () => {
        setShowComments(!showComments);
    }
    useEffect(() => {
        setImages([]);
        getImagesUrls();
        fetchUser();
    }, [data?.user])

    useEffect(() => {
        getYouLiked();
        getQtdLikes();
    }, [data?.user])
    return (
        <div className="container" style={{ display: 'flex', border: '0px solid #ddd', padding: '10px', margin: '10px 0', maxHeight: 'auto' }}>
            <div style={{ flex: 1 }}>


                <div style={styles.container}>
                    <div style={styles.blackBox}>
                        <div className="card gedf-card">
                            <div className="card-header">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex justify-content-between align-items-center">

                                        <a href={`/profile/${user?.nick}`} style={{ textDecoration: 'none' }}>
                                            <div className="">
                                                <div className="h7 d-flex">
                                                    <img className="rounded-circle" width={70} src="https://picsum.photos/50/50" alt="" />
                                                    <div style={{ margin: '10px' }}>
                                                        <span className='text-muted'>
                                                            {user?.nick}<br />
                                                        </span>
                                                        {user?.job}
                                                    </div>
                                                </div>
                                            </div>
                                        </a>



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
                            <a style={{ textDecoration: 'none', color: 'black' }} href={`/post/${postContent._id}`}>
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
                            </a>
                        </div>

                    </div>

                    {showComments && (
                        <div style={styles.blueBox}>
                            <Feedbacks postId={postContent._id} qtdFeedbacks={comments.length} />
                        </div>
                    )}
                    <div style={{ display: '', textAlign: 'center', flexDirection: 'column', marginLeft: '10px' }}>
                        <div className='d-flex' style={{ alignItems: 'center' }}>
                            <button style={youLikedPost ? styles.buttonLiked : styles.buttonLike} onClick={!isClickedLike ? postToggleLike : null}>❤</button>
                        </div>
                        <div className='text-center' style={{ alignItems: 'center' }}>
                            <button className={styles.buttonPost} onClick={toggleComments}>💬</button>
                            <br />
                            <span>{comments.length | ''}</span>
                        </div>

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
    buttonPost: {
        width: '100%',
    },
    buttonLiked: {
        width: '100%',
        cursor: 'grab',
        color: 'red',
    },
    buttonLike: {
        width: '100%',
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
        width: '80%',
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
