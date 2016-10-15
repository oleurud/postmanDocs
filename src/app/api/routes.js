import express from 'express';
import passport from 'passport';
import passportService from '~/src/lib/services/passport';
import { ApiController, AuthController, SourceController } from './controllers';

export default function(app){

    const v1 = express.Router();
    const authRoutes = express.Router();

    const requireAuth = passport.authenticate('jwt', { session: false });
    const requireLogin = passport.authenticate('local', { session: false });

    v1.use('/auth', authRoutes);
    authRoutes.post('/register', AuthController.register);
    authRoutes.post('/login', requireLogin, AuthController.login);

    v1.get('/', ApiController.index);
    //v1.get('/admin', requireAuth, ApiController.admin);


    v1.get('/source', SourceController.getAll);
    v1.get('/source/:sourceName', SourceController.getOne);
    v1.get('/source/:sourceName/:format', SourceController.getOneFormated);
    v1.post('/source', SourceController.save);


    app.use('/v1', v1);
    app.use('/', v1);

}
