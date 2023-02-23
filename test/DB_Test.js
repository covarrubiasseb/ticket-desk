const queries = {
  createUser: function (firstName, lastName, email, hash) {
    return `INSERT INTO users (firstName, lastName, email, role, hash) VALUES ('${firstName}','${lastName}','${email}','Unassigned','${hash}');`
  }
}

module.exports = {  queries  }