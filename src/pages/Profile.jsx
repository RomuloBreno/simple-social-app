// // src/Login.js
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/authContext'; // Importa o hook useAuth
// import { fetchApi } from '../utils/fetch';
// import ProfilePosts from '../components/ProfilePosts';
// import { useNavigate, useParams } from 'react-router-dom';


// const Profile = () => {

//     const navigate = useNavigate()
//     const { profileNick } = useParams();

//     //auth
//     const data = useAuth().data
//     const { name, nick, job, email } = data?.user
//     const [user, setUser] = useState(data?.user)
//     const [anotherUser, setAnotherUser] = useState()
//     const [editMode, setEditMode] = useState(false);
//     const [youFollowMe, setYouFollowMe] = useState();
//     const [followers, setFollowers] = useState();
//     const [following, setFollowing] = useState();
//     // controle de click no follow para atualzar contagem
//     const [followClick, setFollowClick] = useState()

//     //fields
//     const [formName, setFormName] = useState(name);
//     const [formJob, setFormJob] = useState(job);
//     const [formNick, setFormNick] = useState(nick);
//     const [formEmail, setFormEmail] = useState(email);
//     const [error, setError] = useState('');

//     //profile validation
//     const [myProfile, setMyProfile] = useState(false)


//     const toggleEditMode = () => {
//         if (data?.user.nick === profileNick)
//             setEditMode(!editMode);
//     }
//     const handlerFollow = async () => {

//         let result = await fetchApi(`v1/follow-user/${anotherUser?._id}`, null, 'POST', { follower: user?._id }, data?.token)
//         if (!result.status)
//             return false
//         setFollowClick(true)
//     }
//     const handlerUnfollow = async () => {

//         let result = await fetchApi(`v1/unfollow-user/${anotherUser?._id}`, null, 'POST', { follower: user?._id }, data?.token)
//         if (!result.status)
//             return false
//         setFollowClick(false)
//     }
//     const getYouFollowMe = async () => {
//         let YouFollowMe = await fetchApi(`v1/you-follow-me/${anotherUser?._id}/${user?._id}`, null, 'GET',null, data?.token)
//         if (!YouFollowMe.status)
//             return false
//         setYouFollowMe(YouFollowMe.result)
//     }
//     const getFollows = async (id) => {

//         if(id==undefined)
//             return false
//         let getFollows = await fetchApi(`v1/follows-qtd/${id}`, null, 'GET', null, data?.token)
//         if (!getFollows.status)
//             return false
//         const { qtdFollowers, qtdFollowing } = getFollows.result === null ? { qtdFollowers:0, qtdFollowing:0 } : getFollows.result
//         setFollowers(qtdFollowers)
//         setFollowing(qtdFollowing)
//     }
//     const handleSubmit = async (e) => {

//         e.preventDefault(); // Impede o recarregamento da página
//         try {
//             let result = await fetchApi(`v1/update/user/${user._id}`, null, 'POST', { name: formName, nick: formNick, email: formEmail, job: formJob }, data?.token)
//             if (!result.status)
//                 return false
//             //implement email verification
//             window.location.href = `/profile/${data?.user.nick}`
//             // Aqui você pode redirecionar para outra página ou fazer outra ação
//         } catch (error) {
//             setError(error.message);
//         }
//     };
//     const fetchUser = async () => {
//         let idCommum = ''
//         if (profileNick === data?.user.nick) {
//             setMyProfile(true)
//             setAnotherUser(null)
//             idCommum = data?.user?._id

//         } else {
//             setMyProfile(false)
//             if(!profileNick)
//                 return
//             const userByProfileParam = await fetchApi(`v1/user/nick/${profileNick}`, null, 'GET', null, data?.token)
//             if (userByProfileParam?.status)
//                 setAnotherUser(userByProfileParam.result)
//             if (userByProfileParam?.status === false)
//                 navigate(`/profile/${user?.nick}`)
//             idCommum = userByProfileParam?.result._id
//         }
//         //get follows by user page
//         getFollows(idCommum);
//     } 

//     useEffect(() => {
//         //valida se a página é myProfile ou anotherProfile
//         fetchUser();

//     }, [data?.user, profileNick, editMode, followClick, following, followers])

//     useEffect(() => {
//         // validar quais posts podem ser requisitados com base no usuario
//         if(anotherUser?._id && !myProfile){
//             getYouFollowMe()
//         }

//     }, [data?.user, profileNick, editMode,followClick])

//     if (!myProfile) {
//         return (
//             <div>
//                 <div style={styles.container}>
//                     <div className='align-items-center' style={{ display: 'flex' }}>
//                         <img className="rounded-circle" width="65" style={{}} src="https://picsum.photos/50/50" alt="profile" />
//                         {!youFollowMe ? (
//                             <div style={{ maxHeight: 'fit-content', padding: '10px' }}>
//                                 <button onClick={handlerFollow}>Seguir</button>
//                             </div>

