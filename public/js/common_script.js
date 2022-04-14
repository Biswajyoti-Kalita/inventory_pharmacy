function bulkSelect(tablename) {
  if ($("#bulkSelect" + tablename).prop("checked")) {
    $(".checkbox-" + tablename).each(function () {
      console.log($(this).prop("checked"));
      $(this).prop("checked", true);
      $("#bulkDelete" + tablename).show();
    });
  } else {
    $(".checkbox-" + tablename).each(function () {
      console.log($(this).prop("checked"));
      $(this).prop("checked", false);
      $("#bulkDelete" + tablename).hide();
    });
  }
}
function bulkDelete(tablename) {
  console.log("Delete bulk");
  //TO DO

  var items = $(".checkbox-" + tablename);
  var ids = [];

  for (var i = 0; i < items.length; i++) {
    if (items[i].checked) ids.push(items[i].getAttribute("data-id"));
  }
  console.log(ids);
  window["bulkDelete" + tablename + "Modal"](ids);
}
function exportTable(table_id, separator = ",") {
  // Select rows from table_id
  var rows = document.querySelectorAll("table#table" + table_id + " tr");
  // Construct csv
  var csv = [];
  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");
    for (var j = 1; j < cols.length - 1; j++) {
      // Clean innertext to remove multiple spaces and jumpline (break csv)
      var data = cols[j].innerText
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/(\s\s)/gm, " ");
      // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
      data = data.replace(/"/g, '""');
      // Push escaped string
      row.push('"' + data + '"');
    }
    csv.push(row.join(separator));
  }
  var csv_string = csv.join("\n");
  // Download it
  var filename =
    "export_" + table_id + "_" + new Date().toLocaleDateString() + ".csv";
  var link = document.createElement("a");
  link.style.display = "none";
  link.setAttribute("target", "_blank");
  link.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(csv_string)
  );
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function checkSelected(tablename) {
  var items = $(".checkbox-" + tablename);
  var selectedChecks = 0;
  for (var i = 0; i < items.length; i++) {
    if (items[i].checked) selectedChecks++;
  }

  if (selectedChecks == 0) $("#bulkDelete" + tablename).hide();
  else $("#bulkDelete" + tablename).show();
}

function getPaginate(count, callback, limit, offset, tablename) {
  console.log(count, callback, limit, offset, tablename);
  var totalItems = count,
    currentPage = offset,
    pageSize = parseInt(limit) >= 0 ? limit : count,
    maxPages = 10;

  // calculate total pages
  let totalPages = Math.ceil(totalItems / pageSize);

  // ensure current page isn't out of range
  if (currentPage < 0) {
    currentPage = 0;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  var startPage = 0,
    endPage = 0;
  if (totalPages <= maxPages) {
    // total pages less than max so show all pages
    startPage = 1;
    endPage = totalPages;
  } else {
    // total pages more than max so calculate start and end pages
    let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
    let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrentPage) {
      // current page near the start
      startPage = 1;
      endPage = maxPages;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      // current page near the end
      startPage = totalPages - maxPages + 1;
      endPage = totalPages;
    } else {
      // current page somewhere in the middle
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  // calculate start and end item indexes
  let startIndex = (currentPage - 1) * pageSize;
  let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  // create an array of pages to ng-repeat in the pager control
  let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
    (i) => startPage + i
  );

  // return object with all pager properties required by the view
  console.log({
    totalItems: totalItems,
    currentPage: currentPage,
    pageSize: pageSize,
    totalPages: totalPages,
    startPage: startPage,
    endPage: endPage,
    startIndex: startIndex,
    endIndex: endIndex,
    pages: pages,
  });
  $("#pagination" + tablename).html("");
  for (var i = 0; i < pages.length; i++) {
    console.log(pages[i]);

    if (offset == pages[i] - 1) {
      $("#pagination" + tablename).append(`
          <li class="page-item active" aria-current="page">
            <a class="page-link" href="#">${pages[i]}</a>
          </li>
        `);
    } else {
      $("#pagination" + tablename).append(`
          <li class="page-item"><span class="page-link pagination-link" onclick="changeOffset(${
            pages[i] - 1
          }, ${callback})" href="#">${pages[i]}</span></li>
        `);
    }
  }
}

function changeOffset(val, callback) {
  callback(val);
}

$(".pagination-link").on("click", (ev) => {
  ev.preventDefault();
});

function generateRandomId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function csvToArray(csvFile, delimiter = ",") {
  let str = await csvToString(csvFile);
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      header = header.replace("\r", "");
      object[header] = values[index] ? values[index].replace("\r", "") : "";
      return object;
    }, {});
    return el;
  });
  return arr;
}
const csvToString = (csvFile) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = function (e) {
        const text = e.target.result;
        console.log(" csvToString  resolve ");
        resolve(text);
      };
      reader.readAsText(csvFile);
    } catch (err) {
      reject(err);
    }
  });
};

// CUSTOM  EXPORT

function customExportTable(table_id, separator = ",") {
  // Select rows from table_id
  var rows = document.querySelectorAll("table#table" + table_id + " tr");
  // Construct csv

  let bodyText = "";
  for (var i = 1; i < rows.length; i++) {
    cols = rows[i].querySelectorAll("td, th");
    if (
      cols[0] &&
      cols[0].children[0].checked &&
      !document.getElementById("export" + table_id + "Row" + cols[1].innerText)
    ) {
      let tempText = "";
      for (var j = 2; j < cols.length - 1; j++) {
        // Clean innertext to remove multiple spaces and jumpline (break csv)
        var data = cols[j].innerText
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/(\s\s)/gm, " ");
        // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
        data = data.replace(/"/g, '""');
        // Push escaped string
        tempText += `<td>${data}</td>`;
      }
      if (tempText && tempText.length > 0)
        tempText += `<td><span class="btn btn-sm btn-danger" onclick="removeExportRow( '${table_id}', '${cols[1].innerText}')" >remove</span></td>`;
      bodyText += `<tr id="export${table_id}Row${cols[1].innerText}" > ${tempText} </tr>`;
    }
  }

  if (bodyText) {
    $("#export" + table_id + "TableBody").append(bodyText);
  }
  $(".checkbox-" + table_id).each(function () {
    $(this).prop("checked", false);
  });

  $("#exportDrugModal").modal("show");
}

function removeExportRow(table_id, rowId) {
  $("#export" + table_id + "Row" + rowId).remove();
}

function downloadCustomExportCSV(table_id, separator = ",") {
  // Select rows from table_id
  var rows = document.querySelectorAll("table#export" + table_id + "Table tr");
  // Construct csv
  var csv = [];
  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");
    for (var j = 0; j < cols.length - 1; j++) {
      // Clean innertext to remove multiple spaces and jumpline (break csv)
      var data = cols[j].innerText
        .replace(/(\r\n|\n|\r)/gm, "")
        .replace(/(\s\s)/gm, " ");
      // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
      data = data.replace(/"/g, '""');
      // Push escaped string
      row.push('"' + data + '"');
    }
    csv.push(row.join(separator));
  }
  var csv_string = csv.join("\n");
  // Download it
  var filename =
    "export_" + table_id + "_" + new Date().toLocaleDateString() + ".csv";
  var link = document.createElement("a");
  link.style.display = "none";
  link.setAttribute("target", "_blank");
  link.setAttribute(
    "href",
    "data:text/csv;charset=utf-8," + encodeURIComponent(csv_string)
  );
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function clearCustomExport(table_id) {
  $("#export" + table_id + "TableBody").html("");
}
