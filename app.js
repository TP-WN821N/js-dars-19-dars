let add_fruits = document.getElementById('add_fruits')
let prev = document.getElementById('prev')
let next = document.getElementById('next')
let todosCount = document.getElementById('todosCount')
let tbody = document.getElementById('tbody')
let modal = document.getElementById('modal')
let form = document.getElementById('form')
let propertes = {}
let data = []
let updateId = -1
let current_page = 1
let castum_per_page = 5
let API = `http://localhost:3000/fruits?_page=${current_page}&_limit=${castum_per_page}`

document.addEventListener('DOMContentLoaded', () => {
  getFruits()
  add_fruits.addEventListener('click', () => {
    toggleModal("flex")
  })
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (updateId === -1) {
      postFruits()
    } else {
      updateFruits()
      updateId = -1
    }
    toggleModal("none")
  })
})
window.addEventListener('click', (e) => {
  if (e.target == modal) {
    toggleModal("none")
  }
})

async function getFruits() {
  try {
    let response = await fetch(API)
    data = await response.json()
    displayWindow()
  } catch (err) {
    console.log(err);
  }
}
function displayWindow() {
  let start_index = (current_page - 1) * castum_per_page
  let end_index = start_index + castum_per_page
  let users = data.slice(start_index, end_index)

  tbody.innerHTML = ""
  users.forEach((item, i) => {
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
  pagination()
}

prev.addEventListener('click', () => {
  if (current_page !== 1) {
    current_page--;
    getFruits()
  }
})
next.addEventListener('click', () => {
  current_page++;
  console.log(current_page);
  getFruits()
})

todosCount.addEventListener('change', (e) => {
  castum_per_page = +e.target.value
  getFruits()
})

async function deleteFruit(id) {
  try {
    let response = fetch(`${API.split("?")[0]}/${id}`, {
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

async function updateFruits() {
  try {
    let response = fetch(`${API}/${updateId}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertes)
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