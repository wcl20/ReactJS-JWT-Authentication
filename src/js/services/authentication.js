export const authenticationServices = {
  login,
  refresh
}

function login(username, password) {
    return fetch("http://localhost:8080/login", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
}

function refresh() {
  return fetch("http://localhost:8080/refresh", {
      credentials: 'include'
  })
}
