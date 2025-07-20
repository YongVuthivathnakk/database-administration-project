import { pool } from "../src/utils/database.js";

// Get all users
export async function getAllUsers() {
  const [rows] = await pool.query(`
    SELECT 
      UserID,
      Username,
      Email,
      Role,
      IsActive,
      CreatedAt,
      LastLogin
    FROM Users
    ORDER BY CreatedAt DESC
  `);
  return rows;
}

// Get user by ID
export async function getUserById(id) {
  const [rows] = await pool.query(`
    SELECT 
      UserID,
      Username,
      Email,
      Role,
      IsActive,
      CreatedAt,
      LastLogin
    FROM Users 
    WHERE UserID = ?
  `, [id]);
  return rows[0];
}

// Get user by username
export async function getUserByUsername(username) {
  const [rows] = await pool.query(`
    SELECT 
      UserID,
      Username,
      Email,
      PasswordHash,
      Role,
      IsActive,
      CreatedAt,
      LastLogin
    FROM Users 
    WHERE Username = ?
  `, [username]);
  return rows[0];
}

// Get user by email
export async function getUserByEmail(email) {
  const [rows] = await pool.query(`
    SELECT 
      UserID,
      Username,
      Email,
      PasswordHash,
      Role,
      IsActive,
      CreatedAt,
      LastLogin
    FROM Users 
    WHERE Email = ?
  `, [email]);
  return rows[0];
}

// Create new user
export async function createUser(userData) {
  const { username, email, passwordHash, role, permissions } = userData;
  const defaultMySQLPassword = 'User@123'; // You may want to generate or require a password in production
  const dbName = process.env.DB_NAME || 'Smart_Beekeeper';

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert user
    const [userResult] = await connection.query(`
      INSERT INTO Users (Username, Email, PasswordHash, Role, IsActive, CreatedAt)
      VALUES (?, ?, ?, ?, 1, NOW())
    `, [username, email, passwordHash, role]);

    const userId = userResult.insertId;

    // Insert user permissions if provided
    if (permissions && permissions.length > 0) {
      const permissionValues = permissions.map(permission => [userId, permission]);
      await connection.query(`
        INSERT INTO UserPermissions (UserID, Permission)
        VALUES ?
      `, [permissionValues]);
    }

    // Create MySQL user and grant privileges
    await createMySQLUser(username, defaultMySQLPassword, dbName);

    await connection.commit();

    // Return the created user (without password)
    return getUserById(userId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Update user
export async function updateUser(id, userData) {
  const { username, email, role, isActive, permissions } = userData;
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Update user
    await connection.query(`
      UPDATE Users 
      SET Username = ?, Email = ?, Role = ?, IsActive = ?
      WHERE UserID = ?
    `, [username, email, role, isActive, id]);
    
    // Update permissions if provided
    if (permissions !== undefined) {
      // Delete existing permissions
      await connection.query(`
        DELETE FROM UserPermissions WHERE UserID = ?
      `, [id]);
      
      // Insert new permissions
      if (permissions.length > 0) {
        const permissionValues = permissions.map(permission => [id, permission]);
        await connection.query(`
          INSERT INTO UserPermissions (UserID, Permission)
          VALUES ?
        `, [permissionValues]);
      }
    }
    
    await connection.commit();
    
    return getUserById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Update user password
export async function updateUserPassword(id, passwordHash, plainPassword, username) {
  // Update app database password hash
  await pool.query(`
    UPDATE Users 
    SET PasswordHash = ?
    WHERE UserID = ?
  `, [passwordHash, id]);

  // Update MySQL user password (for login to MySQL)
  if (plainPassword && username) {
    await pool.query(
      `ALTER USER \`${username}\`@'localhost' IDENTIFIED WITH mysql_native_password BY ?`,
      [plainPassword]
    );
  }
}

// Delete user
export async function deleteUser(id) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Delete user permissions first
    await connection.query(`
      DELETE FROM UserPermissions WHERE UserID = ?
    `, [id]);
    
    // Delete user
    await connection.query(`
      DELETE FROM Users WHERE UserID = ?
    `, [id]);
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Get user permissions
export async function getUserPermissions(userId) {
  const [rows] = await pool.query(`
    SELECT Permission 
    FROM UserPermissions 
    WHERE UserID = ?
  `, [userId]);
  return rows.map(row => row.Permission);
}

// Get all available permissions
export async function getAllPermissions() {
  // Return a static list of all possible permissions
  return [
    "user:create", "user:read", "user:update", "user:delete",
    "beekeeper:create", "beekeeper:read", "beekeeper:update", "beekeeper:delete",
    "hive:create", "hive:read", "hive:update", "hive:delete",
    "species:create", "species:read", "species:update", "species:delete",
    "environment:create", "environment:read", "environment:update", "environment:delete",
    "plant:create", "plant:read", "plant:update", "plant:delete",
    "honey:create", "honey:read", "honey:update", "honey:delete"
  ];
}

// Update last login
export async function updateLastLogin(userId) {
  await pool.query(`
    UPDATE Users 
    SET LastLogin = NOW()
    WHERE UserID = ?
  `, [userId]);
}

// Get users with their permissions
export async function getUsersWithPermissions() {
  const [rows] = await pool.query(`
    SELECT 
      u.UserID,
      u.Username,
      u.Email,
      u.Role,
      u.IsActive,
      u.CreatedAt,
      u.LastLogin,
      GROUP_CONCAT(up.Permission) as Permissions
    FROM Users u
    LEFT JOIN UserPermissions up ON u.UserID = up.UserID
    GROUP BY u.UserID
    ORDER BY u.CreatedAt DESC
  `);
  
  return rows.map(row => ({
    ...row,
    Permissions: row.Permissions ? row.Permissions.split(',') : []
  }));
}

export async function createMySQLUser(username, password, dbName) {
  try {
    // Create MySQL user (interpolate username and host directly for localhost)
    await pool.query(
      `CREATE USER IF NOT EXISTS \`${username}\`@'localhost' IDENTIFIED WITH mysql_native_password BY ?`,
      [password]
    );
    // Grant privileges
    await pool.query(
      `GRANT ALL PRIVILEGES ON \`${dbName}\`.* TO \`${username}\`@'localhost'`
    );
    // Always set the password to ensure it matches
    await pool.query(
      `ALTER USER \`${username}\`@'localhost' IDENTIFIED WITH mysql_native_password BY ?`,
      [password]
    );
    // No need to run FLUSH PRIVILEGES here
    return true;
  } catch (err) {
    console.error("Error creating MySQL user:", err);
    throw err;
  }
}