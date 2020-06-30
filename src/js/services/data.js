export const dataServices = {
  getData
}

function getData() {
    return fetch("http://localhost:8080/data", {
      credentials: 'include',
      headers: {
        "Authorization": `Bearer ${window.localStorage.getItem("token")}`
      }
    })
}
