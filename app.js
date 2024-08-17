let add_fruits = document.getElementById('add_fruits')
let prev = document.getElementById('prev')
let next = document.getElementById('next')
let todosCount = document.getElementById('todosCount')
let tbody = document.getElementById('tbody')
let modal = document.getElementById('modal')
let form = document.getElementById('form')
let propertes = {}
let API = "http://localhost:3000/fruits"
let updateId = -1

document.addEventListener('DOMContentLoaded', () => {
  getFruits()
  add_fruits.addEventListener('click', () => {
    toggleModal("flex")
  })
  form.onsubmit = (e) => {
    e.preventDefault()
    postFruits()
    toggleModal("none")
  }
  window.addEventListener('click', (e) => {
    if (e.target == modal) {
      toggleModal("none")
    }
  })
})

async function getFruits() {
  try {
    let response = await fetch(API)
    let data = await response.json()
    displayWindow(data)
    return data
  } catch (err) {
    console.log(err);
  }
}
function displayWindow(data = []) {
  tbody.innerHTML = ""
  data.forEach((item, i) => {
    tbody.innerHTML += `
      <tr>
        <td class="border text-center">${i + 1}</td>
        <td class="border text-center">${item.name}</td>
        <td class="border text-center">${item.color}</td>
        <td class="border text-center">${item.taste}</td>
        <td class="border text-center">${item.type}</td>
        <td class="border text-center">
          <button onclick="editeFruits('${item.id}')" class="text-lg text-white bg-orange-400 px-4">Edite</button>
          <button onclick="deleteFruit('${item.id}')" class="text-lg text-white bg-red-600 px-4">Delete</button>
        </td>
      </tr>
    `
  })
}

async function deleteFruit(id) {
  try {
    let response = fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
  } catch (err) {
    console.log(err);
  }
}
async function editeFruits(id) {
  try {
    let data = await getFruits()
    updateId = id
    toggleModal("flex")
    data.filter(item => {
      if (item.id === id) {
        form.querySelector(`[name="name"]`).value = item.name
        form.querySelector(`[name="color"]`).value = item.color
        form.querySelector(`[name="taste"]`).value = item.taste
        form.querySelector(`[name="type"]`).value = item.type
      }
    })
  } catch (err) {
    console.log(err);
  }

}

function toggleModal(status) {
  modal.style.display = status
}

async function postFruits() {
  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(propertes)
    })
  } catch (err) {
    console.log(err);
  }
}

function hendleChange(event) {
  let { name, value } = event.target
  propertes = { ...propertes, [name]: value }
}