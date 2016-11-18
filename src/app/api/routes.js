import express from 'express';
import passport from 'passport';
import PassportApi from '~/src/lib/services';
import { ApiController, AuthController, UserController, SourceController } from './controllers';

export default function(app){

    const v1 = express.Router();
    const authRoutes = express.Router();

    v1.get('/', ApiController.index);

    /* AUTH */
    const requireAuth = passport.authenticate('jwt', { session: false });
    const requireLogin = passport.authenticate('local', { session: false });

    v1.use('/auth', authRoutes);
    authRoutes.post('/register', AuthController.register);
    authRoutes.post('/login', requireLogin, AuthController.login);
    
    /* USERS */
    v1.post('/users/:userName/role', requireAuth, UserController.setRole);
    v1.post('/users/:userName/permissions/sources', requireAuth, UserController.setPermissions);

    /* SOURCES */
    v1.get('/sources', requireAuth, SourceController.getAll);
    v1.get('/sources/:sourceName', requireAuth, SourceController.getOne);
    v1.get('/sources/:sourceName/:format', requireAuth, SourceController.getOneFormated);
    v1.post('/sources', requireAuth, SourceController.save);


    app.use('/v1', v1);
    app.use('/', v1);

}
