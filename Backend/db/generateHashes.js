const bcrypt = require('bcrypt');

const users = [
  { username: 'Alice', password: 'alice123' },
  { username: 'Dylan', password: 'dylan123' },
  { username: 'Charles', password: 'charles123' },
  { username: 'Bob', password: 'bob123' },
  { username: 'TestUser', password: 'test123' }
];

async function generate() {
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`${user.username} => ${hash}`);
  }
}

generate();
