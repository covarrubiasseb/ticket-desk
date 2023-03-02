function PaginationPrevious(currentMaxPage, maxTotalPageTabs, prev, next, eventHandler) {

  let list = [];

  // Add Previous button
  list.push(<li className="page-item"><a className="page-link" href="#" onClick={prev}>Previous</a></li>);

  for (let i = (currentMaxPage - (maxTotalPageTabs * 2) ); i < (currentMaxPage - maxTotalPageTabs); i++) {

    list.push(
      <li className="page-item"><a className="page-link" href="#" onClick={e => eventHandler(e, i)}>{i + 1}</a></li>
    );

  }

  // Add Next button
  list.push(<li className="page-item"><a className="page-link" href="#" onClick={next}>Next</a></li>);

  return list;

} 


export default PaginationPrevious;