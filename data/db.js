

// In-memory database
const userDatabase = [
    { email: "user1@example.com", password: "password1" },
    { email: "user2@example.com", password: "password2" },
    { email: "user3@example.com", password: "password3" },
    { email: "user4@example.com", password: "password4" },
  ];


module.exports = {
  getItems: () => userDatabase,
  addItem: (item) => userDatabase.push(item),
  // Add other database-related functions as needed
};
