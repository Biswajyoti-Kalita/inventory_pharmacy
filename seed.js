
	const app = require('./app');
	const db = require('./models');
    const PasswordService = required('./services/passwordService');
	async function createSeeds() {
await db.user.create( {"id":1,"username":"admin","name":"admin","email":"admin@admin.in","password":"a12345","role_id":0} );await db.user.create( {"id":2,"username":"pharmacies","name":"pharmacies","email":"pharmacies@admin.in","password":"a12345","role_id":1} );
}
createSeeds();
