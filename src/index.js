//Globals
global.__basedir = __dirname;
global.params = require('~/package.json');

import config from './lib/config';

//debug
const debug = require('debug')(config.appName);

//db
import { DbService } from './lib/services';
DbService.connect();

import boostrap from './bootstrap';
boostrap(config);


