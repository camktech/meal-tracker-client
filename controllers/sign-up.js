$(document).ready(() => {
  var $name = $('#new-user-name');
  var $email = $('#new-user-email');
  var $password = $('#new-user-password');

  $('#create-account-button').click((e) => {
    e.preventDefault();
    createAccount(buildUser($name.val(), $email.val(), $password.val()));
    $name.val(null);
    $email.val(null);
    $password.val(null);
  });
});

function createAccount(user){
  $.post({
    url: `${HOST}/users`, 
    data: user,
    xhrFields: {
      withCredentials: true
    }
  })
  .done((user) => {
    setLocalStorage('user', JSON.stringify(user));
    transition('build-meal');
    notify(`Welcome ${user.name}`);
  })
  .fail((data) => {
    notify(data.responseJSON.error, true);
  });
}

function buildUser(name, email, password){
  var user = {
    name: name,
    email: email,
    password: password
  };
  return {user: user};
}
