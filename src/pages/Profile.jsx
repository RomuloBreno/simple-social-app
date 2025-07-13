// ... seus imports
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { fetchApi } from '../utils/fetch';
import ProfilePosts from '../components/post/ProfilePosts';
import { useNavigate, useParams, Link } from 'react-router-dom';
import CircleImage from '../components/images/CircleImage';
import userImgNotFind from '../images/user.png';
import ErrorSpan from '../components/error/ErrorSpan';

const Profile = () => {
    const navigate = useNavigate();
    const { profileNick } = useParams();

    const { data } = useAuth();
    const { imageProfile } = useAuth();
    const user = data?.user;
    const { name, nick, job, email, pathImage } = user || {};

    const [anotherUser, setAnotherUser] = useState(null);
    const userPageId = anotherUser?._id ? anotherUser?._id : user?._id;
    const [editMode, setEditMode] = useState(false);
    const [myProfile, setMyProfile] = useState(false);
    const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
    const [youFollowMe, setYouFollowMe] = useState(false);
    const [formData, setFormData] = useState({ name, nick, job, email, pathImage });
    const [error, setError] = useState('');
    const [viewFollowerOrFollowing, setViewFollowerOrFollowing] = useState(null);
    const [viewFollowers, setViewFollowers] = useState(false);
    const [viewFollowing, setViewFollowing] = useState(false);
    const [loading, setLoading] = useState(true); // 🆕 inicia em true
    // const [imageProfile2, setImageProfile2] = useState();
    const [selectedFile, setSelectedFile] = useState();

    useEffect(() => {
        setLoading(true); // 🆕 inicia loading ao mudar perfil
        if (profileNick === user?.nick) {
            setMyProfile(true);
            setAnotherUser(null);
            fetchFollowStats(user._id).finally(() => setLoading(false)); // 🆕
        } else {
            setMyProfile(false);
            fetchAnotherUser(profileNick).finally(() => setLoading(false)); // 🆕
        }
        setViewFollowers(false);
        setViewFollowing(false);
    }, [profileNick, user, data, userPageId]);

    useEffect(() => {
        if (pathImage) {
            // setImageProfile2(`${process.env.REACT_APP_URL_S3}/temp/profile/${user?._id}/${user?._id}-${pathImage}`);
        }
    }, [data?.user, data?.token, data?.imageProfile]);

    const toggleFollowers = (e) => {
        setLoading(true);
        setViewFollowing(false);
        setViewFollowers(!viewFollowers);
        if (!viewFollowers) fetchFollowsSelect("followers").finally(() => setLoading(false)); // 🆕
        else setLoading(false); // 🆕
    };
    const toggleFollowings = (e) => {
        setLoading(true);
        setViewFollowers(false);
        setViewFollowing(!viewFollowing);
        if (!viewFollowing) fetchFollowsSelect("following").finally(() => setLoading(false)); // 🆕
        else setLoading(false); // 🆕
    };

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
        const result = await fetchApi(`v1/follows-qtd/${id}`, null, 'GET', null, data?.token);
        if (result.status) {
            const { qtdFollowers, qtdFollowing } = result.result ?? { qtdFollowers: 0, qtdFollowing: 0 };
            setFollowStats({ followers: qtdFollowers, following: qtdFollowing });
        }
    };

    const fetchFollowsSelect = async (followersOrFollowing) => {
        if (!followersOrFollowing) return;
        const result = await fetchApi(`v1/${followersOrFollowing}/user/${userPageId}`, null, 'GET', null, data?.token);
        if (result.status) {
            setViewFollowerOrFollowing(result.result);
        }
    };

    const fetchFollowStatus = async (id) => {
        const result = await fetchApi(`v1/you-follow-me/${id}/${user._id}`, null, 'GET', null, data?.token);
        if (result.status) {
            setYouFollowMe(result.result);
        }
    };

    const handleFollowToggle = async (id) => {
        const url = youFollowMe ? `v1/unfollow-user/${id}` : `v1/follow-user/${id}`;
        const method = 'POST';
        const result = await fetchApi(url, null, method, { follower: user?._id }, data?.token);
        if (result.status) {
            setYouFollowMe(!youFollowMe);
            fetchFollowStats(id);
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
        if(!selectedFile) window.location.href = `/profile/${user.nick}`;
        const keyPath = `profile/${data?.user._id}/${data?.user._id}-${selectedFile[0]?.name}`;
        const signedUrl = await fetchApi('auth/s3-post-img-url', null, 'POST', { key: keyPath, fileName: selectedFile[0]?.name }, data?.token);

        if (!signedUrl.status) throw new Error(`Erro ao gerar URL S3 para ${selectedFile[0].name}`);

        const storageStatus = await fetch(signedUrl.result, {
            method: 'PUT',
            headers: { 'Content-Type': selectedFile[0].type },
            body: selectedFile[0],
        });

        if (!storageStatus.ok) {
            const json = await storageStatus.json();
            throw new Error(`Erro ao subir imagem: ${json.message}`);
        }

        if (result.status) {
            window.location.href = `/profile/${user.nick}`;
        } else {
            setError(result.message);
        }
    };

    const Follows = (users) => {
        return (
            <div className="container" style={styles.scrollContainer}>
                {users?.length > 0 ? (
                    users.map((user) => (
                        <div key={user.nick} style={styles.userContainer}>
                            <Link to={`/profile/${user.nick}`} style={styles.link}>
                                <div>
                                    <strong>{user.name}</strong> ({user.nick})
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>Nenhum usuário encontrado.</p>
                )}
            </div>
        );
    };

    const renderProfileDetails = (profile) => {
        if (loading) return <SkeletonProfile />; // 🆕

        return (
            <>
                <div className='container d-grid' style={{ justifyContent: 'center' }}>
                    <div style={styles.container}>
                        <div className="align-items-center" style={{ display: 'flex' }}>
                            {!myProfile ? (
                                <div style={{ maxHeight: 'fit-content', padding: '10px' }}>
                                    <button className="btn btn-light w-10" onClick={() => handleFollowToggle(profile?._id)}>
                                        {youFollowMe ? 'Deixar' : 'Seguir'}
                                    </button>
                                </div>
                            ) : null}
                            <div className="text-center">

                            <CircleImage
                                src={profile?.pathImage ? imageProfile || `${process.env.REACT_APP_URL_S3}/temp/profile/${profile?._id}/${profile?._id}-${profile?.pathImage}` : userImgNotFind}
                                alt='Profile'
                            />
                            {myProfile && (
                                <>
                                <button className="btn btn-light w-10" onClick={() => setEditMode(!editMode)}>🖍</button>
                                </>
                            )}

                            </div>
                            <div className="p-2">
                                <button type="button" className="btn btn-light" onClick={toggleFollowers}>
                                    Seguidores <span className="badge badge-light" style={{color:'black'}}>{followStats.followers | 0}</span>
                                </button>
                            </div>
                            <div className="p-2">
                                <button type="button" className="btn btn-light" onClick={toggleFollowings}>
                                    Seguindo <span className="badge badge-light" style={{color:'black'}}>{followStats.following | 0}</span>
                                </button>
                            </div>
                        </div>
                        <br />
                        <h4>{profile.name}</h4>
                        <h5>({profile.nick})</h5>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Profissão:</strong> {profile.job}</p>
                    </div>
                    <div id="viewFollows">
                        {(viewFollowers || viewFollowing) && viewFollowerOrFollowing && (
                            <>{Follows(viewFollowerOrFollowing)}</>
                        )}
                    </div>
                </div>
                <br />
                <ProfilePosts profileId={profile?._id} />
            </>
        );
    };

    const FilePreview = ({ file, onDelete }) => (
        <div className="d-flex mt-3" style={{ maxWidth: '50%' }}>
            <div style={{ zIndex: 9 }}>
                <img
                    src={URL.createObjectURL(file[0] || null)}
                    alt={`Preview ${file[0].name}`}
                    style={{ width: '100%', maxWidth: '150px', height: 'auto' }}
                />
            </div>
            <div style={{ zIndex: 10, position: 'absolute', marginRight: '100%' }}>
                <button className="btn btn-danger w-10" onClick={() => onDelete(file[0])}>🗑️</button>
            </div>
        </div>
    );

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files);
        setFormData({ ...formData, pathImage: e.target.files[0].name });
    };

    if (anotherUser) {
        return <div>{renderProfileDetails(anotherUser)}</div>;
    }

    if (editMode) {
        return (
            <div className='container d-flex' style={{ justifyContent: 'center' }}>
                <div className='container' style={styles.container}>
                    <form onSubmit={handleSubmit}>
                        <img className="rounded-circle" width="65" src={imageProfile} alt="profile" />
                        <div className="form-group">
                            <input
                                type="file"
                                className="custom-file-input"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {selectedFile && <FilePreview key={selectedFile.name} file={selectedFile} />}
                        </div>
                        {['name', 'nick', 'email', 'job'].map((field) => (
                            <div key={field} className="mb-3">
                                <label htmlFor={field}>{field.toUpperCase()}:</label>
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
                        <button className="btn btn-primary w-10" type="submit">Salvar</button>
                        {error && <ErrorSpan message={error} />}
                    </form>
                </div>
            </div>
        );
    }

    return <>{renderProfileDetails(user)}</>;
};

// Componente Skeleton
const SkeletonProfile = () => (
    <>
        <div className='container d-grid' style={{ justifyContent: 'center' }}>
            <div style={styles.container}>
                <div className="align-items-center" style={{ display: 'flex' }}>
                    <CircleImage
                        src={''}
                        alt='Profile'
                    />
                    <div style={{ maxHeight: 'fit-content', padding: '10px' }}>
                        <button className="btn btn-light w-10" >
                            { }
                        </button>
                    </div>
                    <div className="p-2">
                        <span>{ }</span>
                        <br />
                        <button className="btn btn-light w-10" value='followers' >followers</button>
                    </div>
                    <div className="p-2">
                        <span>{ }</span>
                        <br />
                        <button className="btn btn-light w-10" value='following' >following</button>
                    </div>
                    <button className="btn btn-light w-10">🖍</button>
                </div>
                <br />
                <h4></h4>
                <h5></h5>
                <p><strong>Email:</strong> </p>
                <p><strong>Profissão:</strong></p>
            </div>

        </div>
        <br />
    </>
);

const styles = {
    container: {
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: 'fit-content',
        margin: '0 auto',
    },
    userContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #eee',
    },
    scrollContainer: {
        maxHeight: '300px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
    },
    link: {
        textDecoration: 'none',
        color: 'black',
    },
};

export default Profile;
