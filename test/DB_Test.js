const queries = {
  createUser: function (firstName, lastName, email, hash) {
    return `INSERT INTO users (firstName, lastName, email, role, hash) VALUES ('${firstName}','${lastName}','${email}','Unassigned','${hash}');`
  },

  createProject: function(projectName, projectDescription) {
    return `INSERT INTO projects (name, description) VALUES ('${projectName}','${projectDescription}');`
  }
}

module.exports = {  queries  }