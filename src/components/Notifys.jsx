import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';

const Notify = ({ login, webSocket }) => {
    const [messages, setMessages] = useState([]);
    const [notify, setNotify] = useState(false);
    useEffect(() => {
        if(webSocket == null)
            return
        webSocket.onmessage = (event) => {
            const dataMsg = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, dataMsg]);
        };
        console.log(messages)
    }, [webSocket, messages]);

    const toggleNotify = () =>{
        setNotify(!notify)
    } 

    return (
        <div className='text-center' style={{ position: 'fixed', zIndex: '10', backgroundColor: '', right: '10px', cursor: 'pointer' }}>
            {webSocket && login ? (
                <div className='p-2' onClick={toggleNotify}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                    </svg>
                </div>
            ) : (<></>)}
            {notify ? (
                <div style={{  width: '400px', /* Largura do retângulo */
                    height: 'fit-content', /* Altura do retângulo */
                    backgroundColor: 'white', /* Cor de fundo branca */
                    border: '1px solid #ccc', /* Borda cinza clara para destacar */
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' /* Sombra leve para efeito */}}>
                    {
                        messages?.map((msg, index) => (
                            <div key={index}>
                                {msg.message}
                            </div>
                        ))
                    }
                </div>
                


            ) : (<></>)}
        </div>
    );
};

export default Notify;
