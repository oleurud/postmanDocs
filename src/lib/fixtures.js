import { DbService } from './services';
import Q from 'q';
import { User } from './models';

DbService.connect();

console.log('Running fixtures');
let promises = [];
promises.push(
    User.create({
        email: 'admin@test.com',
        password: 'XXXXXXXX',
        username: 'admin',
        tokens: [],
        role: 'SuperAdmin'
    })
);


Q.all(promises)
.then(function(){
	console.log('All done');
})
.catch(function(err){
    console.log(err);
})
.finally(function(){
    DbService.disconnect();
    console.log('End of fixtures');
})
.done();

