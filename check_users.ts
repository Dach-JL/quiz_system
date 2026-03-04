import sql from "./src/lib/db.ts";

async function checkUsers() {
    try {
        const users = await sql`SELECT id, name, email, role FROM users`;
        console.log("Users in database:");
        console.table(users);
    } catch (error) {
        console.error("Error checking users:", error);
    }
    process.exit(0);
}

checkUsers();
