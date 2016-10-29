import expressDeliver from 'express-deliver';

const ApiController = expressDeliver.wrapper({
    index: () => {
        return "Hello!"
    }
});

export default ApiController;
