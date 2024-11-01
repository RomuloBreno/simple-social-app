export default async function fetchApi(route, PageData,methodRequest,dataToSend) {
    if (!PageData) {
      try {
        const options = {
            method: methodRequest, // Especifica o método da requisição (GET, POST, etc.)
            headers: {
              'Content-Type': 'application/json', // Informa que o corpo da requisição está em JSON
            },
          };
      
          // Inclui o corpo apenas se o método for POST
          if (methodRequest === 'POST') {
            options.body = JSON.stringify(dataToSend); // Converte o objeto de dados em uma string JSON
          }
      
        const response = await fetch(`${process.env.REACT_APP_URL_API}/${route}`, options)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.result; // Retorna o resultado dos dados
      } catch (error) {
        console.error('Error fetching data:', error);
        return null; // Retorna null ou lida com o erro de acordo com sua necessidade
      }
    }
  }