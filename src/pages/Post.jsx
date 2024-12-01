// src/components/Post.tsx
import React, { useState, useEffect } from 'react';
import { fetchApi } from '../utils/fetch';
import { Link } from "react-router-dom";
import { formatDate } from '../utils/formatText';
import { useAuth } from '../context/authContext';
import { useParams } from 'react-router-dom';
import FeedbacksPost from "../components/feedback/FeedbacksPost";

const PostHeader = ({ user, postStoryPattern, toggleDivShare, isVisible }) => (
  <div style={styles.header}>
    <div style={styles.headerLeft}>
      <Link to={`/profile/${user?.nick}`} style={styles.profileLink}>
        <img
          style={styles.avatar}
          src="https://picsum.photos/50/50"
          alt="User"
        />
        <div style={styles.userInfo}>
          <span style={styles.userNick}>{user?.nick}</span><br />
          <span style={styles.userJob}>{user?.job}</span>
        </div>
      </Link>
    </div>
    <div style={styles.headerRight}>
      {postStoryPattern && <span style={styles.storyBadge}>Story</span>}
      <button style={styles.dropdownToggle} onClick={toggleDivShare}>
      <i className="">...</i>
      </button>
      {isVisible && (
        <div className='' style={styles.dropdownMenu}>
          <button className="" style={styles.dropdownItem}>🔗 Share</button>
          <br/>
          <Link style={styles.dropdownItem}> 💾 Save</Link>
          <br/>
          <Link style={styles.dropdownItem} to="/report">
          🚩 Report
          </Link>
        </div>
      )}
    </div>
  </div>
);

const PostBody = ({ title, description, images, creationDate, postStoryPattern, postId }) => (
<>
    <div style={styles.meta}>
        <br />
      <i className="fa fa-clock-o"></i> Publicado em: {formatDate(creationDate)}
        <br />
        <br />
    </div>
    <h4 style={styles.title}>{title}</h4>
    <p style={styles.description}>{description}</p>
    {images.length > 0 && (
      <div style={styles.imagesContainer}>
        {images.map((image, index) => (
          <img key={index} src={image} alt={`Imagem ${index + 1}`} style={styles.image} />
        ))}
      </div>
    )}
    </>
);

const PostActions = ({ youLikedPost, postToggleLike, toggleComments, commentsLength }) => (
  <div className='text-center d-flex' style={styles.actions}>
    <div>
    <button
      style={youLikedPost ? styles.actionButtonLiked : styles.actionButtonLike}
      onClick={postToggleLike}
    >
      ❤
    </button>
    </div>
    <div>
    <button style={styles.actionButton} onClick={toggleComments}>
      💬
    </button>
    <span>{commentsLength || ""}</span>
    </div>
  </div>
);

