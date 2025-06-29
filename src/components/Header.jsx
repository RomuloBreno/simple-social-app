// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { factoryUser } from '../utils/fetch';
import Notify from './notify/Notifys';
import CircleImage from './images/CircleImage';
import logo from '../images/logo192.png'
const Header = (loged) => {
    const navigate = useNavigate()
    //mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    //valid login
    const [IsLoged, setIsLoged] = useState(loged)
    const [menuOpen, setMenuOpen] = useState(false);
    //seach form
    const [searchQuery, setSearchQuery] = useState("");
    //user
    const data = useAuth().data;
    const imageProfile = data?.imageProfile;
    
    const { logout } = useAuth();

    useEffect(() => {
        if (!data?.user) {
            setIsLoged(false); // Usuário não autenticado
            return
        } else {
            setIsLoged(true); // Usuário autenticado
        }



    }, [data?.user, data?.imageProfile]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1368);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);



    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handlelogout = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        logout()
        navigate('/')
    };
    const handlelogin = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        navigate('/login')
    };


    // Lógica de pesquisa
    const handleSearch = (e) => {
        e.preventDefault();
        // console.log("Procurando por:", searchQuery);
        // Adicione a lógica de pesquisa aqui, como redirecionar ou fazer uma requisição
    };
    // Atualiza o valor de `isMobile` quando a janela é redimensionada
    return (
        <div className='text-center'>
            <header style={{ display: 'flex', padding: '10px', backgroundColor: '#333', color: '#fff', fontSize: '1em' }}>
                <div style={{width:'10%', position:'relative', left:'10%'}} >
                <a href='/' style={{ textDecoration: 'none' }} >
                    <div>
                        <img src={logo} style={{ width: "40%"}} />
                    </div>
                    <div>
                        <span className='' style={{color:'white'}}>Fdback</span>

                    </div>
                </a>
                </div>
                {isMobile ? (
                    <>
                        <button onClick={toggleMenu} style={{ background: 'none', border: 'none', marginLeft: '0%', color: 'white', fontSize: '24px', position: 'absolute', right: '10%' }}>
                            ☰
                        </button>
                        {menuOpen && (
                            <nav className='' style={{ position: 'absolute', width: 'fit-content', height: 'fit-content', top: '6.2%', zIndex: '19', backgroundColor: 'rgb(51, 51, 51)', right: '0', borderRadius: '2%', border: '1px solid rgb(51, 51, 51)' }}>
                                {
                                    !IsLoged &&
                                    <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'white' }}>Home</Link>
                                }
                                {/* {
                                    IsLoged &&
                                    <Link to="/feed" style={{ margin: '0 10px', textDecoration: 'none', color: 'white' }}>Feed</Link> &&
                                    <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'gray' }}>Feedbacks</Link>
                                } */}
                                <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'White' }}>Publishes</Link>
                                <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'gray' }}>Suporte</Link>

                                {
                                    IsLoged &&
                                    <Link to={`/profile/${data?.user?.nick}`}>
                                        <CircleImage
                                            src={imageProfile || `${process.env.REACT_APP_URL_S3}/temp/profile/${data?.user?._id}/${data?.user?._id}-${data?.user?.pathImage}`}
                                            alt='Proile header'
                                        />
                                        {/* <'img' className="rounded-circle" width="65" style={{ padding: '10px' }} src={imageProfile} alt="profile" /> */}
                                    </Link>
                                }
                                {
                                    IsLoged &&
                                    <button type="submit" className='btn btn-light' onClick={handlelogout} style={{ color: '', marginLeft: 'auto', marginRight: '0%', maxHeight: 'fit-content' }}>Logout</button>
                                }
                                {
                                    !IsLoged &&
                                    <button type='submit' className='btn btn-light' onClick={handlelogin} style={{ marginLeft: 'auto', marginRight: '10%' }}>Login</button>
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
                            <Link to="/" style={{ padding: '8%', textDecoration: 'none', color: 'white' }}>Publishes</Link>
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

                        <div className='d-flex align-items-center' style={{ gap: '30%', position: 'relative', right: '0px', left: '10%' }}>
                            {
                                IsLoged &&
                                <Link to={`/profile/${data?.user?.nick}`}>
                                    <CircleImage
                                        src={imageProfile || `${process.env.REACT_APP_URL_S3}/temp/profile/${data?.user?._id}/${data?.user?._id}-${data?.user?.pathImage}`}
                                        alt='Proile header'
                                    />
                                </Link>
                            }
                            {
                                IsLoged &&
                                <button type="submit" className='btn btn-light' onClick={handlelogout} style={{ color: '', marginLeft: 'auto', marginRight: '0%', maxHeight: 'fit-content' }}>Logout</button>
                            }
                            {
                                !IsLoged &&
                                <button type='submit' className='btn btn-light' onClick={handlelogin} style={{ marginLeft: 'auto', marginRight: '10%' }}>Login</button>
                            }

                        </div>
                    </>
                )}

            </header>
        </div>

    )

};

export default Header;
