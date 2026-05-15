"use client"

import { BellRing } from "lucide-react"
import { SiGithub } from "react-icons/si"
import { motion } from "framer-motion"

export function DashboardNavbar() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 border-b border-zinc-800 bg-black/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 border-red-500">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white p-2 text-black">
            <SiGithub className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-white">
              Owl
            </h1>

            <p className="text-xs text-zinc-400">
              Open Source Issue Monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2">
          <BellRing className="h-4 w-4 text-emerald-400" />

          <span className="text-sm text-zinc-300">
            Worker Active
          </span>
        </div>
      </div>
    </motion.div>
  )
}