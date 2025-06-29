import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { fetchApi } from '../utils/fetch';
import ProfilePosts from '../components/post/ProfilePosts';
import { useNavigate, useParams, Link } from 'react-router-dom';
import CircleImage from '../components/images/CircleImage';

const Profile = () => {
    const navigate = useNavigate();
    const { profileNick } = useParams();

    const { data } = useAuth();
    const { imageProfile } = useAuth();
    const user = data?.user;
    const { name, nick, job, email, pathImage } = user || {};

    const [anotherUser, setAnotherUser] = useState(null);
    const userPageId = anotherUser?._id ? anotherUser?._id : user?._id
    const [editMode, setEditMode] = useState(false);
    const [myProfile, setMyProfile] = useState(false);
    const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
    const [youFollowMe, setYouFollowMe] = useState(false);
    const [formData, setFormData] = useState({ name, nick, job, email, pathImage });
    const [error, setError] = useState('');
    const [viewFollowerOrFollowing, setViewFollowerOrFollowing] = useState(null);
    const [viewFollowers, setViewFollowers] = useState(false);
    const [viewFollowing, setViewFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageProfile2, setImageProfile2] = useState();
    const [selectedFile, setSelectedFile] = useState();
    // const usersMock = ([
    //     { name: 'John Doe', nick: 'johnd' },
    //     { name: 'Jane Smith', nick: 'janes' },
    //     { name: 'Emily Clark', nick: 'emilyc' },
    //     { name: 'Michael Brown', nick: 'michaelb' },
    //     { name: 'Sarah Davis', nick: 'sarahd' },
    //     { name: 'Chris Johnson', nick: 'chrisj' },
    //     { name: 'Patricia Wilson', nick: 'patriciaw' },
    //   ]);
    useEffect(() => {
        if (profileNick === user?.nick) {
            setMyProfile(true);
            setAnotherUser(null);
            fetchFollowStats(user._id);
        } else {
            setMyProfile(false);
            fetchAnotherUser(profileNick);
        }
        setViewFollowers(false)
        setViewFollowing(false)
    }, [profileNick, user, data, userPageId]);

    useEffect(() => {
    }, [imageProfile]);

    useEffect(() => {
        const fetchImages = () => {
            if (pathImage) {
                setImageProfile2(`https://storage-fdback.s3.us-east-2.amazonaws.com/temp/profile/${user?._id}/${user?._id}-${pathImage}`);
            }
        };
        // fetchImages();
    }, [data?.user, data?.token, data?.imageProfile]);


    //toggles
    const toggleFollowers = (e) => {
        setLoading(true)
        setViewFollowing(false);//false
        setViewFollowers(!viewFollowers);//true
        if (viewFollowers == false) fetchFollowsSelect(e.target.value)
        setLoading(false)
    }
    const toggleFollowings = (e) => {
        setLoading(true)
        setViewFollowers(false);
        setViewFollowing(!viewFollowing);
        if (viewFollowing == false) fetchFollowsSelect(e.target.value)
        setLoading(false)
    }

    //fetch
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
            const { qtdFollowers, qtdFollowing } = result.result === null ? { qtdFollowers: 0, qtdFollowing: 0 } : result.result
            setFollowStats({ followers: qtdFollowers, following: qtdFollowing });
        }
    };
    const fetchFollowsSelect = async (followersOrFollowing) => {
        if (!followersOrFollowing)
            return
        const result = await fetchApi(`v1/${followersOrFollowing}/user/${userPageId}`, null, 'GET', null, data?.token)
        if (!result.status)
            return
        setViewFollowerOrFollowing(result.result)
    };
    const fetchFollowStatus = async (id) => {
        const result = await fetchApi(`v1/you-follow-me/${id}/${user._id}`, null, 'GET', null, data?.token);
        if (result.status) {
            setYouFollowMe(result.result);
        }
    };

    //handlers
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
        

        //send image to storage
        const keyPath = `profile/${data?.user._id}/${data?.user._id}-${selectedFile[0]?.name}`;
        const signedUrl = await fetchApi('auth/s3-post-img-url', null, 'POST', { key: keyPath, fileName: selectedFile[0]?.name }, data?.token);

        if (!signedUrl.status) {
            throw new Error(`Error getting signed URL for file ${selectedFile[0].name}`);
        }

        const storageStatus = await fetch(signedUrl.result, {
            method: 'PUT',
            headers: { 'Content-Type': selectedFile[0].type },
            body: selectedFile[0],
        });


        if (!storageStatus.ok) {
            const storageResponseJson = await storageStatus.json();
            throw new Error(`Error uploading file ${selectedFile[0].name}: ${storageResponseJson.message}`);
        }

        if (result.status) {
            window.location.href = `/profile/${user.nick}`;
        } else {
            setError(result.message);
        }
    };

    //components
    const Follows = (users) => {
        if (loading) {
            return <div className="container" style={styles.container}>Carregando...</div>;
        }

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
    const renderProfileDetails = (profile) => (
        <>
            <div className='container d-grid' style={{ justifyContent: 'center' }}>
                <div style={styles.container}>
                    <div className="align-items-center" style={{ display: 'flex' }}>
                        <CircleImage 
                        src={imageProfile || `https://storage-fdback.s3.us-east-2.amazonaws.com/temp/profile/${user?._id}/${user?._id}-${user?.pathImage}`}
                        alt='Profile'
                        />
                        {/* <img style={{ margin: '2%' }}
                            className="rounded-circle"
                            width="65"
                            src={imageProfile || `https://storage-fdback.s3.us-east-2.amazonaws.com/temp/profile/${user?._id}/${user?._id}-${user?.pathImage}`}
                            alt="profile"
                        /> */}
                        {!myProfile ? (<>
                            <div style={{ maxHeight: 'fit-content', padding: '10px' }}>
                                <button onClick={() => handleFollowToggle(profile?._id)}>
                                    {youFollowMe ? 'Deixar' : 'Seguir'}
                                </button>
                            </div>

                        </>) : (<></>)}
                        <div className="p-2">
                            <span>{followStats.followers | 0}</span>
                            <br />
                            <button value='followers' onClick={toggleFollowers}>followers</button>
                        </div>
                        <div className="p-2">
                            <span >{followStats.following | 0}</span>
                            <br />
                            <button value='following' onClick={toggleFollowings}>following</button>
                        </div>
                        {myProfile && (
                            <button style={{}} onClick={() => setEditMode(!editMode)}>🖍</button>
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
                    <div>
                        {(viewFollowers || viewFollowing) && viewFollowerOrFollowing ? (<>{Follows(viewFollowerOrFollowing)}</>) : (<></>)}
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                </div>
            </div>
            <br />
            <ProfilePosts profileId={profile?._id} />
        </>
    );
    const FilePreview = ({ file, onDelete }) => {
        return (
            <div className="d-flex mt-3" style={{ maxWidth: '50%' }}>
                <div style={{ zIndex: 9 }}>
                    <img
                        src={URL.createObjectURL(file[0] || null)}
                        alt={`Preview ${file[0].name}`}
                        style={{ width: '100%', maxWidth: '150px', height: 'auto' }}
                    />
                </div>
                <div style={{ zIndex: 10, position: 'absolute', marginRight: '100%' }}>
                    <button onClick={() => onDelete(file[0])} className="btn btn-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    };
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files);
        setFormData({ ...formData, pathImage: e.target.files[0].name })
    }
    //page logic

    if (!myProfile) {
        return (
            <div>
                {renderProfileDetails(anotherUser || {})}
            </div>
        );
    }

    if (editMode) {
        return (
            <div className='container d-flex' style={{ justifyContent: 'center' }}>
                <div className='container' style={styles.container}>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <img style={{ margin: '2%' }}
                                className="rounded-circle"
                                width="65"
                                src={imageProfile}
                                alt="profile"
                            />
                            <div className="form-group">
                                <input
                                    type="file"
                                    className="custom-file-input"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {
                                    selectedFile &&
                                    <FilePreview key={selectedFile.name} file={selectedFile} />
                                }

                            </div>
                        </div>

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
    container: {
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        margin: '0',
    },
    userContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #eee',
    },
    unfollowButton: {
        cursor: 'pointer !important',
    },
    scrollContainer: {
        textAlign: 'left',
        maxWidth: '400px',
        margin: '0 auto',
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '20px',
        maxHeight: '300px', // Altura máxima para ativar o scroll
        overflowY: 'auto',  // Barra de rolagem vertical
    },
    link: {
        textDecoration: 'none',
        color: 'black',
    },
}

export default Profile;
