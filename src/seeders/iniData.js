const db = require('../models');
const hashPassword = require('../utils/hashPassword');

const DEMO_USER = {
    id: '01JYQZ8K3M4N5P6Q7R8S9T0V1W',
    firstname: 'User',
    lastname: 'Admin',
    email: 'user@admin.com',
    password: 'Admin123!',
};

async function runSeeders() {
    try {
        const existingUser = await db.User.findOne({ where: { email: DEMO_USER.email } });

        if (!existingUser) {
            await db.User.create({
                ...DEMO_USER,
                password: await hashPassword(DEMO_USER.password),
            });
            console.log(`User seeded: ${DEMO_USER.email}`);
        }

        console.log('Seeders loaded');
    } catch (err) {
        console.error('Error in seeders:', err);
        throw err;
    }
}

module.exports = runSeeders;
