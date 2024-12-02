// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { factoryUser } from '../utils/fetch';
import Notify from './notify/Notifys';
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
    const imageProfile =data?.imageProfile;
    const ws = useAuth().data?.ws

    const { logout, remove } = useAuth();

    useEffect(() => {
        if (!data?.user) {
            setIsLoged(false); // Usuário não autenticado
            return
        } else {
            console.log(data.imageProfile)
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
        logout() // Envia as credenciais
        remove() // Envia as credenciais
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
                <h2 className='' style={{ marginLeft: '10%', alignContent: 'center' }}>Fdback</h2>
                {isMobile ? (
                    <>
                        <button onClick={toggleMenu} style={{ background: 'none', border: 'none', marginLeft: '10%', color: 'white', fontSize: '24px' }}>
                            ☰
                        </button>
                        {menuOpen && (
                            <nav style={{ alignSelf: 'center', marginLeft: '0%', marginRight: '0%' }}>
                                {
                                    !IsLoged &&
                                    <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'white' }}>Home</Link>
                                }
                                {
                                    IsLoged &&
                                    <Link to="/feed" style={{ margin: '0 10px', textDecoration: 'none', color: 'white' }}>Feed</Link> &&
                                    <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'gray' }}>Feedbacks</Link>
                                }
                                <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'gray' }}>Publishes</Link>
                                <Link to="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'gray' }}>Suporte</Link>

                                {
                                    IsLoged &&
                                    <Link to={`/profile/${data?.user?.nick}`}>
                                        <img className="rounded-circle" width="65" style={{ padding: '10px' }} src={imageProfile} alt="profile" />
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
                        <nav style={{ width:'36%', alignSelf: 'center',fontSize:'0.8em', marginLeft: '8%', marginRight: '8%' }}>
                            {
                                !IsLoged &&
                                <Link to="/" style={{ padding:'8%',textDecoration: 'none', color: 'white' }}>Home</Link>
                            }
                            {
                                IsLoged &&
                                <Link to="/" style={{ padding:'8%',textDecoration: 'none', color: 'white' }}>Feedbacks</Link>
                            }
                            <Link to="/" style={{ padding:'8%',textDecoration: 'none', color: 'gray' }}>Publishes</Link>
                            <Link to="/" style={{ padding:'8%',textDecoration: 'none', color: 'gray' }}>Suporte</Link>

                        </nav>
                        {
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
                            }
                       
                        <div className='d-flex align-items-center'>
                            {
                                IsLoged &&
                                <Link to={`/profile/${data?.user?.nick}`}>
                                    <img className="rounded-circle" width="65" style={{ padding: '10px' }} src={imageProfile} alt="profile" />
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
