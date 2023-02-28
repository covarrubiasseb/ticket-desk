function TableClear(tableID) {
  let table = document.getElementById(tableID);
  let tr = table.getElementsByTagName("tr");


  for (let i = 0; i < tr.length; i++) {

    let row = tr[i].getElementsByTagName("td");

    if (row.length > 0) {

      tr[i].style.display = "none";

    }

  }
}

export default TableClear;