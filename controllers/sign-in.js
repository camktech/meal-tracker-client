window.app.page('sign-in', () => {
  var $email = $('#login-email');
  var $password = $('#login-password');

  $('#sign-in-button').click(() => {
    signIn(buildUser($email.val(), $password.val()));
    $email.val(null);
    $password.val(null);
  });
});

function signIn(user){
  $.post({
    url: `${HOST}/login`,
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

function buildUser(email, password){
  var user = {
    email: email,
    password: password
  };
  return {user: user};
}