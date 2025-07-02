// src/pages/Index.tsx
import React from 'react';
import {useNavigate} from 'react-router-dom';
import { FaHeart, FaCommentDots, FaSearch, FaComment } from 'react-icons/fa';
import { FaLetterboxd, FaMessage, FaSheetPlastic, FaTextSlash } from 'react-icons/fa6';

const Index = () => {
   document.title="Home"
  const navigate = useNavigate()


const Register = (e) =>{
  e.preventDefault(); // Impede o recarregamento da página
  navigate('/register')
}
  
  return (
    <div  className="container w-100 p-5">
      <div className="">
        <h1 className="text-center">
          Bem-vindo ao <strong>Fdback</strong>
        </h1>
        <p className="text-center">
          Uma rede social feita para quem gosta de compartilhar ideias e evoluções de projetos.
        </p>

        <div className="w-50" style={{position:'relative', left:'26%'}}>
          <FeatureCard icon={<FaSheetPlastic className="" />} title="Publique" desc="Crie postagens e compartilhe suas ideias ." />
             <FeatureCard icon={<FaHeart className="" />} title="Curta" desc="Interaja com postagens de projetos no qual se interessa." />
          <FeatureCard icon={<FaCommentDots className="" />} title="Comente" desc="Deixe seu fdback aos projetos compartilhados." />
        </div>
        <div className='container text-center'>
        <button
          onClick={Register}
          className="w-50 btn btn-primary"
        >
          Comece a postar agora 🚀
        </button>
        </div>
        {/* <main style={{ textAlign: 'center', padding: '20px', height:'900px' }}>
        <button onClick={Register} style={{ padding: '10px 20px', fontSize: '16px' }}>Inscrever-se</button>
  </main> */}
      </div>
    </div>
  );

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="container bg-white rounded-xl shadow-md flex flex-col items-center hover:shadow-lg transition">
      <div className='d-flex'>
      <div style={{alignContent:'center'}} className="mb-2 p-1">{icon}</div>
      <h2 className="font-semibold text-lg mb-1 p-1">{title}</h2>
      </div>
      <div>
      <p className="text-sm text-gray-600 p-2">{desc}</p>
      </div>
    </div>
  );
}
};

export default Index;
