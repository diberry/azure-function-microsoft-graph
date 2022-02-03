const { Sequelize, Model, DataTypes } = require('sequelize');

var sql = new Sequelize(
    process.env.SQL_DATABASE, 
    process.env.SQL_USER, 
    process.env.SQL_PASSWORD, 
  {
    host: process.env.SQL_SERVER,
    dialect: 'mssql',
    driver: 'tedious',
    options: {
      encrypt: true,
      database: process.env.SQL_DATABASE
    },
    port: 1433,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
  }
});

const getUsers = async () =>{

  const sp = `spAccountList`;
  console.log(sp);
  const [results, metadata] = await sql.query(sp,{raw:true});
  return {
    results,
    metadata
  }
}

const removeUser = async ( msftEmail ) =>{

  const sp = `spAccountDeleteFullMsft @MSFTEmail=\'${msftEmail}\'`;
  console.log(sp);
  const [results, metadata] = await sql.query(sp,{raw:true});
  return {
    results,
    metadata
  }
}
module.exports = {
  removeUser,
  getUsers
}