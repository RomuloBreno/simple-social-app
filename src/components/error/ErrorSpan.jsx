const ErrorSpan = ({message}) => {
    const errorMessage = {
        marginTop: '6px',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #dc3545', // vermelho Bootstrap
        backgroundColor: '#f8d7da',  // fundo suave vermelho
        color: '#842029',            // texto vermelho escuro
        fontSize: '0.875rem',        // equivalente a text-sm
        display: 'inline-block',
        maxWidth: '100%',
    };
    return (
        <span style={errorMessage} className="error-message d-block mt-1">
            {message}
        </span>
    );
};

export default ErrorSpan;
