import React from 'react';

const CircleImage = ({ src, alt = "Image" }) => {
  const containerStyle = {
    margin:'8px',
    width: '4em', // Defina o tamanho desejado do círculo
    height: '40%',
    borderRadius: '50%', // Faz a div ser circular
    overflow: 'hidden', // Garante que a imagem fique dentro do círculo
    display: 'flex',
    justifyContent: 'center', // Centraliza horizontalmente
    alignItems: 'center', // Centraliza verticalmente
    backgroundColor: '#f0f0f0', // Cor de fundo (opcional)
    border: '2px solid #ddd', // Borda opcional
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ajusta a imagem para cobrir o círculo
  };

  return (
    <div style={containerStyle}>
      <img src={src} alt={alt} style={imageStyle} />
    </div>
  );
};

export default CircleImage;
