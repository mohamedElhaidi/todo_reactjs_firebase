/**
 * Modified for the object type row cell
 */
export function descendingComparator(a, b, orderBy) {
  if (typeof b[orderBy] === "object" && typeof b[orderBy] === "object") {
    if (b[orderBy].value < a[orderBy].value) {
      return -1;
    }
    if (b[orderBy].value > a[orderBy].value) {
      return 1;
    }
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
  }

  return 0;
}

export function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
export function applyFilters(objArr, filters, filterQuery) {
  return objArr.filter((o) => {
    let found = false;
    filters.forEach((f) => {
      if (o[f] === null) return;
      let val = "";
      if (["string", "number"].includes(typeof o[f])) {
        val = o[f];
      } else if (typeof o[f] === "object") {
        val = o[f].value;
      }
      found |= val.toString().toLowerCase().includes(filterQuery.toLowerCase());
    });
    return found;
  });
}

export function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
}

export function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

// returns the type of file ie: [image , ...]
export function getFileType(file) {
  const arr = file.type.split("/");
  if (!arr.length) return null;
  return arr[0];
}
// returns the extension of file ie: [image , ...]
export function getFileExtension(file) {
  const arr = file.name.split(".");
  if (!arr.length) return null;
  return arr[arr.length - 1];
}
// returns the extension of file ie: [image , ...]
export function convertBytesSizeToMB(number) {
  if (number === undefined || number === null) return null;
  return (number / 2048).toFixed(2);
}

export function openInNewTab(url) {
  window.open(url, "_blank").focus();
}

//get redirect from link

export function getRedirectParam() {
  let params = new URLSearchParams(document.location.search);
  let redirectURL = params.get("redirect");

  return redirectURL && redirectURL !== "" ? redirectURL : "/";
}
