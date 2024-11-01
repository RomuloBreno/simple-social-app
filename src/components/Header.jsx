// src/components/Header.tsx
import React, { useEffect, useState } from 'react';



const Header = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const toggleMenu = () => setMenuOpen(!menuOpen);



     // Lógica de pesquisa
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Procurando por:", searchQuery);
    // Adicione a lógica de pesquisa aqui, como redirecionar ou fazer uma requisição
  };


    // Atualiza o valor de `isMobile` quando a janela é redimensionada
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1368);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <div class='text-center'>
            <header style={{ display: 'flex', padding: '10px', backgroundColor: '#333', color: '#fff', fontSize:'1em' }}>
                <h2 style={{marginLeft:'10%'}}>Fdback</h2>
                {isMobile ? (
                    <>
                        <button onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'black', fontSize: '24px' }}>
                            ☰
                        </button>
                        {menuOpen && (
                            <nav
                                style={{
                                    position: 'absolute',
                                    top: '60px',
                                    left: '0',
                                    width: '100%',
                                    backgroundColor: '#333',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    padding: '10px 0',
                                }}
                            >
                                <a href="/" style={{ margin: '10px 0', textDecoration: 'none', color: 'white' }}>Home</a>
                                <a href="/feed" style={{ margin: '10px 0', textDecoration: 'none', color: 'white' }}>Feed</a>
                                <a href="/feedbacks" style={{ margin: '10px 0', textDecoration: 'none', color: 'white' }}>Feedbacks</a>
                                <a href="/publishes" style={{ margin: '10px 0', textDecoration: 'none', color: 'white' }}>Publishes</a>
                                <a href="/support" style={{ margin: '10px 0', textDecoration: 'none', color: 'white' }}>Suporte</a>
                            </nav>
                        )}
                    </>
                )
                    :
                    (
                        <>
                            <nav style={{alignSelf: 'center', marginLeft:'8%', marginRight:'8%'}}>
                                <a href="/" style={{ margin: '0 30px', textDecoration: 'none', color: 'white' }}>Home</a>
                                <a href="/feed" style={{ margin: '0 30px', textDecoration: 'none', color: 'white' }}>Feed</a>
                                <a href="/feedbacks" style={{ margin: '0 30px', textDecoration: 'none', color: 'white' }}>Feedbacks</a>
                                <a href="/publishes" style={{ margin: '0 30px', textDecoration: 'none', color: 'white' }}>Publishes</a>
                                <a href="/support" style={{ margin: '0 30px', textDecoration: 'none', color: 'white' }}>Suporte</a>
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
                                <button type="submit" style={{ padding: '5px 10px', borderRadius: '4px', backgroundColor: '#555', color: 'white', border: 'none' }}>
                                🔍
                                </button>
                            </form>
                            <button style={{ marginLeft: 'auto', marginRight:'12%' }}>Perfil</button>
                        </>
                    )}

            </header>
        </div>

    )

};

export default Header;
