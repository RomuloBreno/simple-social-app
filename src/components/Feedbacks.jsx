import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { fetchApi } from '../utils/fetch';

import styled from 'styled-components';


const Feedbacks = ({ postId }) => {
    //mock
    // const [feedbacks, setFeedbacks] = useState([
    //     // { feedback: "Esse é um exemplo de comentário longo para testar a funcionalidade.\nOutro comentário com mais informações.\n\nMais um comentário para expandir e ver o que acontece!", author: 'Romulo' },
    //     // { feedback: "Esse é um exemplo de comentário longo para testar a funcionalidade.\nOutro comentário com mais informações.\n\nMais um comentário para expandir e ver o que acontece!", author: 'Romulo' },
    //     // { feedback: "Esse é um exemplo de comentário longo para testar a funcionalidade.\nOutro comentário com mais informações.\n\nMais um comentário para expandir e ver o que acontece!", author: 'Romulo' },

    // ]);
    const [loading, setLoading] = useState(false); // Estado para gerenciar o carregamento
    const [expandedIndex, setExpandedIndex] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState([]);  // Estado para armazenar os user
    // const [index, setIndex] = useState(0);
    const data = useAuth().data

    const [feedbacks, setFeedbacks] = useState([]);
    const handleAddComment = async (e) => {
        setLoading(true)
        
        const arrFeedbackForUser = []
        e.preventDefault();
        if (newComment.trim()) {
            const feedbackCreate = await fetchApi(`v1/publish-feedback/${postId}`, null, 'POST', { content: newComment, postId: postId, author: data?.user._id }, data?.token)
            if (!feedbackCreate.status)
                return
            arrFeedbackForUser.push({ author: data?.user.nick, content: newComment })
            setFeedbacks(prevArr => [...prevArr, arrFeedbackForUser]);
            setNewComment("");
            setLoading(false)
        }
        setLoading(false)
    };
    const toggleComment = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };
    const getFeedbacks = async () => {
        const arrFeedbackForUser = [];
        if(!postId)
            return
        let getFeedback = await fetchApi(`v1/feedbacks/${postId}`, user, 'GET', null, data?.token)
        if (!getFeedback.status)
            return


        getFeedback.result.forEach(async comment => {
            let authorFeedback = await fetchApi(`v1/user/${comment?.author}`, null, 'GET', null, data?.token)
            if (!authorFeedback.status)
                return
            setUser(prevUser => [...prevUser, authorFeedback?.result])
            arrFeedbackForUser.push({ author: authorFeedback.result.nick, content: comment.content })
            setFeedbacks(arrFeedbackForUser);
        });
    }
    function formComment(){
        return(
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
                    minHeight: '100px',
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
        )
    }
    
    useEffect(() => {
        getFeedbacks();
    }, [data?.user])

    // useEffect(() => {
    // }, [feedbacks])

    if (feedbacks.length) {
        // if(false){
        return (
            <div style={{ backgroundColor: '', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
                {feedbacks.map((comment, index) => {
                    ++index
                    const { author, content } = comment
                    // Exibe parte do texto ou o texto completo, dependendo se está expandido ou não
                    const isExpanded = expandedIndex === index;
                    const displayText = isExpanded ? content : content?.slice(0, Math.ceil(content?.length * 0.5)) + '...';
                    return (
                        <div className=''
                            key={index}
                            onClick={() => toggleComment(index)}
                            style={{ cursor: 'pointer', margin: '5px 0', color: '#333', padding: '16px', backgroundColor: isExpanded ? '#efefef' : '#fff' }}
                        >
                            <br />
                            {displayText}
                            <div className="d-flex">
                                <img className="rounded-circle" width="25" src="https://picsum.photos/50/50" alt="" />
                                <div className="h7 text-muted px-2">
                                    <UrlProfile>

                                    <a style={{ textDecoration: 'none', color: 'grey' }} href={'/profile/' + author}> Autor:{author}</a>
                                    </UrlProfile>
                                </div>
                            </div>
                        </div>
                    );

                })}
                <form onSubmit={handleAddComment} style={{ marginTop: '20px' }}>

                {loading ? (
                    <div style={{ textAlign: 'center', padding:'10px', width: '100%', height: '100%', zIndex: '12',alignContent: 'center', background: '#808080ad' }}>
                        <h4>buscando feedbacks...</h4>
                        <div className="container spinner-border p-10" role="status" >
                            <span className="sr-only"></span>
                        </div>
                    </div>
                ) : (
                    <div>

                    <textarea
                        className='border'
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escreva um comentário..."
                        style={{
                            width: '100%',
                            maxHeight: '300px',
                            minHeight: '100px',
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
                    </div>
                )}
                </form>
            </div>
        );
    } else {
        return (
            <div >
                <div style={{padding:'10%'}}>
                    <h4>Nenhum feedback encontrado...</h4>
                </div>
                {formComment()}
            </div>

            
        )
    }
    
};


const UrlProfile = styled.div`
  a {
    color: inherit; // Cor inicial do link
    text-decoration: none; // Remove o sublinhado padrão

    &:hover {
      color: blue; // Cor azul no hover
    }
  }
`;

export default Feedbacks;
