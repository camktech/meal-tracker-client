const HOST = 'http://localhost:3000';

function getLocalStorage(key){
  localStorage.getItem(`meal-tracker-data-${key}`);
}

function setLocalStorage(key, value){
  localStorage.setItem(`meal-tracker-data-${key}`, value);
}

function notify(message, error = false){
  
}