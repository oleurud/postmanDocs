import { DbService, ProcessLocalSource } from './services';
import Q from 'q';
import { User } from './models';

DbService.connect();

console.log('Running fixtures');
let promises = [];

//SuperAdmin user
let user = new User({
    email: 'admin@test.com',
    password: '1q2w3e4r',
    username: 'admin',
    tokens: [],
    role: 'SuperAdmin'
});

promises.push(
    user.save()
);

//collection example
promises.push(
    ProcessLocalSource(
        'PostmanDocs',
        __dirname + '/../../PostmanDocs.postman_collection.json',
        'http://example.com',
        user
    )
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

