var addBtn = document.getElementById("addDocBtn");
var modal = document.getElementById("docModal");
var cancelBtn = document.getElementById("cancelBtn");
var saveBtn = document.getElementById("saveBtn");
var searchInput = document.getElementsByTagName("input")[0];
var table = document.getElementsByTagName("table")[0];
var tbody = table.getElementsByTagName("tbody")[0];

var editingRow = null;

function saveToStorage() {
  var rows = tbody.getElementsByTagName("tr");
  var data = [];

  Array.from(rows).forEach(function (row) {
    var cells = row.getElementsByTagName("td");

    var name = cells[1].innerText;
    var status = cells[2].getElementsByTagName("span")[0].innerText;
    var date = cells[3].innerText;
    var people = "";

    var smallTags = cells[2].getElementsByTagName("small");
    if (smallTags.length > 0) {
      var text = smallTags[0].innerText;
      Array.from(text).forEach(function (ch) {
        if (ch >= "0" && ch <= "9") {
          people = people + ch;
        }
      });
    }

    var obj = {};
    obj.name = name;
    obj.status = status;
    obj.people = people;
    obj.date = date;

    data.push(obj);
  });

  localStorage.setItem("documents", JSON.stringify(data));
}

function loadFromStorage() {
  var data = localStorage.getItem("documents");
  if (data === null) {
    return;
  }

  var docs = JSON.parse(data);
  tbody.innerHTML = "";

  docs.forEach(function (doc) {
    var statusClass = "";

    if (doc.status === "Pending") {
      statusClass = "pending";
    }
    if (doc.status === "Needs Signing") {
      statusClass = "sign";
    }
    if (doc.status === "Completed") {
      statusClass = "complete";
    }

    var row = document.createElement("tr");

    var td1 = document.createElement("td");
    td1.innerHTML = "<input type='checkbox'>";
    row.appendChild(td1);

    var td2 = document.createElement("td");
    td2.innerText = doc.name;
    row.appendChild(td2);

    var td3 = document.createElement("td");
    td3.innerHTML = "<span class='status " + statusClass + "'>" + doc.status + "</span>";
    if (doc.status === "Pending") {
      td3.innerHTML = td3.innerHTML + "<br><small><span class='pname'>Waiting for </span><span class='sname'>" + doc.people + " people</span></small>";
    }
    row.appendChild(td3);

    var td4 = document.createElement("td");
    td4.innerText = doc.date;
    row.appendChild(td4);

    var td5 = document.createElement("td");
    td5.className = "dots";

    var btn = document.createElement("button");
    if (doc.status === "Needs Signing") {
      btn.innerText = "Sign now";
    } else if (doc.status === "Completed") {
      btn.innerText = "Download PDF";
    } else {
      btn.innerText = "Preview";
    }
    td5.appendChild(btn);

    var menuDiv = document.createElement("div");
    menuDiv.className = "menu";

    var img = document.createElement("img");
    img.src = "img/dot.svg";
    img.className = "nav-iconss menu-btn";
    menuDiv.appendChild(img);

    var dropDiv = document.createElement("div");
    dropDiv.className = "menu-dropdown";

    var editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    dropDiv.appendChild(editBtn);

    var delBtn = document.createElement("button");
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
  var name = docName.value;
  var status = docStatus.value;
  var date = docDate.value;
  var people = docPeople.value;

  if (name === "" || date === "") {
    return;
  }

  var statusClass = "";
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
    var cells = editingRow.getElementsByTagName("td");
    cells[1].innerText = name;
    cells[2].innerHTML = "<span class='status " + statusClass + "'>" + status + "</span>";
    if (status === "Pending") {
      cells[2].innerHTML = cells[2].innerHTML + "<br><small><span class='pname'>Waiting for </span><span class='sname'>" + people + " people</span></small>";
    }
    cells[3].innerText = date;

    var actionBtn = cells[4].getElementsByTagName("button")[0];
    if (status === "Needs Signing") {
      actionBtn.innerText = "Sign now";
    } else if (status === "Completed") {
      actionBtn.innerText = "Download PDF";
    } else {
      actionBtn.innerText = "Preview";
    }

    editingRow = null;
  } else {
    var row = document.createElement("tr");

    var td1 = document.createElement("td");
    td1.innerHTML = "<input type='checkbox'>";
    row.appendChild(td1);

    var td2 = document.createElement("td");
    td2.innerText = name;
    row.appendChild(td2);

    var td3 = document.createElement("td");
    td3.innerHTML = "<span class='status " + statusClass + "'>" + status + "</span>";
    if (status === "Pending") {
      td3.innerHTML = td3.innerHTML + "<br><small><span class='pname'>Waiting for </span><span class='sname'>" + people + " people</span></small>";
    }
    row.appendChild(td3);

    var td4 = document.createElement("td");
    td4.innerText = date;
    row.appendChild(td4);

    var td5 = document.createElement("td");
    td5.className = "dots";

    var btn = document.createElement("button");
    if (status === "Needs Signing") {
      btn.innerText = "Sign now";
    } else if (status === "Completed") {
      btn.innerText = "Download PDF";
    } else {
      btn.innerText = "Preview";
    }
    td5.appendChild(btn);

    var menuDiv = document.createElement("div");
    menuDiv.className = "menu";

    var img = document.createElement("img");
    img.src = "img/dot.svg";
    img.className = "nav-iconss menu-btn";
    menuDiv.appendChild(img);

    var dropDiv = document.createElement("div");
    dropDiv.className = "menu-dropdown";

    var editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    dropDiv.appendChild(editBtn);

    var delBtn = document.createElement("button");
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
  var value = searchInput.value.toLowerCase();
  var rows = tbody.getElementsByTagName("tr");

  Array.from(rows).forEach(function (row) {
    var text = row.innerText.toLowerCase();
    if (text.indexOf(value) > -1) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
};

document.onclick = function (e) {
  var target = e.target;

  if (target.className.indexOf("menu-btn") !== -1) {
    var menu = target.parentNode.getElementsByClassName("menu-dropdown")[0];
    menu.style.display = menu.style.display === "block" ? "none" : "block";
    return;
  }

  var allMenus = document.getElementsByClassName("menu-dropdown");
  Array.from(allMenus).forEach(function (menu) {
    menu.style.display = "none";
  });

  if (target.innerText === "Delete") {
    var row = target.closest("tr");
    row.parentNode.removeChild(row);
    saveToStorage();
  }

  if (target.innerText === "Edit") {
    editingRow = target.closest("tr");
    var cells = editingRow.getElementsByTagName("td");

    docName.value = cells[1].innerText;
    docStatus.value = cells[2].getElementsByTagName("span")[0].innerText;
    docDate.value = cells[3].innerText;

    var smallTags = cells[2].getElementsByTagName("small");
    if (smallTags.length > 0) {
      var text = smallTags[0].innerText;
      var number = "";
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
