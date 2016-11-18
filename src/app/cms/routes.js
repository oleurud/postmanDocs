import express from 'express';
import passport from 'passport';
import passportCms from '~/src/lib/services';
import { AuthController, HomeController, SourceController, UserController } from './controllers';

export default function(app){

    const cms = express.Router();
    const authRoutes = express.Router();
    
    const requireLogin = passport.authenticate('localCMS', {
        successRedirect: '/cms',
        failureRedirect: '/cms/auth/login',
        failureFlash: true
    });

    const requireAuth = (req, res, next) => {
        if (req.isAuthenticated())
            return next();
        res.redirect('/cms/auth/login');
    };

    // Redirect to cms
    app.get('/', function(req, res) {
        res.redirect('/cms');
    });
    
    cms.get('/', requireAuth, HomeController.index);

    /* AUTH */
    cms.use('/auth', authRoutes);
    authRoutes.get('/login', AuthController.login);
    authRoutes.post('/login', requireLogin, AuthController.successLogin);
    authRoutes.get('/logout', AuthController.logout);

    /* SOURCES */
    cms.get('/sources', requireAuth, SourceController.getAll);
    cms.get('/sources/add', requireAuth, SourceController.add);
    cms.post('/sources/add', requireAuth, SourceController.save);
    cms.get('/sources/:sourceName/users', requireAuth, SourceController.users);
    cms.get('/sources/:sourceName/config', requireAuth, SourceController.config);
    cms.post('/sources/:sourceName/config', requireAuth, SourceController.configSave);

    /* USERS */
    cms.get('/users', requireAuth, UserController.list);
    cms.get('/users/:userName/role/:role', requireAuth, UserController.setRole);
    cms.get('/users/:userName/sources', requireAuth, UserController.sources);
    cms.get('/users/:userName/permissions/:sourceId/:action', requireAuth, UserController.permissions);
    cms.get('/users/add', requireAuth, UserController.add);
    cms.post('/users/add', requireAuth, UserController.createUser);


    app.use('/cms', cms);

}
