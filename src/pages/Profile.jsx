// src/Login.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext'; // Importa o hook useAuth
import { fetchApi, factoryUser } from '../utils/fetch';
import { useNavigate, useParams } from 'react-router-dom';


const Profile = () => {
    const navigate = useNavigate()
    const { profileId } = useParams();

    //auth
    const token = useAuth().user.token
    const [user, setUser] = useState()
    const [anotherUser, setAnotherUser] = useState()
    const [editMode, setEditMode] = useState(false);

    //fields
    const [name, setName] = useState('');
    const [job, setJob] = useState('');
    const [nick, setNick] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    //profile validation
    const [myProfile, setMyProfile] = useState(false)

    const toggleEditMode = () => {
        setEditMode(!editMode);
    }
    const handleSubmit = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        try {
            let result = await fetchApi(`v1/update/user/${user.userId}`, 'POST', { name, nick, email, job })
            if (!result.status)
                throw new Error(result.result);
            //implement email verification
            navigate('/profile')
            // Aqui você pode redirecionar para outra página ou fazer outra ação
        } catch (error) {
            setError(error.message);
        }
    };
    navigate(`/profile/${profileId}`)
    useEffect(() => {
        // validar quais posts podem ser requisitados com base no usuario
        const fetchUser = async () => {
            let response;
            if (!token)
                return
            response = await factoryUser(token)
            setUser(response)
    
            if (profileId === response?.nick) {
                setMyProfile(true)
            } else {
                setMyProfile(false)
                response = await fetchApi(`v1/user/nick/${profileId}`, null, 'GET', null, token)
                if (!response.status)
                    setAnotherUser(response.result)
            }
        }
        fetchUser();


    }, [profileId,token])

    if (!myProfile) {
        return (
            <div style={styles.container}>
                <div className='align-items-center' style={{ display: 'flex' }}>
                    <img class="rounded-circle" width="65" style={{}} src="https://picsum.photos/50/50" alt="profile" />
                </div>
                <br />
                {/* <img src={user.profilePicture} alt="Foto de Perfil" style={styles.profilePicture} /> */}
                <h4>{anotherUser?.name}</h4><h5> ({anotherUser?.nick})</h5>
                <p><strong>Email:</strong> {anotherUser?.email}</p>
                <p><strong>Profissão:</strong> {anotherUser?.job}</p>
            </div>

        );
    } else if (myProfile) {
        return (
            <div style={styles.container}>
                <div className='align-items-center' style={{ display: 'flex' }}>
                    <img class="rounded-circle" width="65" style={{}} src="https://picsum.photos/50/50" alt="profile" />
                </div>
                <br />
                {/* <img src={user.profilePicture} alt="Foto de Perfil" style={styles.profilePicture} /> */}
                <h4>{user?.name}</h4><h5> ({user?.nick})</h5>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Profissão:</strong> {user?.job}</p>
            </div>

        );
    }
    else if (myProfile && editMode) {
        return (
            <div className='container d-flex'>

                <div style={styles.container}>
                    <div className='align-items-center' style={{ display: 'flex' }}>
                        <img class="rounded-circle" width="65" style={{}} src="https://picsum.photos/50/50" alt="profile" />
                        <button onClick={toggleEditMode} style={{ maxHeight: 'fit-content', marginLeft: '70%' }}>x</button>
                    </div>
                    <form className="col-md-12 p-10" onSubmit={handleSubmit}>
                        <br />
                        {/* <img src={user.profilePicture} alt="Foto de Perfil" style={styles.profilePicture} /> */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nome:</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                value={user.name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nick:</label>
                            <input
                                type="text"
                                id="nick"
                                className="form-control"
                                value={user.nick}
                                onChange={(e) => setNick(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">E-mail:</label>
                            <input
                                type="text"
                                id="email"
                                className="form-control"
                                value={user.email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="job" className="form-label">Nivel Profissional:</label>
                            <input
                                type="text"
                                id="job"
                                className="form-control"
                                value={user.job}
                                onChange={(e) => setJob(e.target.value)}
                                required
                            />
                        </div>
                        <button className='btn btn-primary col-md-12 '>Save</button>
                        {error && <p className="text-danger mt-3">{error}</p>}
                    </form>


                </div >
            </div>
        );
    } 
};

const styles = {
    container: {
        textAlign: "left",
        maxWidth: "400px",
        margin: "0 auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: '40px'
    },
    profilePicture: {
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        objectFit: "cover",
        marginBottom: "20px"
    }
};


export default Profile;
