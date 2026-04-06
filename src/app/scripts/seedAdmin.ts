import { Role } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  try {
    // check user exist in db or not
    const adminData = {
      name: "Admin",
      email: "admin@admin.com",
      role: Role.ADMIN,
      password: "Admin12345",
    };
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });
    if (existingUser) {
      throw new Error("User already exist!");
    }
    // signup admin
    await fetch("http://localhost:5000/api/v1/auth/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Origin: "http://localhost:5000",
      },
      body: JSON.stringify(adminData),
    });
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
