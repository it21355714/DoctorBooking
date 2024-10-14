import express from 'express';
import { authenticateToken } from '../middleware/authenticate.js';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser , loginUser,getUser} from '../controllers/userController.js';

const userRoutes = express.Router();

// User routes
userRoutes.post('/', createUser);
userRoutes.get('/users', getAllUsers);
userRoutes.get('/',authenticateToken,getUserById);
userRoutes.put('/update',authenticateToken, updateUser);
userRoutes.delete('/:id', deleteUser);

userRoutes.get('/userid/:id',getUser);
userRoutes.post('/login', loginUser);

export default userRoutes;