//                         ) : (
//                             <div style={{ maxHeight: 'fit-content', padding: '10px' }}>
//                                 <button onClick={handlerUnfollow} style={{ maxHeight: 'fit-content' }}>Deixar</button>
//                             </div>
//                         )}
//                         <div className='p-2'>
//                             <span>{followers? followers : 0}</span>
//                             <br />
//                             <span>Seguidores</span>
//                         </div>
//                         <div className='p-2'>
//                             <span>{following ? following : 0}</span>
//                             <br />
//                             <span>Seguindo</span>
//                         </div>
//                     </div>
//                     <div></div>
//                     <br />
//                     {/* <img src={user.profilePicture} alt="Foto de Perfil" style={styles.profilePicture} /> */}
//                     <h4>{anotherUser?.name}</h4><h5> ({anotherUser?.nick})</h5>
//                     <p><strong>Email:</strong> {anotherUser?.email}</p>
//                     <p><strong>Profissão:</strong> {anotherUser?.job}</p>
//                 </div>
//                 <br />
//                 <br />
//                 <br />
//                 <ProfilePosts anotherprofileNick={anotherUser?._id}/>
//             </div>

//         );
//     } 
//     else if (myProfile && !editMode) {
//         return (
//             <div>
//                 <div style={styles.container}>
//                     <div className='align-items-center' style={{ display: 'flex' }}>
//                         <img className="rounded-circle" width="65" style={{}} src="https://picsum.photos/50/50" alt="profile" />
//                         <div className='p-2'>
//                             <span>{followers? followers : 0}</span>
//                             <br />
//                             <span>Seguidores</span>
//                         </div>
//                         <div className='p-2'>
//                             <span>{following ? following : 0}</span>
//                             <br />
//                             <span>Seguindo</span>
//                         </div>
//                         <button onClick={toggleEditMode} style={{ maxHeight: 'fit-content', marginLeft: '10%' }}>🖍</button>
//                     </div>
//                     <br />
//                     {/* <img src={user.profilePicture} alt="Foto de Perfil" style={styles.profilePicture} /> */}
//                     <h4>{user?.name}</h4><h5> ({user?.nick})</h5>
//                     <p><strong>Email:</strong> {user?.email}</p>
//                     <p><strong>Profissão:</strong> {user?.job}</p>
//                 </div>
//                 <br />
//                 <br />
//                 <br />
//                 <ProfilePosts anotherprofileNick={''}/>

//             </div>

//         );
//     }
//     else if (myProfile && editMode) {
//         return (
//             <div className='container d-flex'>

//                 <div style={styles.container}>
//                     <div className='align-items-center' style={{ display: 'flex' }}>
//                         <img className="rounded-circle" width="65" style={{}} src="https://picsum.photos/50/50" alt="profile" />
//                         <button onClick={toggleEditMode} style={{ maxHeight: 'fit-content', marginLeft: '70%' }}>x</button>
//                     </div>
//                     <form className="col-md-12 p-10" onSubmit={handleSubmit}>
//                         <br />
//                         {/* <img src={user.profilePicture} alt="Foto de Perfil" style={styles.profilePicture} /> */}
//                         <div className="mb-3">
//                             <label htmlFor="name" className="form-label">Nome:</label>
//                             <input
//                                 type="text"
//                                 id="name"
//                                 className="form-control"
//                                 value={formName}
//                                 onChange={(e) => setFormName(e.target.value)}
//                                 required
//                                 maxLength={70}
//                             />
//                         </div>

//                         <div className="mb-3">
//                             <label htmlFor="nick" className="form-label">Nick:</label>
//                             <input
//                                 type="text"
//                                 id="nick"
//                                 className="form-control"
//                                 value={formNick}
//                                 onChange={(e) => setFormNick(e.target.value)}
//                                 required
//                                 maxLength={30}
//                             />
//                         </div>

//                         <div className="mb-3">
//                             <label htmlFor="email" className="form-label">E-mail:</label>
//                             <input
//                                 type="text"
//                                 id="email"
//                                 className="form-control"
//                                 value={formEmail}
//                                 onChange={(e) => setFormEmail(e.target.value)}
//                                 required
//                                 maxLength={70}
//                             />
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="job" className="form-label">Nivel Profissional:</label>
//                             <input
//                                 type="text"
//                                 id="job"
//                                 className="form-control"
//                                 value={formJob}
//                                 onChange={(e) => setFormJob(e.target.value)}
//                                 required
//                                 placeholder='Senior | VueJs | NodeJS'
//                                 maxLength={40}
//                             />
//                         </div>
//                         <button className='btn btn-primary col-md-12 '>Save</button>
//                         {error && <p className="text-danger mt-3">{error}</p>}
//                     </form>


//                 </div >
//             </div>
//         );
//     }
// };

// const styles = {
//     container: {
//         textAlign: "left",
//         maxWidth: "400px",
//         margin: "0 auto",
//         border: "1px solid #ddd",
//         borderRadius: "8px",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//         padding: '40px'
//     },
//     profilePicture: {
//         width: "150px",
//         height: "150px",
//         borderRadius: "50%",
//         objectFit: "cover",
//         marginBottom: "20px"
//     }
// };


