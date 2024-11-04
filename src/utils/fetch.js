export async function fetchApi(route, PageData, methodRequest, dataToSend, token) {
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
  return await validResponseReturn(response)// Retorna o resultado dos dados
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
    options.body = JSON.stringify(dataToSend); // Converte o objeto de dados em uma string JSON
  }
  const response = await fetch(`${process.env.REACT_APP_URL_API}/${route}`, options)
  return await validResponseReturn(response)// Retorna o resultado dos dados
}

async function validResponseReturn(response) {
  let json = await response.json()
  return json
}

export async function factoryUser(token) {
  let resultWithid = await fetchApi(`auth/t-fdback`, null, 'GET', null, token)
  if (!resultWithid.status)
    return
  let user = await fetchApi(`v1/user/${resultWithid?.result.userId}`, null, 'GET', null, token)
  if (!user.status)
    return
  return user.result
}