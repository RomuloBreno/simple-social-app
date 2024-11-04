import React, { useState,useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { fetchApi } from '../utils/fetch';

const Feedbacks = ({ Feedbacks }) => {
    //mock
    const [feedbacks, setFeedbacks] = useState([
        { feedback: "Esse é um exemplo de comentário longo para testar a funcionalidade.\nOutro comentário com mais informações.\n\nMais um comentário para expandir e ver o que acontece!", author: 'Romulo' },
        { feedback: "Esse é um exemplo de comentário longo para testar a funcionalidade.\nOutro comentário com mais informações.\n\nMais um comentário para expandir e ver o que acontece!", author: 'Romulo' },
        { feedback: "Esse é um exemplo de comentário longo para testar a funcionalidade.\nOutro comentário com mais informações.\n\nMais um comentário para expandir e ver o que acontece!", author: 'Romulo' },

    ]);

    const [expandedIndex, setExpandedIndex] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState(null);  // Estado para armazenar os user
    const token = useAuth().user.token
    //   const [feedbacks, setFeedbacks] = useState([]);

    const handleAddComment = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            // let result = await fetchApi('publish')
            setFeedbacks([...feedbacks, newComment]);
            setNewComment("");
        }
    };

    const toggleComment = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };
    useEffect(() => {
        // validar quais posts podem ser requisitados com base no usuario
        const fetchUser = async () => {
                let result = await fetchApi(`v1/user/${Feedbacks.author}`, user, 'GET', token)
                if (!result.status)
                    return
                setUser(result.result)
            }
        fetchUser();
    }, [Feedbacks, user, token])
    return (
        <div style={{ backgroundColor: '', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
            {feedbacks?.map((comment, index) => {
                const { feedback } = comment
                const  author  = user?.name
                // Exibe parte do texto ou o texto completo, dependendo se está expandido ou não
                const isExpanded = expandedIndex === index;
                const displayText = isExpanded ? feedback : feedback.slice(0, Math.ceil(feedback.length * 0.5)) + '...';
                return (
                    <div className=''
                        key={index}
                        onClick={() => toggleComment(index)}
                        style={{ cursor: 'pointer', margin: '5px 0', color: '#333', padding: '16px', backgroundColor: isExpanded ? '#efefef' : '#fff' }}
                    >
                        <div class="d-flex">
                            <img class="rounded-circle" width="25" src="https://picsum.photos/50/50" alt="" />
                            <div class="h7 text-muted px-2">
                            <a style={{ textDecoration: 'none', color: 'grey' }} href={'/profile/user/' + user?.nick}> Autor:{author}</a>
                            </div>
                        </div>
                        <br />
                        {displayText}
                    </div>

                );
            })}

            <form onSubmit={handleAddComment} style={{ marginTop: '20px' }}>
                <textarea
                    className='border'
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escreva um comentário..."
                    style={{
                        width: '100%',
                        maxHeight: '300px',
                        minHeight: '300px',
                        padding: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        marginBottom: '10px'
                    }}
                />
                <button
                    className='border'
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#fff',
                        color: 'black',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Comentar
                </button>
            </form>
        </div>
    );
};

export default Feedbacks;
