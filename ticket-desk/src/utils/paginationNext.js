function PaginationNext(totalPages, currentMaxPage, maxTotalPageTabs, prev, next, eventHandler) {

  let list = [];

  // if there's still this.state.maxTotalPageTabs more pages to scroll thru, render the next this.state.maxTotalPageTabs pagination tabs
  if ((totalPages - currentMaxPage) >= maxTotalPageTabs) {

    // Add Previous button
    list.push(<li className="page-item"><a className="page-link" href="#" onClick={prev}>Previous</a></li>);

    for (let i = currentMaxPage; i < (currentMaxPage + maxTotalPageTabs); i++) {

      list.push(
        <li className="page-item"><a className="page-link" href="#" onClick={e => eventHandler(e, i)}>{i + 1}</a></li>
      );

    }

    // Add Next button
    list.push(<li className="page-item"><a className="page-link" href="#" onClick={next}>Next</a></li>);

  } else {

    // Add Previous button
    list.push(<li className="page-item"><a className="page-link" href="#" onClick={prev}>Previous</a></li>);

    // render remaining pagination tabs
    for (let i = currentMaxPage; i < totalPages; i++) {

      list.push(
        <li className="page-item"><a className="page-link" href="#" onClick={e => eventHandler(e, i)}>{i + 1}</a></li>
      );

    }

  }

  return list;

}

export default PaginationNext;