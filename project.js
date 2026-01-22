document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addDocBtn")
  const modal = document.getElementById("docModal")
  const cancelBtn = document.getElementById("cancelBtn")
  const saveBtn = document.getElementById("saveBtn")
  const searchInput = document.querySelector(".search-box input")
  const tbody = document.querySelector("table tbody")

  let editingRow = null

  function saveToStorage() {
    const rows = [...tbody.querySelectorAll("tr")].map(row => {
      const cells = row.querySelectorAll("td")
      return {
        name: cells[1].innerText,
        status: cells[2].querySelector(".status").innerText,
        people: cells[2].innerText.match(/\d+/)?.[0] || "",
        date: cells[3].innerText
      }
    })
    localStorage.setItem("documents", JSON.stringify(rows))
  }

  function loadFromStorage() {
    const data = JSON.parse(localStorage.getItem("documents"))
    if (!data) return
    tbody.innerHTML = ""
    data.forEach(doc => {
      let statusClass = ""
      if (doc.status === "Pending") statusClass = "pending"
      if (doc.status === "Needs Signing") statusClass = "sign"
      if (doc.status === "Completed") statusClass = "complete"
      const row = document.createElement("tr")
      row.innerHTML = `
        <td><input type="checkbox"></td>
        <td>${doc.name}</td>
        <td>
          <span class="status ${statusClass}">${doc.status}</span>
          ${doc.status === "Pending" ? `<br><span class="pname">Waiting for </span><span class="sname">${doc.people} people</span>` : ""}
        </td>
        <td>${doc.date}</td>
        <td class="dots">
          <button>${doc.status === "Needs Signing" ? "Sign now" : doc.status === "Completed" ? "Download PDF" : "Preview"}</button>
          <div class="menu">
            <img src="dots.png" class="nav-iconss menu-btn">
            <div class="menu-dropdown">
              <button class="edit-btn">Edit</button>
              <button class="delete-btn">Delete</button>
            </div>
          </div>
        </td>
      `
      tbody.appendChild(row)
    })
  }

  loadFromStorage()

  addBtn.onclick = () => {
    editingRow = null
    modal.style.display = "flex"
  }

  cancelBtn.onclick = () => {
    modal.style.display = "none"
    editingRow = null
  }

  saveBtn.onclick = () => {
    const name = docName.value.trim()
    const status = docStatus.value
    const date = docDate.value
    const people = docPeople.value

    if (!name || !date) return

    let statusClass = ""
    if (status === "Pending") statusClass = "pending"
    if (status === "Needs Signing") statusClass = "sign"
    if (status === "Completed") statusClass = "complete"

    const rowHTML = `
      <td><input type="checkbox"></td>
      <td>${name}</td>
      <td>
        <span class="status ${statusClass}">${status}</span>
        ${status === "Pending" ? `<br><span class="pname">Waiting for </span><span class="sname">${people} people</span>` : ""}
      </td>
      <td>${date}</td>
      <td class="dots">
        <button>${status === "Needs Signing" ? "Sign now" : status === "Completed" ? "Download PDF" : "Preview"}</button>
        <div class="menu">
          <img src="dots.png" class="nav-iconss menu-btn">
          <div class="menu-dropdown">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        </td>
      </tr>
    `

    if (editingRow) {
      editingRow.innerHTML = rowHTML
      editingRow = null
    } else {
      const row = document.createElement("tr")
      row.innerHTML = rowHTML
      tbody.appendChild(row)
    }

    modal.style.display = "none"
    docName.value = ""
    docPeople.value = ""
    docDate.value = ""
    saveToStorage()
  }

  searchInput.addEventListener("input", function () {
    const filter = this.value.toLowerCase()
    tbody.querySelectorAll("tr").forEach(row => {
      const text = row.innerText.toLowerCase()
      row.style.display = text.includes(filter) ? "" : "none"
    })
  })

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-btn")) {
      e.stopPropagation()
      const menu = e.target.nextElementSibling
      document.querySelectorAll(".menu-dropdown").forEach(m => {
        if (m !== menu) m.style.display = "none"
      })
      menu.style.display = menu.style.display === "block" ? "none" : "block"
      return
    }

    document.querySelectorAll(".menu-dropdown").forEach(m => m.style.display = "none")

    if (e.target.classList.contains("delete-btn")) {
      const row = e.target.closest("tr")
      row.remove()
      saveToStorage()
      return
    }

    if (e.target.classList.contains("edit-btn")) {
      editingRow = e.target.closest("tr")
      const cells = editingRow.querySelectorAll("td")
      docName.value = cells[1].innerText
      docStatus.value = cells[2].querySelector(".status").innerText
      docDate.value = cells[3].innerText
      const peopleText = cells[2].innerText.match(/\d+/)
      docPeople.value = peopleText ? peopleText[0] : ""
      modal.style.display = "flex"
    }
  })
})
