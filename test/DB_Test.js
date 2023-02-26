const queries = {
  createUser: function (firstName, lastName, email, hash) {
    return `INSERT INTO users (firstName, lastName, email, role, hash) VALUES ("${firstName}","${lastName}","${email}","Unassigned","${hash}");`
  },

  createProject: function(projectName, projectDescription, userID) {
    return `INSERT INTO projects (name, description, userID) VALUES ("${projectName}","${projectDescription}", "${userID}");`
  },

  findProject: function(projectID) {
    return `SELECT * FROM projects where projectID="${projectID}";`
  },

  addUserToProject: function(userID, projectID) {
    return `INSERT INTO usersProjects (userID, projectID) VALUES ("${userID}","${projectID}");`
  }
}

module.exports = {  queries  }