function HandlePagination(pageIndex, currentEnd) {

  let newStart = 0;
  let newEnd = currentEnd;

  for (let i = 0; i < pageIndex; i++) {
    newStart += currentEnd;
    newEnd += currentEnd;
  }

  return [newStart, newEnd];
}

export default HandlePagination;