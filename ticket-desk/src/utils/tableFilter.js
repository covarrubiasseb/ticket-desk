function TableFilter(tableID, searchFormID) {
  let input = document.getElementById(searchFormID);
  let filter = input.value.toUpperCase();
  let table = document.getElementById(tableID);
  let tr = table.getElementsByTagName("tr");


  for (let i = 0; i < tr.length; i++) {

    let row = tr[i].getElementsByTagName("td");

    if (row.length > 0) {

      let name = row[0].innerText;

      if (name) {

        if (name.toUpperCase().indexOf(filter) > -1) {

          tr[i].style.display = "";

        } else {

          tr[i].style.display = "none";

        }

      }

    }

  }
}

export default TableFilter;