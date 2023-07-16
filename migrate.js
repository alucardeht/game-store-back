const {connect, close} = require('./database/db.js');
const {up: createRoles} = require('./migrations/1689048711080-create-roles');
const {up: createGenres} = require('./migrations/1689383627173-create-genres');
const {up: createOperatingSystems} = require('./migrations/1689383647767-create-operating-systems');

async function migrate() {
    try {
        await connect();

        // Execute as migrações
        await createRoles();
        await createGenres();
        await createOperatingSystems();

        console.log('Migrations executed successfully.');
    } catch (error) {
        console.error('Error executing migrations:', error);
    } finally {
        await close();
    }
}

migrate().then(() => process.exit(0));
