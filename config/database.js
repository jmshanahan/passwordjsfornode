module.exports = {
  url: `mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@cluster0-shard-00-00-yhlii.mongodb.net:27017,cluster0-shard-00-01-yhlii.mongodb.net:27017,cluster0-shard-00-02-yhlii.mongodb.net:27017/iolearn?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`,
};