// export default Profile;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { fetchApi } from '../utils/fetch';
import ProfilePosts from '../components/ProfilePosts';
import { useNavigate, useParams } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const { profileNick } = useParams();

    const { data } = useAuth();
    const user = data?.user;
    const { name, nick, job, email } = user || {};

    const [anotherUser, setAnotherUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [myProfile, setMyProfile] = useState(false);
    const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
    const [youFollowMe, setYouFollowMe] = useState(false);
    const [formData, setFormData] = useState({ name, nick, job, email });
    const [error, setError] = useState('');

    useEffect(() => {
        if (profileNick === user?.nick) {
            setMyProfile(true);
            setAnotherUser(null);
            fetchFollowStats(user._id);
        } else {
            setMyProfile(false);
            fetchAnotherUser(profileNick);
        }
    }, [profileNick, user, data]);

    useEffect(() => {
        if (anotherUser) fetchFollowStatus(anotherUser._id);
    }, [anotherUser, myProfile]);

    const fetchAnotherUser = async (nick) => {
        const result = await fetchApi(`v1/user/nick/${nick}`, null, 'GET', null, data?.token);
        if (result.status) {
            setAnotherUser(result.result);
            fetchFollowStats(result.result._id);
        } else {
            navigate(`/profile/${user.nick}`);
        }
    };

    const fetchFollowStats = async (id) => {
        debugger
        const result = await fetchApi(`v1/follows-qtd/${id}`, null, 'GET', null, data?.token);
        if (result.status) {
            const { qtdFollowers, qtdFollowing } = result.result === null ? { qtdFollowers: 0, qtdFollowing: 0 } : result.result
            setFollowStats({ followers: qtdFollowers, following: qtdFollowing });
        }
    };

    const fetchFollowStatus = async (id) => {
        const result = await fetchApi(`v1/you-follow-me/${id}/${user._id}`, null, 'GET', null, data?.token);
        if (result.status) {
            setYouFollowMe(result.result);
        }
    };

    const handleFollowToggle = async () => {
        const url = youFollowMe ? `v1/unfollow-user/${anotherUser._id}` : `v1/follow-user/${anotherUser._id}`;
        const method = 'POST';
        const result = await fetchApi(url, null, method, { follower: user?._id }, data?.token);

        if (result.status) {
            setYouFollowMe(!youFollowMe);
            fetchFollowStats(anotherUser._id);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await fetchApi(
            `v1/update/user/${user._id}`,
            null,
            'POST',
            formData,
            data?.token
        );

        if (result.status) {
            window.location.href = `/profile/${user.nick}`;
        } else {
            setError(result.message);
        }
    };

    const renderProfileDetails = (profile) => (
        <>
            <div style={styles.container}>
                <div className="align-items-center" style={{ display: 'flex' }}>
                    <img style={{margin:'10px'}}
                        className="rounded-circle"
                        width="65"
                        src="https://picsum.photos/50/50"
                        alt="profile"
                    />
                    {!myProfile ? (<>
                     <div style={{ maxHeight: 'fit-content', padding: '10px' }}>
                    <button onClick={handleFollowToggle}>
                        {youFollowMe ? 'Deixar' : 'Seguir'}
                    </button>
                    </div>
                    
                    </>) :(<></>)  }
                    <div className="p-2">
                        <span>{followStats.followers | 0}</span>
                        <br />
                        <span>Seguidores</span>
                    </div>
                    <div className="p-2">
                        <span>{followStats.following | 0}</span>
                        <br />
                        <span>Seguindo</span>
                    </div>
                    {myProfile && (
                        <button onClick={() => setEditMode(!editMode)}>🖍</button>
                    )}
                </div>
                <br />
                <h4>{profile.name}</h4>
                <h5>({profile.nick})</h5>
                <p>
                    <strong>Email:</strong> {profile.email}
                </p>
                <p>
                    <strong>Profissão:</strong> {profile.job}
                </p>
            </div>
            <div>
                <br />
                <br />
                <br />
                <br />
                <ProfilePosts profileId={profile?._id} />
            </div>
        </>
    );

    if (!myProfile) {
        return (
            <div>
                {renderProfileDetails(anotherUser || {})}
            </div>
        );
    }

    if (editMode) {
        return (
            <div style={styles.container}>
                <form onSubmit={handleSubmit}>
                    {['name', 'nick', 'email', 'job'].map((field) => (
                        <div key={field} className="mb-3">
                            <label htmlFor={field} className="form-label">
                                {field.charAt(0).toUpperCase() + field.slice(1)}:
                            </label>
                            <input
                                id={field}
                                type="text"
                                value={formData[field]}
                                className="form-control"
                                onChange={(e) =>
                                    setFormData({ ...formData, [field]: e.target.value })
                                }
                            />
                        </div>
                    ))}
                    <button type="submit" className="btn btn-primary">
                        Save
                    </button>
                    {error && <p className="text-danger">{error}</p>}
                </form>
            </div>
        );
    }

    return <>{renderProfileDetails(user)}</>;
};

const styles = {
    container: {
        textAlign: 'left',
        maxWidth: '400px',
        margin: '0 auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
    },
};

export default Profile;
