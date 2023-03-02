function RenderPagination(totalPages, maxPageTableEntries, prev, next, eventHandler) {
  let list = [];

  if (totalPages > maxPageTableEntries) {
    // Add Previous button
    list.push(<li className="page-item"><a className="page-link" href="#" onClick={prev}>Previous</a></li>);

    // Add first 10 pages
    for (let i = 0; i < maxPageTableEntries; i++) {

      list.push(
        <li className="page-item"><a className="page-link" href="#" onClick={e => eventHandler(e, i)}>{i + 1}</a></li>
      );

    }

    // Add Next button
    list.push(<li className="page-item"><a className="page-link" href="#" onClick={next}>Next</a></li>);


  } else {

    for (let i = 0; i < totalPages; i++) {

      list.push(
        <li className="page-item"><a className="page-link" href="#" onClick={e => eventHandler(e, i)}>{i + 1}</a></li>
      );

    }

  }

  return list;

}

export default RenderPagination;