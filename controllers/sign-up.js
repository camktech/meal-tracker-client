window.app.page('sign-up', () => {
  var $name = $('#new-user-name');
  var $email = $('#new-user-email');
  var $password = $('#new-user-password');

  $('#create-account-button').click(() => {
    createAccount(buildUser($name.val(), $email.val(), $password.val()));
    $name.val(null);
    $email.val(null);
    $password.val(null);
  });
});

function createAccount(user){
  $.post({
    url: `${HOST}/users`, 
    data: user
  })
  .done((user) => {
    setLocalStorage('user', JSON.stringify(user));
    // transition
    // notify
  })
  .fail((data) => {
    // notify
  });
}

function buildUser(name, email, password){
  var user = {
    name: name,
    email: email,
    password: password
  };
  return JSON.stringify({user: user});
}
