"use client"

import { motion } from "framer-motion"
import {
  Bell,
  Activity,
  Database
} from "lucide-react"
import { SiGithub } from "react-icons/si"

const stats = [
  {
    title: "Tracked Repositories",
    value: "Live",
    icon: SiGithub
  },
  {
    title: "Telegram Notifications",
    value: "Active",
    icon: Bell
  },
  {
    title: "Realtime Polling",
    value: "1 min",
    icon: Activity
  },
  {
    title: "Database",
    value: "Neon",
    icon: Database
  }
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-zinc-400">
                  {stat.title}
                </p>

                <h2 className="mt-3 text-3xl font-bold text-white">
                  {stat.value}
                </h2>
              </div>

              <div className="rounded-xl border border-zinc-700 bg-black p-3">
                <Icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}