import { pool } from "../utils/database.js"


export class UserController {
    static async getAllUsers(req, res) {
        try {
            const conn = await pool.getConnection();

            // Get all users and hosts
            const [users] = await conn.query(`SELECT user, host FROM mysql.user`);

            const userMap = [];

            for (const user of users) {
                const userName = user.user;
                const userHost = user.host;

                // Get grants for each user
                const [grantsResult] = await conn.query(`SHOW GRANTS FOR ?@?`, [userName, userHost]);

                // Example grantsResult: [{ 'SHOW GRANTS FOR `user`@`host`': 'GRANT INSERT, DELETE ON `smart_beekeeper`.* TO `user`@`host`' }, ...]
                // The key varies, so extract the first value in object:
                const grantsStrings = grantsResult.map(obj => Object.values(obj)[0]);

                // Filter and parse grants only for smart_beekeeper database
                const privileges = [];
                for (const grantStr of grantsStrings) {
                    // Only consider grants on smart_beekeeper database
                    if (grantStr.includes("ON `smart_beekeeper`")) {
                        // Extract privileges part, between "GRANT " and " ON"
                        const matched = grantStr.match(/GRANT (.+?) ON/);
                        if (matched && matched[1]) {
                            const perms = matched[1]
                                .split(",")
                                .map(p => p.trim().toUpperCase())
                                .filter(p => p.length > 0);
                            privileges.push(...perms);
                        }
                    }
                }

                userMap.push({
                    user: userName,
                    host: userHost,
                    privileges: privileges.length > 0 ? Array.from(new Set(privileges)).join(", ") : "NONE",
                });
            }

            conn.release();

            res.status(200).json(userMap);
        } catch (error) {
            console.error("❌ Failed to fetch users:", error);
            res.status(500).json({ error: "Failed to get users and privileges" });
        }
    }



    static async createUser(req, res) {
        const { name, host, password, privileges } = req.body;

        try {
            // Create user
            await pool.query(`CREATE USER ?@? IDENTIFIED BY ?`, [name, host, password]);

            // Grant privileges if provided
            if (privileges.length > 0) {
                const grantSQL = `GRANT ${privileges.join(", ")} ON smart_beekeeper.* TO ?@?`;
                await pool.query(grantSQL, [name, host]);
            }

            await pool.query(`FLUSH PRIVILEGES`);

            res.json({ message: `User ${name}@${host} created successfully.` });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}