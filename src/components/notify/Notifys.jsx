import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/authContext';
import Notify from '../notify/Notify';
import { fetchApi } from '../../utils/fetch';

const Notifys = ({ login, webSocket }) => {
    const { data } = useAuth()
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState([]);
    const [notify, setNotify] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);


    const fetchNotifications = async () => {
        if (!data?.user)
            return
        const response = await fetchApi(`v1/notifications-qtd/${data?.user?._id}`, null, 'GET', null, data?.token)
        if (response.status)
            setMessages(response.result)
    }
    useEffect(() => {
        if (webSocket == null)
            return
        webSocket.onmessage = (event) => {
            const dataMsg = JSON.parse(event.data);
            setNewMessages((prevMessages) => [...prevMessages, dataMsg]);
            setMessages((prevMessages) => [...prevMessages, prevMessages.some((msg) => msg === dataMsg) ? dataMsg : 'null']);
        };
    }, [webSocket]);
    useEffect(() => {
        getNotify()
    }, [data?.user]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentMessage(null); // Remove a mensagem após 5 segundos
          }, 5000);
          return () => clearTimeout(timer);
    }, [notify]);
    const getNotify = () => fetchNotifications()
    
    const toggleNotify = () => {
        setNotify(!notify)
    }
    useEffect(() => {
        if (newMessages.length > 0) {
          setCurrentMessage(newMessages[0]); // Define a mensagem atual
          const timer = setTimeout(() => {
            setCurrentMessage(null);
            getNotify() // Remove a mensagem após 5 segundos
          }, 5000);
    
          // Limpa o timer se o componente for desmontado ou se houver uma nova mensagem
          return () => clearTimeout(timer);
        }
      }, [newMessages]);
    return (
        <div className='text-center' style={{ position: 'fixed', zIndex: '10', backgroundColor: '', right: '10px', cursor: 'pointer' }}>
            {webSocket && login ? (
                <>
                <div className='p-2' onClick={toggleNotify}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6" />
                    </svg>
                </div>

                {currentMessage && (
                    <>
                    <Notify messageParam={newMessages[0]} indexParam={1} dataToken={data?.token}/>
                    </>

                ) }
                </>


            ) : (<></>)}
            {notify ? (
                <div style={{
                    width: '400px', /* Largura do retângulo */
                    height: 'fit-content', /* Altura do retângulo */
                    backgroundColor: 'white', /* Cor de fundo branca */
                    border: '1px solid #ccc', /* Borda cinza clara para destacar */
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', /* Sombra leve para efeito */
                    cursor: 'pointer' 
                }}>
                    {
                        messages?.map((msg, index) => (
                            <div key={index + Math.floor(Math.random() * 100).toString()}>
                                <Notify messageParam={msg} indexParam={index} dataToken={data?.token} />
                            </div>
                        ))
                    }
                </div>



            ) : (<></>)}
        </div>
    );
};

export default Notifys;
