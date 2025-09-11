import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(__dirname, '../data/data.js');

// Read users from data.js file
function readUsers() {
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    // Extract the users array from the file content
    const match = fileContent.match(/const users = (\[[\s\S]*?\]);/);
    if (match) {
      return JSON.parse(match[1]);
    }
    return [];
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Write users to data.js file
function writeUsers(users) {
  try {
    const fileContent = `// Data storage for users and their quest progress
// This file will be updated by the backend when users register, link accounts, or complete quests

const users = ${JSON.stringify(users, null, 2)};

module.exports = { users };`;
    
    fs.writeFileSync(dataFilePath, fileContent, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing users:', error);
    return false;
  }
}

// Find user by Google ID
function findUserByGoogleId(googleId) {
  const users = readUsers();
  return users.find(user => user.googleId === googleId);
}

// Find user by ID
function findUserById(id) {
  const users = readUsers();
  return users.find(user => user.id === id);
}

// Add new user
function addUser(userData) {
  const users = readUsers();
  
  // Check if user already exists
  const existingUser = users.find(user => user.googleId === userData.googleId);
  if (existingUser) {
    return existingUser;
  }
  
  // Generate unique ID if not provided
  if (!userData.id) {
    userData.id = Date.now().toString();
  }
  
  // Initialize default values
  userData.xp = userData.xp || 0;
  userData.quests = userData.quests || {};
  
  users.push(userData);
  writeUsers(users);
  return userData;
}

// Update user
function updateUser(userId, updates) {
  const users = readUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return null;
  }
  
  users[userIndex] = { ...users[userIndex], ...updates };
  writeUsers(users);
  return users[userIndex];
}

// Update user quest status
function updateQuestStatus(userId, questId, status) {
  const users = readUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return null;
  }
  
  if (!users[userIndex].quests) {
    users[userIndex].quests = {};
  }
  
  users[userIndex].quests[questId] = status;
  writeUsers(users);
  return users[userIndex];
}

// Add XP to user
function addXp(userId, xp) {
  const users = readUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    return null;
  }
  
  users[userIndex].xp = (users[userIndex].xp || 0) + xp;
  writeUsers(users);
  return users[userIndex];
}

module.exports = {
  readUsers,
  writeUsers,
  findUserByGoogleId,
  findUserById,
  addUser,
  updateUser,
  updateQuestStatus,
  addXp
};