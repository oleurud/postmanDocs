'use strict';
import  Q from 'q';
import ldap from 'ldapjs';
import config from '../../config';

const debug = require('debug')('postmanDocs:ldap');
var client = {};

module.exports = {

    createClient: function () {
        client = ldap.createClient({
            url: 'ldap://' + config.ldap.host + ':' + config.ldap.port,
            timeout: config.ldap.timeout || 2000
        });
    },

    bind: function (email, password) {

        debug('binding with email password');

        var deferred = Q.defer();
        try {
            this.createClient();
        } catch (err) {
            deferred.resolve({status:'error'})
        }

        client.bind(email, password, function(err) {
            if (err) {
                deferred.resolve({status:'error'})
            } else 
                deferred.resolve({status:'good'})
        });

        return deferred.promise
    }

};