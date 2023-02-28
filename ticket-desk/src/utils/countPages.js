function CountPages(dataLength, entriesLength) {
  let totalPages;

  if (dataLength <= entriesLength) {
    totalPages = 1;
  } else {
    totalPages = ( dataLength - (dataLength % entriesLength) ) / ( entriesLength );

    if (dataLength % entriesLength) {
      totalPages += 1;
    }
  }

  return totalPages;
}

export default CountPages;