const sequelize = require('./db');


async function populateDatabase() {
    await sequelize.sync({ force: true }); // This will drop the table if it already exists

    // Populate db code
    
}

populateDatabase().then(() => {
    console.log('Database populated!');
}).catch(err => {
    console.error('Failed to populate database:', err);
});
