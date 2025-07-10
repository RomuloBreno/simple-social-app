export function formatDate (dateString) {
    const givenDate = new Date(dateString);
    const now = new Date();
  
    // Calcula a diferença em milissegundos entre a data fornecida e agora
    const timeDifference = now - givenDate;
  
    // Calcula a diferença em dias
    const differenceInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    // Se a diferença for 0, calcula a diferença em horas
    const differenceInHours = Math.floor(timeDifference / (1000 * 60 * 60));
   
    // Se a diferença for 0, calcula a diferença em horas
    const differenceInMinutes = Math.floor(timeDifference / (1000 * 60));
  
    // Define nomes curtos dos meses
    const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    const formattedDate = `${months[givenDate.getMonth()]} ${givenDate.getDate()}`;
  
    // Se a diferença for menor que 1 dia, mostra a diferença em horas
    if (differenceInHours === 0) {
      return `${formattedDate} | ${differenceInMinutes === -1 ? 0 : differenceInMinutes }min`;
    }
    if (differenceInDays === 0) {
      return `${formattedDate} | ${differenceInHours}h`;
    }
  
    // Caso contrário, mostra a diferença em dias
    const finalMessage = `${formattedDate} | ${differenceInDays} dia${differenceInDays !== 1 ? 's' : ''} atrás`;
    return finalMessage;
  };
export function formatDateToNotify(dateString) {
    const givenDate = new Date(dateString);
    const now = new Date();
  
    // Calcula a diferença em milissegundos entre a data fornecida e agora
    const timeDifference = now - givenDate;
  
    // Calcula a diferença em dias
    const differenceInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  
    // Se a diferença for 0, calcula a diferença em horas
    const differenceInHours = Math.floor(timeDifference / (1000 * 60 * 60));
   
    // Se a diferença for 0, calcula a diferença em horas
    const differenceInMinutes = Math.floor(timeDifference / (1000 * 60));
  
    // Define nomes curtos dos meses
    const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
    const formattedDate = `${months[givenDate.getMonth()]} ${givenDate.getDate()}`;
  
    // Se a diferença for menor que 1 dia, mostra a diferença em horas
    if (differenceInHours === 0) {
      return `${differenceInMinutes}min`;
    }
    if (differenceInDays === 0) {
      return `${differenceInHours}h`;
    }
  
    // Caso contrário, mostra a diferença em dias
    const finalMessage =  `${timeDifference < 1000 ? '0s' : formattedDate + " | " +(differenceInDays > 0 ? differenceInDays + " dias" : differenceInHours > 0 ? differenceInHours+" horas":differenceInMinutes > 0 ? differenceInMinutes+" minutos" :'') } atrás`;
    return finalMessage;
  };
  