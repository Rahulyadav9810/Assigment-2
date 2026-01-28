const addBtn = document.getElementById("addDocBtn");
const modal = document.getElementById("docModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");
const searchInput = document.getElementsByTagName("input")[0];
const table = document.getElementsByTagName("table")[0];
const tbody = table.getElementsByTagName("tbody")[0];

let editingRow = null;

function saveToStorage() {
  const rows = tbody.getElementsByTagName("tr");
  const data = [];

  Array.from(rows).forEach(function (row) {
    const cells = row.getElementsByTagName("td");

    const name = cells[1].innerText;
    const status = cells[2].getElementsByTagName("span")[0].innerText;
    const date = cells[3].innerText;
    let people = "";

    const smallTags = cells[2].getElementsByTagName("small");
    if (smallTags.length > 0) {
      const text = smallTags[0].innerText;
      Array.from(text).forEach(function (ch) {
        if (ch >= "0" && ch <= "9") {
          people = people + ch;
        }
      });
    }

    const obj = {};
    obj.name = name;
    obj.status = status;
    obj.people = people;
    obj.date = date;

    data.push(obj);
  });

  localStorage.setItem("documents", JSON.stringify(data));
}

function loadFromStorage() {
  const data = localStorage.getItem("documents");
  if (data === null) {
    return;
  }

  const docs = JSON.parse(data);
  tbody.innerHTML = "";

  docs.forEach(function (doc) {
    let statusClass = "";

    if (doc.status === "Pending") {
      statusClass = "pending";
    }
    if (doc.status === "Needs Signing") {
      statusClass = "sign";
    }
    if (doc.status === "Completed") {
      statusClass = "complete";
    }

    const row = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.innerHTML = "<input type='checkbox'>";
    row.appendChild(td1);

    const td2 = document.createElement("td");
    td2.innerText = doc.name;
    row.appendChild(td2);

    const td3 = document.createElement("td");
    td3.innerHTML = "<span class='status " + statusClass + "'>" + doc.status + "</span>";
    if (doc.status === "Pending") {
      td3.innerHTML =
        td3.innerHTML +
        "<br><small><span class='pname'>Waiting for </span><span class='sname'>" +
        doc.people +
        " people</span></small>";
    }
    row.appendChild(td3);

    const td4 = document.createElement("td");
    td4.innerText = doc.date;
    row.appendChild(td4);

    const td5 = document.createElement("td");
    td5.className = "dots";

    const btn = document.createElement("button");
    if (doc.status === "Needs Signing") {
      btn.innerText = "Sign now";
    } else if (doc.status === "Completed") {
      btn.innerText = "Download PDF";
    } else {
      btn.innerText = "Preview";
    }
    td5.appendChild(btn);

    const menuDiv = document.createElement("div");
    menuDiv.className = "menu";

    const img = document.createElement("img");
    img.src = "img/dot.svg";
    img.className = "nav-iconss menu-btn";
    menuDiv.appendChild(img);

    const dropDiv = document.createElement("div");
    dropDiv.className = "menu-dropdown";

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    dropDiv.appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    dropDiv.appendChild(delBtn);

    menuDiv.appendChild(dropDiv);
    td5.appendChild(menuDiv);
    row.appendChild(td5);

    tbody.appendChild(row);
  });
}

loadFromStorage();

addBtn.onclick = function () {
  editingRow = null;
  modal.style.display = "flex";
};

cancelBtn.onclick = function () {
  modal.style.display = "none";
  editingRow = null;
};

