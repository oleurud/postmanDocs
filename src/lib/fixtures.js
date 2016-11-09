import { DbService } from './services';
import { User } from './models';

DbService.connect();

console.log('Running fixtures');

let adminUser = new User({
    email: 'admin@test.com',
    password: 'xxx',
    username: 'admin',
    tokens: [],
    role: 'SuperAdmin'
});
adminUser.save();

console.log('Admin user created');

console.log('End of fixtures');