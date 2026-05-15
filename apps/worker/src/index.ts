console.log("Worker started")import "dotenv/config"
import cron from "node-cron"
import { pollRepositories } from "./pollRepos"

console.log("Worker started")

cron.schedule("* * * * *", async () => {
  console.log("Checking repositories...")

  await pollRepositories()
})