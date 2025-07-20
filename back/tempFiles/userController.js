import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepository from "./userRepository.js";

// JWT secret (in production, this should be in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST /api/users/register
export async function registerUser(req, res) {
  try {
    const { username, email, password, role, permissions } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: "Username, email, and password are required" 
      });
    }

    // Check if username already exists
    const existingUsername = await userRepository.getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ 
        message: "Username already exists" 
      });
    }

    // Check if email already exists
    const existingEmail = await userRepository.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ 
        message: "Email already exists" 
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      username,
      email,
      passwordHash,
      role: role || 'user',
      permissions: permissions || []
    };

    const newUser = await userRepository.createUser(userData);
    
    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/users/login
export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ 
        message: "Username and password are required" 
      });
    }

    console.log('🔍 Login attempt for username:', username);

    // Get user by username
    const user = await userRepository.getUserByUsername(username);
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }

    console.log('✅ User found:', {
      id: user.UserID,
      username: user.Username,
      isActive: user.IsActive,
      hasPasswordHash: !!user.PasswordHash
    });

    // Check if user is active
    if (!user.IsActive) {
      console.log('❌ User is inactive:', username);
      return res.status(401).json({ 
        message: "Account is deactivated" 
      });
    }

    // Verify password
    console.log('Password from user:', password, '| Length:', password.length);
    console.log('Hash from DB:', user.PasswordHash, '| Length:', user.PasswordHash.length);
    console.log('🔐 Comparing passwords...');
    const isValidPassword = await bcrypt.compare(password, user.PasswordHash);
    console.log('🔐 Password comparison result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', username);
      return res.status(401).json({ 
        message: "Invalid credentials" 
      });
    }

    console.log('✅ Password verified successfully');

    // Update last login
    await userRepository.updateLastLogin(user.UserID);

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.UserID, 
        username: user.Username, 
        role: user.Role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Get user permissions
    const permissions = await userRepository.getUserPermissions(user.UserID);

    console.log('✅ Login successful for user:', username);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.UserID,
        username: user.Username,
        email: user.Email,
        role: user.Role,
        permissions
      }
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/users
export async function getAllUsers(req, res) {
  try {
    const users = await userRepository.getUsersWithPermissions();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/users/:id
export async function getUserById(req, res) {
  try {
    const user = await userRepository.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user permissions
    const permissions = await userRepository.getUserPermissions(user.UserID);
    
    res.json({
      ...user,
      permissions
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// POST /api/users
export async function createUser(req, res) {
  try {
    const { username, email, password, role, permissions } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: "Username, email, and password are required" 
      });
    }

    // Check if username already exists
    const existingUsername = await userRepository.getUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ 
        message: "Username already exists" 
      });
    }

    // Check if email already exists
    const existingEmail = await userRepository.getUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ 
        message: "Email already exists" 
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      username,
      email,
      passwordHash,
      role: role || 'user',
      permissions: permissions || []
    };

    const newUser = await userRepository.createUser(userData);
    
    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  try {
    const { username, email, role, isActive, permissions } = req.body;
    const userId = req.params.id;

    // Check if user exists
    const existingUser = await userRepository.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if username is being changed and if it already exists
    if (username && username !== existingUser.Username) {
      const existingUsername = await userRepository.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ 
          message: "Username already exists" 
        });
      }
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingUser.Email) {
      const existingEmail = await userRepository.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ 
          message: "Email already exists" 
        });
      }
    }

    // Update user
    const userData = {
      username: username || existingUser.Username,
      email: email || existingUser.Email,
      role: role || existingUser.Role,
      isActive: isActive !== undefined ? isActive : existingUser.IsActive,
      permissions
    };

    const updatedUser = await userRepository.updateUser(userId, userData);
    
    res.json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// PUT /api/users/:id/password
export async function updateUserPassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Current password and new password are required" 
      });
    }

    // Get user with password hash
    const user = await userRepository.getUserByUsername(req.body.username);
    if (!user || user.UserID != userId) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.PasswordHash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: "Current password is incorrect" 
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await userRepository.updateUserPassword(userId, newPasswordHash);
    
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// DELETE /api/users/:id
export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    // Check if user exists
    const existingUser = await userRepository.getUserById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await userRepository.deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// GET /api/users/permissions
export async function getAllPermissions(req, res) {
  try {
    const permissions = await userRepository.getAllPermissions();
    res.json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
}

// Middleware to check if user has specific permission
export function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      const userPermissions = await userRepository.getUserPermissions(req.user.userId);
      if (!userPermissions.includes(permission)) {
        return res.status(403).json({ 
          message: "Insufficient permissions" 
        });
      }
      next();
    } catch (error) {
      console.error("Error checking permissions:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
}
