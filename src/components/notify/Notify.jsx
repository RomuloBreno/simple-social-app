import React, { useEffect, useState } from 'react';
import { ENotify } from '../../enumNotify';
import { fetchApi } from '../../utils/fetch';
import { Link } from 'react-router-dom';
import { formatDateToNotify } from '../../utils/formatText';

const Notify = ({indexParam,messageParam, dataToken}) => {
    // const [message, setMessage] = useState(messageParam);
    const [index, setIndex] = useState(indexParam);
    const [user, setUser] = useState();
    const {notifier, message, postId, creationDate} = messageParam
    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetchApi(`v1/user/${notifier}`, null, "GET", null, dataToken);
            if (response.status) setUser(response.result);
          };
          fetchUser()
    }, [messageParam]);
    useEffect(() => {
    }, [message, user?.nick]);
   
      return (
        <div style={{cursor: 'pointer' }}>
        {message && user &&
            <div style={style.notificationStyles}>
              <div style={style.iconStyles}>
                <i className="fas fa-bell"></i>
              </div>
              <div style={style.messageStyles}>
              <span style={{fontWeight:'400'}}>
                <Link to={`/profile/${user?.nick}`}  style={{ textDecoration:'none'}}>
                 {user?.nick + " "} 
                </Link>
                </span>
                {postId 
                ? (
                    <>
                <Link to={`/post/${postId}`} style={{ textDecoration:'none', color:'grey'}}>
                   {typeof message == "number" ? ENotify[message] : message}
                </Link>
                    </>
                )
                : (
                    <Link to={`/profile/${user?.nick}`} style={{ textDecoration:'none', color:'grey'}}>
                    {typeof message == "number" ? ENotify[message] : message}
                    </Link>
                )
                }
                <span>{ "   " + formatDateToNotify(creationDate)}</span>
              </div>
              {/* <button
                style={style.closeButtonStyles}
                onClick={style.onClose}
              >
                &times;
              </button> */}
            </div>
            }
        </div>
      );
    };
    const style ={
      notificationStyles : {
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
          width: 'auto',
          margin: '10px',
          position: 'relative',
          cursor: 'pointer' 
        },
      
        iconStyles : {
          fontSize: '24px',
          color: '#4267b2', // cor do ícone, geralmente azul para o Facebook
          marginRight: '12px',
        },
      
        messageStyles : {
          flex: '1',
          fontSize: '14px',
          color: '#333',
        },
      
        closeButtonStyles : {
          background: 'none',
          border: 'none',
          fontSize: '18px',
          color: '#999',
          cursor: 'pointer',
          position: 'absolute',
          top: '8px',
          right: '8px',
        },
      
        closeButtonHoverStyles : {
          color: '#333',
        },
  }

export default Notify;