saveBtn.onclick = function () {
  const name = docName.value;
  const status = docStatus.value;
  const date = docDate.value;
  const people = docPeople.value;

  if (name === "" || date === "") {
    return;
  }

  let statusClass = "";
  if (status === "Pending") {
    statusClass = "pending";
  }
  if (status === "Needs Signing") {
    statusClass = "sign";
  }
  if (status === "Completed") {
    statusClass = "complete";
  }

  if (editingRow !== null) {
    const cells = editingRow.getElementsByTagName("td");
    cells[1].innerText = name;
    cells[2].innerHTML = "<span class='status " + statusClass + "'>" + status + "</span>";
    if (status === "Pending") {
      cells[2].innerHTML =
        cells[2].innerHTML +
        "<br><small><span class='pname'>Waiting for </span><span class='sname'>" +
        people +
        " people</span></small>";
    }
    cells[3].innerText = date;

    const actionBtn = cells[4].getElementsByTagName("button")[0];
    if (status === "Needs Signing") {
      actionBtn.innerText = "Sign now";
    } else if (status === "Completed") {
      actionBtn.innerText = "Download PDF";
    } else {
      actionBtn.innerText = "Preview";
    }

    editingRow = null;
  } else {
    const row = document.createElement("tr");

    const td1 = document.createElement("td");
    td1.innerHTML = "<input type='checkbox'>";
    row.appendChild(td1);

    const td2 = document.createElement("td");
    td2.innerText = name;
    row.appendChild(td2);

    const td3 = document.createElement("td");
    td3.innerHTML = "<span class='status " + statusClass + "'>" + status + "</span>";
    if (status === "Pending") {
      td3.innerHTML =
        td3.innerHTML +
        "<br><small><span class='pname'>Waiting for </span><span class='sname'>" +
        people +
        " people</span></small>";
    }
    row.appendChild(td3);

    const td4 = document.createElement("td");
    td4.innerText = date;
    row.appendChild(td4);

    const td5 = document.createElement("td");
    td5.className = "dots";

    const btn = document.createElement("button");
    if (status === "Needs Signing") {
      btn.innerText = "Sign now";
    } else if (status === "Completed") {
      btn.innerText = "Download PDF";
    } else {
      btn.innerText = "Preview";
    }
    td5.appendChild(btn);

    const menuDiv = document.createElement("div");
    menuDiv.className = "menu";

    const img = document.createElement("img");
    img.src = "img/dot.svg";
    img.className = "nav-iconss menu-btn";
    menuDiv.appendChild(img);

    const dropDiv = document.createElement("div");
    dropDiv.className = "menu-dropdown";

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    dropDiv.appendChild(editBtn);

    const delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    dropDiv.appendChild(delBtn);

    menuDiv.appendChild(dropDiv);
    td5.appendChild(menuDiv);
    row.appendChild(td5);

    tbody.appendChild(row);
  }

  modal.style.display = "none";
  docName.value = "";
  docPeople.value = "";
  docDate.value = "";
  saveToStorage();
};

searchInput.onkeyup = function () {
  const value = searchInput.value.toLowerCase();
  const rows = tbody.getElementsByTagName("tr");

  Array.from(rows).forEach(function (row) {
    const text = row.innerText.toLowerCase();
    if (text.indexOf(value) > -1) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
};

document.onclick = function (e) {
  const target = e.target;

  if (target.className.indexOf("menu-btn") !== -1) {
    const menu = target.parentNode.getElementsByClassName("menu-dropdown")[0];
    menu.style.display = menu.style.display === "block" ? "none" : "block";
    return;
  }

  const allMenus = document.getElementsByClassName("menu-dropdown");
  Array.from(allMenus).forEach(function (menu) {
    menu.style.display = "none";
  });

  if (target.innerText === "Delete") {
    const row = target.closest("tr");
    row.parentNode.removeChild(row);
    saveToStorage();
  }

  if (target.innerText === "Edit") {
    editingRow = target.closest("tr");
    const cells = editingRow.getElementsByTagName("td");

    docName.value = cells[1].innerText;
    docStatus.value = cells[2].getElementsByTagName("span")[0].innerText;
    docDate.value = cells[3].innerText;

    const smallTags = cells[2].getElementsByTagName("small");
    if (smallTags.length > 0) {
      const text = smallTags[0].innerText;
      let number = "";
      Array.from(text).forEach(function (ch) {
        if (ch >= "0" && ch <= "9") {
          number = number + ch;
        }
      });
      docPeople.value = number;
    } else {
      docPeople.value = "";
    }

    modal.style.display = "flex";
  }
};
