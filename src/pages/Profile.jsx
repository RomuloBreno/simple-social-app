import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { fetchApi } from '../utils/fetch';
import ProfilePosts from '../components/post/ProfilePosts';
import { useNavigate, useParams, Link } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const { profileNick } = useParams();

    const { data } = useAuth();
    const user = data?.user;
    const { name, nick, job, email } = user || {};

    const [anotherUser, setAnotherUser] = useState(null);
    const userPageId = anotherUser?._id ? anotherUser?._id : user?._id
    const [editMode, setEditMode] = useState(false);
    const [myProfile, setMyProfile] = useState(false);
    const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
    const [youFollowMe, setYouFollowMe] = useState(false);
    const [formData, setFormData] = useState({ name, nick, job, email });
    const [error, setError] = useState('');
    const [viewFollowerOrFollowing, setViewFollowerOrFollowing] = useState(null);
    const [viewFollowers, setViewFollowers] = useState(false);
    const [viewFollowing, setViewFollowing] = useState(false);
    const [loading, setLoading] = useState(false);

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
        if (anotherUser) fetchFollowStatus(anotherUser._id);
    }, [anotherUser, myProfile]);

   
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
        debugger
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
        <div className='container d-flex'  style={{justifyContent:'center'}}>
            <div style={styles.container}>
                <div className="align-items-center" style={{ display: 'flex' }}>
                    <img style={{ margin: '2%' }}
                        className="rounded-circle"
                        width="65"
                        src="https://picsum.photos/50/50"
                        alt="profile"
                    />
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
                        <button style={{ margin: '10%' }} onClick={() => setEditMode(!editMode)}>🖍</button>
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
