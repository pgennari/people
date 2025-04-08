db = db.getSiblingDB(process.env.MONGODB_DATABASE);
db.createUser({
  user: 'root',
  pwd: 'secure',
  roles: [
    {
      role: 'readWrite',
      db: process.env.MONGODB_DATABASE,
    },
  ],
});
