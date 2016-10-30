import expressDeliver from 'express-deliver';
import { User } from '~/src/lib/models';

const UserController = expressDeliver.wrapper({
    setRole: (req, res, next) => {
        const username = req.params.userName;
        const role = req.body.role;
        
        if (!username) {
            return { error: 'You must enter a username.' };
        }

        if (!role) {
            return { error: 'You must enter role.' };
        } else if(role == 'SuperAdmin' || (role != 'Client' && role != 'Admin')) {
            return { error: 'Role not allowed' };
        }

        return User.setRole(req.user, username, role).then( (result) => {
            if(result) {
                return { message: 'Done' };
            } else {
                return { error: 'Unauthorized' };
            }
        });
    },
    
    setPermissions: (req, res, next) => {
        const username = req.params.userName;
        const permissions = req.body.permissions;

        if (!username) {
            return { error: 'You must enter a username.' };
        }

        if (!permissions || !Array.isArray(permissions) || permissions.length == 0) {
            return { error: 'You must enter a permissions list.' };
        }
        
        return User.setSourcePermissions(req.user, username, permissions).then( (result) => {
            if(result) {
                return { message: 'Done' };
            } else {
                return { error: 'Unauthorized' };
            }
        });
    }
});

export default UserController;