const Post = () => {
    const { data } = useAuth();
    const { postId } = useParams();
    const [post, setPost] = useState();
    

    // const [title, setTile] = useState();
    // const [owner, setOwner] = useState();
    // const [creationDate, setCreationDate] = useState();
    // const [description, setDescription] = useState();
    // const [path, setPath] = useState();
    // const [user, setUser] = useState(null);  // Estado para armazenar os user
    // const [comments, setComments] = useState();
    
    const { title, description, owner, path, creationDate, comments, postStoryPattern } = post ? post : {}
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [isClickedLike, setIsClickedLike] = useState(false);
    const [youLikedPost, setYouLikedPost] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    
    useEffect(() => {
        const fetchPost = async () => {
            let response = await fetchApi(`v1/post/${postId}`, null, 'GET', null, data?.token)
            if (response.status) setPost(response.result);
        }
        const fetchUser = async () => {
            if(!post)
                return
            const response = await fetchApi(`v1/user/${owner}`, null, "GET", null, data?.token);
            if (response.status) setUser(response.result);
        };
        
        const fetchImages = () => {
            if (path?.length) {
                setImages(
                    path.map(
                        (fileName) =>
                            `https://storage-fdback.s3.us-east-2.amazonaws.com/temp/${post?._id}/${owner}-${fileName}`
                    )
                );
            }
        };
        fetchPost();
        fetchUser();
        fetchImages();
    }, [post?._id, data?.token]);
    
    useEffect(() => {
        if(!post)
            return
        getYouLiked()
    }, [data?.token, post]);

    const getYouLiked = async () => {
        let youLiked = await fetchApi(`v1/you-like-post/${post?._id}/${data?.user?._id}`, null, 'GET', null, data?.token)
        if (!youLiked.status)
            return
        setYouLikedPost(youLiked.result)
    }

    const postToggleLike = async () => {
        if (isClickedLike) return;
        setIsClickedLike(true);
        setYouLikedPost((prev) => !prev);
        await fetchApi(`v1/publish-like/${post?._id}`, null, "POST", { userId: data?.user?._id }, data?.token);
    };

    const toggleComments = () => setShowComments((prev) => !prev);
    const toggleDivShare = () => setIsVisible((prev) => !prev);

    return (
        <div className="p-4" >
            <div style={styles.container}>
                <div style={styles.post}>
                    <PostHeader
                        user={user}
                        postStoryPattern={postStoryPattern}
                        toggleDivShare={toggleDivShare}
                        isVisible={isVisible}
                    />
                    <PostBody
                        title={title}
                        description={description}
                        images={images}
                        creationDate={creationDate}
                        postStoryPattern={postStoryPattern}
                        postId={post?._id}
                    />
                    <hr />
                    <PostActions
                        youLikedPost={youLikedPost}
                        postToggleLike={postToggleLike}
                        toggleComments={toggleComments}
                        commentsLength={comments?.length}
                    />
                    {showComments && <FeedbacksPost postId={post?._id} qtdFeedbacks={comments?.length} />}
                </div>
                <div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        border: "1px solid #ddd",
        padding: "10px",
        margin: "10px 0",
        backgroundColor: "#fff",
        borderRadius: "10px",
        width: '100%'
    },
    post: {
        width: "100%",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
    },
    profileLink: {
        display: "flex",
        textDecoration: "none",
        color: "inherit",
    },
    avatar: {
        borderRadius: "50%",
        width: "50px",
        height: "50px",
    },
    userInfo: {
        marginLeft: "10px",
    },
    userNick: {
        fontWeight: "bold",
    },
    userJob: {
        fontSize: "12px",
        color: "gray",
    },
    storyBadge: {
        backgroundColor: "#f0f0f0",
        padding: "5px",
        borderRadius: "5px",
        fontSize: "12px",
    },
    dropdownToggle: {
        background: "none",
        border: "none",
        cursor: "pointer",
    },
    dropdownMenu: {
        position: "absolute",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
        padding: "10px",
    },
    dropdownHeader: {
        fontWeight: "bold",
    },
    dropdownItem: {
        cursor: "pointer",
        padding: "5px 10px",
        textDecoration: "none",
        color: "#000",
        background: "none",
        border: "none",
    },
    body: {
        margin: "15px 0",
        textDecoration: "none",
        color: "inherit",
    },
    meta: {
        fontSize: "12px",
        color: "gray",
        marginBottom: "10px",
    },
    title: {
        fontSize: "18px",
        fontWeight: "bold",
    },
    description: {
        margin: "10px 0",
    },
    imagesContainer: {
        display: "flex",
        flexWrap: "wrap",
    },
    image: {
        maxWidth: "100%",
        margin: "5px 0",
    },
    actions: {
        // justifyContent: "space-between",
        // alignItems: "center",
        // height:' 100%',
        // alignContent: 'center'
    },
    actionButton: {
        width: '100%',
        background: "none",
        border: "none",
        cursor: "pointer",
    },
    actionButtonLiked: {
        color: "red",
        width: '100%',
        background: "none",
        border: "none",
        cursor: "pointer",
    },
    actionButtonLike: {
        color: "gray",
        width: '100%',
        background: "none",
        border: "none",
        cursor: "pointer",
    },
};

export default Post;


