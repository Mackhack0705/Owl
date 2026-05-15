import "dotenv/config"
import cron from "node-cron"
import { pollRepositories } from "./pollRepos"

console.log("Worker started")

let running = false

cron.schedule("* * * * *", async () => {
  if (running) {
    console.log("Job already running")
    return
  }

  running = true

  try {
    console.log("Checking repositories...")

    await pollRepositories()
  } catch (error) {
    console.error(error)
  } finally {
    running = false
  }
})