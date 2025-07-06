// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
// import Notify from './notify/Notifys';
import CircleImage from './images/CircleImage';
import CircleImageMobile from './images/CircleImageMobile';
import logo from '../images/logo192.png'
import userImgNotFind from '../images/user.png'

const Header = (dataUser) => {
    const navigate = useNavigate()
    //mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    //valid login
    const [data, setData] = useState()
    const [IsLoged, setIsLoged] = useState()
    
    const [menuOpen, setMenuOpen] = useState(false);
    //user
    const imageProfile = data?.imageProfile;
    const { logout } = useAuth();


    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1368);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setData(dataUser.dataUser)
        setIsLoged(dataUser.validToken)
    }, [dataUser]);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handleLogout = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        logout()
        setIsLoged(false)
        navigate('/')
    };
    const handleLogin = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        navigate('/login')
    };
    const handleRegister = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        navigate('/login')
    };


    // // Lógica de pesquisa
    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     // console.log("Procurando por:", searchQuery);
    //     // Adicione a lógica de pesquisa aqui, como redirecionar ou fazer uma requisição
    // };
    // Atualiza o valor de `isMobile` quando a janela é redimensionada
    return (
        <div className='text-center'>
            <header style={{ display: 'flex', padding: '10px', backgroundColor: '#333', color: '#fff', fontSize: '1em' }}>
                <div style={{width:'10%', position:'relative', left:'10%'}} >
                <a href='/' style={{ textDecoration: 'none' }} >
                    <div>
                        <img src={logo} style={{ width: "40%"}} alt='LogoTipo' />
                    </div>
                    <div>
                        <span className='' style={{color:'white'}}>Fdback</span>

                    </div>
                </a>
                </div>
                {isMobile ? (
                    <>
                        <button onClick={toggleMenu} style={{ background: 'none', border: 'none', marginLeft: '0%', color: 'white', fontSize: '24px', position: 'absolute', right: '10%',zIndex:'20' }}>
                            ☰
                        </button><br/>
                        {menuOpen && (
                            <nav className='' style={{gap: '1em', alignContent:' center', padding:'1em', position: 'absolute', width: '100%', height: '10em', zIndex: '19', backgroundColor: 'rgb(51, 51, 51)', right: '0', borderRadius: '2%', border: '1px solid rgb(51, 51, 51)' }}>
                             <div style={{justifySelf: 'center'}}>
                                {
                                    IsLoged &&
                                    <Link to={`/profile/${data?.user?.nick}`}>
                                        <CircleImageMobile
                                            src={data?.user?.pathImage ? imageProfile || `${process.env.REACT_APP_URL_S3}/temp/profile/${data?.user?._id}/${data?.user?._id}-${data?.user?.pathImage}` : userImgNotFind}
                                            alt='Proile header'
                                        />
                                        {/* <'img' className="rounded-circle" width="65" style={{ padding: '10px' }} src={imageProfile} alt="profile" /> */}
                                    </Link>
                                }
                                </div>   
                                {
                                    !IsLoged &&
                                    <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'white' }}>Home</Link>
                                }
                                {/* {
                                    IsLoged &&
                                    <Link to="/feed" style={{ margin: '0 10px', textDecoration: 'none', color: 'white' }}>Feed</Link> &&
                                    <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'gray' }}>Feedbacks</Link>
                                } */}
                                 {
                                    IsLoged &&
                                    <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'White' }}>Publishes</Link>
                                }
                                
                                <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'gray' }}>Suporte</Link>

                                {
                                    IsLoged &&
                                    <button type="submit" className='btn btn-light' onClick={handleLogout} style={{ color: '', marginLeft: 'auto', marginRight: '0%', maxHeight: 'fit-content' }}>Logout</button>
                                }
                                {
                                    !IsLoged &&
                                    <button type='submit' className='btn btn-light' onClick={handleLogin} style={{ marginLeft: 'auto', borderTopRightRadius:'0px',borderBottomRightRadius:'0px' }}>Login</button>
                                }
                                {
                                    !IsLoged &&
                                    <button type='submit' className='btn btn-light' onClick={handleRegister} style={{ marginLeft: 'auto', borderTopLeftRadius:'0px',borderBottomLeftRadius:'0px' }}>Registrar</button>
                                }
                                
                            </nav>
                        )}
                    </>
                ) : (
                    <>
                        <nav style={{ width: '36%', alignSelf: 'center', fontSize: '0.8em', marginLeft: '8%', marginRight: '8%', position: 'relative' }}>
                            {
                                !IsLoged &&
                                <Link to="/" style={{ padding: '8%', textDecoration: 'none', color: 'white' }}>Home</Link>
                            }
                            {/* {
                                IsLoged &&
                                <Link to="/" style={{ padding:'8%',textDecoration: 'none', color: 'white' }}>Feedbacks</Link>
                            } */}
                            {
                                IsLoged &&
                            <Link to="/" style={{ padding: '8%', textDecoration: 'none', color: 'white' }}>Publishes</Link>
                            }
                            <Link to="/" style={{ padding: '8%', textDecoration: 'none', color: 'gray' }}>Suporte</Link>

                        </nav>
                        {/* {
                                IsLoged &&
                                <form onSubmit={handleSearch} style={{ marginLeft:'10%', display: 'flex', alignItems: 'center', marginRight: '6%' }}>
                            <input
                                type="text"
                                placeholder="Pesquisar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                maxLength={100}
                                style={{
                                    padding: '5px',
                                    borderRadius: '4px',
                                    border: '1px solid #ccc',
                                    marginRight: '5px',
                                    width:'80%',
                                    display:'none'
                                }}
                            />
                            <button type="submit" className='btn btn-light' style={{ padding: '5px 10px', borderRadius: '4px', backgroundColor: '#555', color: 'white', border: 'none' }}>
                                🔍
                            </button>
                        </form>
                            } */}

                        <div className='d-flex align-items-center' style={{ gap: '1em', position: 'relative', right: '0px', left: '10%' }}>
                            {
                                IsLoged &&
                                <Link to={`/profile/${data?.user?.nick}`}>
                                { 
                                     <CircleImage
                                        src={data?.user?.pathImage ? imageProfile || `${process.env.REACT_APP_URL_S3}/temp/profile/${data?.user?._id}/${data?.user?._id}-${data?.user?.pathImage}` : userImgNotFind}
                                        alt='Proile header'
                                    />
                                } 
                                    
                                </Link>
                            }
                            {
                                IsLoged &&
                                <button type="submit" className='btn btn-light' onClick={handleLogout} style={{ color: '', marginLeft: 'auto', marginRight: '0%', maxHeight: 'fit-content' }}>Logout</button>
                            }
                            {
                                !IsLoged &&
                                <button type='submit' className='btn btn-light' onClick={handleLogin} style={{ marginLeft: 'auto'}}>Login</button>
                            }

                            {
                                    !IsLoged &&
                                    <button type='submit' className='btn btn-light' onClick={handleRegister} style={{ marginLeft: 'auto' }}>Registrar</button>
                                }

                        </div>
                    </>
                )}

            </header>
        </div>

    )

};

export default Header;
