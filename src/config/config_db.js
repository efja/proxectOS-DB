const mongoose = require('mongoose');

const dbConnection = async() => {
    const DBMS = process.env.DBMS;
    let proctolURL = '';

    if (DBMS == 'mongodb') {
        proctolURL = 'mongodb';
    }

    let connectionString = `${proctolURL}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    try {
        if (proctolURL != '') {
            await mongoose.connect(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            });

            return `Conexión á BD correcta. Cadea de conexión <${connectionString}>`;
        } else {
            throw new Error(`Erro ó conectar coa BD. Cadea de conexión <${connectionString}> incorrecta`.bgRed);
        }
    } catch (error) {
        throw new Error(`Erro ó conectar coa BD. Cadea de conexión <${connectionString}>`.bgRed, error);
    }
}

module.exports = {
    dbConnection
}
