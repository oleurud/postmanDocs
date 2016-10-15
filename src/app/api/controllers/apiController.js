import expressDeliver from 'express-deliver';

const ApiController = expressDeliver.wrapper({
    index: () => {
        return "Hello!"
    },
    admin: () => {
        return 'You are in admin area';
    }
});

export default ApiController;
