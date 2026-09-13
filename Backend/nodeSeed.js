import bcrypt from "bcryptjs";
import { db } from "./config/db.js";

async function seedUsers() {
  try {
    console.log("Seeding users...");

    const password =
      await bcrypt.hash(
        "123456",
        10
      );

    const users = [
      /* ADMINS */
     

      /* CUSTOMERS */
      [
        "Rahul Sharma",
        "rahul@gmail.com",
        "8888881111",
        password,
        "user",
        "Jaipur",
        null,
        null,
        "active",
      ],
     
      /* TECHNICIANS */
      [
        "Ramesh Plumber",
        "plumber@gmail.com",
        "7777771111",
        password,
        "technician",
        "Jaipur",
        "Plumbing",
        4,
        "active",
      ],
      [
        "Suresh Electrician",
        "electric@gmail.com",
        "7777772222",
        password,
        "technician",
        "Delhi",
        "Electrical Repair",
        6,
        "active",
      ],
      [
        "Vikas AC Repair",
        "acrepair@gmail.com",
        "7777773333",
        password,
        "technician",
        "Mumbai",
        "AC Repair",
        5,
        "active",
      ],
      [
        "Cleaning Expert",
        "cleaning@gmail.com",
        "7777774444",
        password,
        "technician",
        "Jaipur",
        "Home Cleaning",
        3,
        "active",
      ],
    ];

    for (const user of users) {
      await db.query(
        `
        INSERT INTO users 
        (
          name,
          email,
          phone,
          password,
          role,
          city,
          specialization,
          experience,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        user
      );
    }

    console.log(
      "Users seeded successfully"
    );

    process.exit();

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

seedUsers();