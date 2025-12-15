const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const msg = document.getElementById("loginMessage");

function setUI(loggedIn) {
  document.querySelectorAll("canvas").forEach(c => {
    c.style.opacity = loggedIn ? "1" : "0.3";
  });

  document.querySelectorAll("input, select").forEach(el => {
    if (el.id !== "username" && el.id !== "password") {
      el.disabled = !loggedIn;
    }
  });

  loginBtn.disabled = loggedIn;
  logoutBtn.disabled = !loggedIn;
}

loginBtn.onclick = () => {
  fetch("login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(r => r.json())
  .then(res => {
    if (res.success) {
      msg.innerText = "Login successful";
      setUI(true);
      onLoginSuccess();
    } else {
      msg.innerText = "Invalid credentials";
    }
  });
};

logoutBtn.onclick = () => {
  fetch("logout.php", {
    credentials: "same-origin"
  })
  .then(() => {
    msg.innerText = "Logged out";
    setUI(false);
    onLogout();
  });
};

setUI(false);
