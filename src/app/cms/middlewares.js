import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import hbs from 'hbs';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import config from '../../lib/config';
import flash from 'connect-flash';

export default function(app){

    app.set('view engine', 'hbs');
    app.set('views', __dirname + '/views');
    app.use('/css', express.static(__dirname + '/views/css'));

    hbs.registerHelper('isEquals', function(v1, v2, options) {
        if(v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });

    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({extended:true, limit: '50mb'}));
    app.use(cookieParser());

    app.use(fileUpload());

    app.use(session({
        secret: config.secret,
        cookie: { path: '/', httpOnly: true, secure: false, maxAge: null },
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
}