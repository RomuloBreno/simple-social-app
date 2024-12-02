import React, { useState, useEffect } from "react";
const PostActions = ({ youLikedPost, postToggleLike, toggleComments, commentsLength, styles }) => {
  useEffect(() => {
  }, [youLikedPost])
  
  return(
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
  )
};
  

  export default PostActions 