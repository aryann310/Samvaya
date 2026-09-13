import { Router } from 'express';
import { UserService } from '../services/userService.js';
import { JwtService } from '../security/jwtService.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { DataStore } from '../services/dataStore.js';
const router = Router();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/**
 * @route   POST /api/auth/register (or /api/v2/auth/register)
 * @desc    Register a new user, hashes password, encrypts phone at rest, and returns JWT token
 */
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, businessName, role } = req.body;
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: 'Name is required' });
        }
        if (!email || !EMAIL_REGEX.test(email.trim())) {
            return res.status(400).json({ error: 'A valid email address is required' });
        }
        if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
            return res.status(400).json({ error: 'A valid phone number is required (min 8 digits)' });
        }
        if (!password || typeof password !== 'string' || password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        const newUser = await UserService.createUser({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            password,
            businessName,
            role: role || 'entrepreneur',
        });
        const token = JwtService.generateToken(newUser);
        return res.status(201).json({
            message: 'User registered successfully',
            user: newUser,
            token,
        });
    }
    catch (err) {
        if (err.message && err.message.includes('already exists')) {
            return res.status(409).json({ error: err.message });
        }
        return res.status(500).json({ error: 'Registration failed: ' + (err.message || 'Unknown error') });
    }
});
/**
 * @route   POST /api/auth/login (or /api/v2/auth/login)
 * @desc    Authenticate user credentials, verify bcrypt hash, and return signed JWT token
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const user = await UserService.authenticate({ email, password });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = JwtService.generateToken(user);
        return res.json({
            message: 'Login successful',
            user,
            token,
        });
    }
    catch (err) {
        return res.status(500).json({ error: 'Authentication failed: ' + (err.message || 'Unknown error') });
    }
});
/**
 * @route   GET /api/auth/me (or /api/v2/auth/me)
 * @desc    Get profile for currently authenticated user via JWT
 */
router.get('/me', authenticateToken, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthenticated' });
    }
    const user = UserService.findById(req.user.userId);
    if (!user) {
        return res.status(404).json({ error: 'User profile not found' });
    }
    const sanitized = UserService.getAllUsersSanitized().find((u) => u.id === req.user?.userId);
    return res.json({
        user: sanitized || {
            id: req.user.userId,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            businessId: req.user.businessId,
        },
        business: {
            id: DataStore.business.id,
            name: DataStore.business.name,
            category: DataStore.business.category,
            location: DataStore.business.location,
        },
    });
});
/**
 * @route   POST /api/auth/logout
 * @desc    Logout confirmation (client should discard JWT)
 */
router.post('/logout', (req, res) => {
    return res.json({ message: 'Logged out successfully' });
});
export default router;
//# sourceMappingURL=auth.routes.js.map