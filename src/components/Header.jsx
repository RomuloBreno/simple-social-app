// src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { factoryUser } from '../utils/fetch';
const Header = () => {
    const navigate = useNavigate()
    //mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    //valid login
    const [IsLoged, setIsLoged] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false);
    //seach form
    const [searchQuery, setSearchQuery] = useState("");
    //user
    const user = useAuth();
    const { logout } = useAuth()
    //userFabric
    const [userFactory, setUserFactory] = useState();

    useEffect(() => {
        let response;
        const fetchUser = async () => {
            if (user?.user)
                response = await factoryUser(user?.user?.token)

        }
        fetchUser();
        if (!user.user) {
            setIsLoged(false); // Usuário não autenticado
            return
        } else {
            setIsLoged(true); // Usuário autenticado
        }



    }, [user]);
    
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const handlelogout = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        logout() // Envia as credenciais
        navigate('/')
    };
    const handlelogin = async (e) => {
        e.preventDefault(); // Impede o recarregamento da página
        navigate('/login')
    };


    // Lógica de pesquisa
    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Procurando por:", searchQuery);
        // Adicione a lógica de pesquisa aqui, como redirecionar ou fazer uma requisição
    };
    // Atualiza o valor de `isMobile` quando a janela é redimensionada
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1568);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div className='text-center'>
            <header style={{ display: 'flex', padding: '10px', backgroundColor: '#333', color: '#fff', fontSize: '1em' }}>
                <h2 style={{ marginLeft: '10%' }}>Fdback</h2>
                {isMobile ? (
                    <>
                        <button onClick={toggleMenu} style={{ background: 'none', border: 'none', marginLeft: '10%', color: 'white', fontSize: '24px' }}>
                            ☰
                        </button>
                        {menuOpen && (
                            <nav style={{ alignSelf: 'center', marginLeft: '0%', marginRight: '0%' }}>
                                {
                                    !IsLoged &&
                                    <a href="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'white' }}>Home</a>
                                }
                                {
                                    IsLoged &&
                                    <a href="/feed" style={{ margin: '0 10px', textDecoration: 'none', color: 'white' }}>Feed</a> &&
                                    <a href="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'gray' }}>Feedbacks</a>
                                }
                                <a href="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'gray' }}>Publishes</a>
                                <a href="/" style={{ margin: '0 10px', textDecoration: 'none', color: 'gray' }}>Suporte</a>

                                {
                                    IsLoged &&
                                    <a href={`/profile`}>
                                        <img className="rounded-circle" width="65" style={{ padding: '10px' }} src="https://picsum.photos/50/50" alt="profile" />
                                    </a>
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
                )
                    :
                    (
                        <>
                            <nav style={{ alignSelf: 'center', marginLeft: '8%', marginRight: '8%' }}>
                                {
                                    !IsLoged &&
                                    <a href="/" style={{ margin: '0 30px', textDecoration: 'none', color: 'white' }}>Home</a>
                                }
                                {
                                    IsLoged &&
                                    <a href="/feed" style={{ margin: '0 30px', textDecoration: 'none', color: 'white' }}>Feed</a> &&
                                    <a href="/" style={{ margin: '0 30px', textDecoration: 'none', color: 'gray' }}>Feedbacks</a>
                                }
                                <a href="/" style={{ margin: '0 30px', textDecoration: 'none', color: 'gray' }}>Publishes</a>
                                <a href="/" style={{ margin: '0 30px', textDecoration: 'none', color: 'gray' }}>Suporte</a>

                            </nav>
                            <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', marginRight: '6%' }}>
                                <input
                                    type="text"
                                    placeholder="Pesquisar..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        padding: '5px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        marginRight: '5px',
                                    }}
                                />
                                <button type="submit" className='btn btn-light' style={{ padding: '5px 10px', borderRadius: '4px', backgroundColor: '#555', color: 'white', border: 'none' }}>
                                    🔍
                                </button>
                            </form>
                            <div className='d-flex align-items-center'>
                                {
                                    IsLoged &&
                                    <a href={`/profile`}>
                                        <img className="rounded-circle" width="65" style={{ padding: '10px' }} src="https://picsum.photos/50/50" alt="profile" />
                                    </a>
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
