import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';

const Notify = ({indexParam,messageParam}) => {
    const [message, setMessage] = useState(messageParam);
    const [index, seIndex] = useState(indexParam);
    useEffect(() => {
    }, [message]);
   
      return (
        <div key={index} style={style.notificationStyles}>
          <div style={style.iconStyles}>
            <i className="fas fa-bell"></i>
          </div>
          <div style={style.messageStyles}>
            AAAAAAAAAAAAA
          </div>
          <button
            style={style.closeButtonStyles}
            onClick={style.onClose}
          >
            &times;
          </button>
        </div>
      );
    };
    const style ={
      notificationStyles : {
        //   display: 'flex',
        //   alignItems: 'center',
        //   backgroundColor: '#fff',
        //   padding: '12px 16px',
        //   borderRadius: '8px',
        //   boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        //   width: '300px',
        //   margin: '10px',
        //   position: 'relative',
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
