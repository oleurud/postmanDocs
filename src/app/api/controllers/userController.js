import expressDeliver from 'express-deliver';
import { errorResponse } from '~/src/lib/services';
import { User } from '~/src/lib/models';

const UserController = expressDeliver.wrapper({
    setRole: (req, res, next) => {
        const username = req.params.userName;
        const role = req.body.role;
        
        if (!username) {
            return errorResponse(10103);
        }

        if (!role) {
            return errorResponse(11001);
        } else if(role == 'SuperAdmin' || (role != 'Client' && role != 'Admin')) {
            return errorResponse(11002);
        }

        return User.setRole(req.user, username, role).then( (result) => {
            if(result) {
                return { message: 'Done' };
            } else {
                return errorResponse(10000);
            }
        });
    },
    
    setPermissions: (req, res, next) => {
        const username = req.params.userName;
        const permissions = req.body.permissions;

        if (!username) {
            return errorResponse(10103);
        }

        if (!permissions || !Array.isArray(permissions) || permissions.length == 0) {
            return errorResponse(11003);
        }
        
        return User.setSourcePermissions(req.user, username, permissions).then( (result) => {
            if(result) {
                return { message: 'Done' };
            } else {
                return errorResponse(10000);
            }
        });
    }
});

export default UserController;
