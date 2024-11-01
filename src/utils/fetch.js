export async function fetchApi(route, PageData, methodRequest, dataToSend,token) {
  if (!PageData) {
      const options = {
        method: methodRequest, // Especifica o método da requisição (GET, POST, etc.)
        headers: {
          'Content-Type': 'application/json', // Informa que o corpo da requisição está em JSON
          Authorization: `${token}`,
        },
      };
      // Inclui o corpo apenas se o método for POST
      if (methodRequest === 'POST') {
        options.body = JSON.stringify(dataToSend); // Converte o objeto de dados em uma string JSON
      }
      const response = await fetch(`${process.env.REACT_APP_URL_API}/${route}`, options)
      // const data = await response.json();
      return response; // Retorna o resultado dos dados
  }
}

export async function fetchConnect(route, methodRequest, dataToSend) {
    const options = {
      method: methodRequest, // Especifica o método da requisição (GET, POST, etc.)
      headers: {
        'Content-Type': 'application/json', // Informa que o corpo da requisição está em JSON
      }
    };
    // Inclui o corpo apenas se o método for POST
    if (methodRequest === 'POST') {
      options.body =  JSON.stringify(dataToSend); // Converte o objeto de dados em uma string JSON
    }
    const response = await fetch(`${process.env.REACT_APP_URL_API}/${route}`, options)
    return response;
  }