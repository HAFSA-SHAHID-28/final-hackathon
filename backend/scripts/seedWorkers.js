import "dotenv/config";
import mongoose from "mongoose";
import workers from "../data/workers.json" with { type: "json" };
import User from "../models/User.js";

const seedWorkers = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STR);

    for (const worker of workers) {
      const existingWorker = await User.findOne({
        email: worker.email,
      });

      if (existingWorker) {
        // Existing account ko worker configuration ke saath sync karo.
        existingWorker.name = worker.name;
        existingWorker.role = "worker";
        existingWorker.status = "active";
        existingWorker.serviceCategories = worker.serviceCategories;
        existingWorker.ratingAverage = worker.ratingAverage;
        existingWorker.ratingCount = worker.ratingCount;

        // Existing password ko touch nahi karna.
        await existingWorker.save();

        console.log(`Updated worker: ${worker.email}`);
      } else {
        // New worker -> User.create() / save() middleware
        // password ko bcrypt se hash karega.
        await User.create({
          name: worker.name,
          email: worker.email,
          password: worker.password,
          role: "worker",
          status: "active",
          serviceCategories: worker.serviceCategories,
          ratingAverage: worker.ratingAverage,
          ratingCount: worker.ratingCount,
        });

        console.log(`Created worker: ${worker.email}`);
      }
    }

    const existingAdmin = await User.findOne({
      email: "admin@supportflow.local",
    });

    if (existingAdmin) {
      existingAdmin.name = "Support Admin";
      existingAdmin.role = "admin";
      existingAdmin.status = "active";

      await existingAdmin.save();

      console.log("Updated admin account.");
    } else {
      await User.create({
        name: "Support Admin",
        email: "admin@supportflow.local",
        password: "Admin@123",
        role: "admin",
        status: "active",
      });

      console.log("Created admin account.");
    }

    console.log("Worker/admin seed completed successfully.");
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

await seedWorkers();