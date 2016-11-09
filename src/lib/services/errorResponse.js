import expressDeliver from 'express-deliver';
const exception = expressDeliver.exception;

exception[500] = class Error500 extends exception.BaseException{
    constructor(data){
        super(500,'Something was wrong',data);
    }
};
exception[404] = class Error404 extends exception.BaseException{
    constructor(data){
        super(404,'Not found',data);
    }
};

//auth
exception[10000] = class Error10000 extends exception.BaseException{
    constructor(data){
        super(10000,'Unauthorized',data);
    }
};
exception[10001] = class Error10001 extends exception.BaseException{
    constructor(data){
        super(10001,'Token expired',data);
    }
};
exception[10002] = class Error10002 extends exception.BaseException{
    constructor(data){
        super(10002,'Your login details could not be verified. Please try again',data);
    }
};


//auth validation
exception[10101] = class Error10101 extends exception.BaseException{
    constructor(data){
        super(10101,'You must enter an email address',data);
    }
};
exception[10102] = class Error10102 extends exception.BaseException{
    constructor(data){
        super(10102,'You must enter a password',data);
    }
};
exception[10103] = class Error10103 extends exception.BaseException{
    constructor(data){
        super(10103,'You must enter a username',data);
    }
};
exception[10104] = class Error10104 extends exception.BaseException{
    constructor(data){
        super(10104,'You must enter a device',data);
    }
};
exception[10111] = class Error10111 extends exception.BaseException{
    constructor(data){
        super(10111,'That email address is already in use',data);
    }
};
exception[10112] = class Error10112 extends exception.BaseException{
    constructor(data){
        super(10112,'That username is already in use',data);
    }
};

//users
exception[11001] = class Error11001 extends exception.BaseException{
    constructor(data){
        super(11001,'You must enter role',data);
    }
};
exception[11002] = class Error11002 extends exception.BaseException{
    constructor(data){
        super(11002,'Role not allowed',data);
    }
};
exception[11003] = class Error11003 extends exception.BaseException{
    constructor(data){
        super(11003,'You must enter a permissions list',data);
    }
};

//sources
exception[12001] = class Error12001 extends exception.BaseException{
    constructor(data){
        super(12001,'You dont have permissions to create sources',data);
    }
};
exception[12002] = class Error12002 extends exception.BaseException{
    constructor(data){
        super(12002,'You must add a postman collection',data);
    }
};
exception[12003] = class Error12003 extends exception.BaseException{
    constructor(data){
        super(12003,'You must set a collection name',data);
    }
};
exception[12004] = class Error12004 extends exception.BaseException{
    constructor(data){
        super(12004,'You must set a url',data);
    }
};

export default (errorCode) => {
    if(!errorCode) {
        errorCode = 500;
    }
    return exception[errorCode];
};