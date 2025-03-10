# Blocking API Manual

npm install
npm install --save-dev nodemon -> Para rodar sem precisar atualizar o código toda hora

## Todo
- Project tree: YAML;
- Porject tree + Cat
- Database Equema; 
- HardBlock Fix -> Only block and never do nothing again; 
- Instant recall from database after insertion;
- Send Message API
- Schedule Message
- Fix ListGroups app -- getChats and them filter! 


## Block a User

### Hard Block User
POST http://localhost:3000/api/block
Content-Type: application/json

{
    "id": "1234567890@c.us",
    "type": "user",
    "blockType": "hard"
}

### Soft Block User
POST http://localhost:3000/api/block
Content-Type: application/json

{
    "id": "1234567890@c.us",
    "type": "user",
    "blockType": "soft"
}

## Block a Group

### Hard Block Group
POST http://localhost:3000/api/block
Content-Type: application/json

{
    "id": "1234567890-group@g.us",
    "type": "group",
    "blockType": "hard"
}

### Soft Block Group
POST http://localhost:3000/api/block
Content-Type: application/json

{
    "id": "1234567890-group@g.us",
    "type": "group",
    "blockType": "soft"
}

## Unblock Endpoints

### Unblock a User
POST http://localhost:3000/api/unblock
Content-Type: application/json

{
    "id": "1234567890@c.us",
    "type": "user"
}

### Unblock a Group
POST http://localhost:3000/api/unblock
Content-Type: application/json

{
    "id": "1234567890-group@g.us",
    "type": "group"
}

## View Blocked Entities

Get all blocked users:
GET http://localhost:3000/api/blocked-users

Get all blocked groups:
GET http://localhost:3000/api/blocked-groups

Important Notes:
- User IDs should end with "@c.us"
- Group IDs should end with "@g.us"
- Hard blocking a group means leaving the group
- Soft blocking archives messages automatically
- Unblocking a hard-blocked group doesn't automatically rejoin the group
- All IDs must be valid WhatsApp IDs in the correct format
