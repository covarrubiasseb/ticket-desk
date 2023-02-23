const {  parse  } = require("csv-parse");

const records = [];

const parser = parse({
  delimiter: ','
});

parser.on('readable', () => {
  let record;
  while ( (record = parser.read()) !== null) {
    records.push(record);  
  }
});

module.exports = {  parser  }