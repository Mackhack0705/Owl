"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SiGithub } from "react-icons/si"

export function AddRepoForm() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    setLoading(true)

    try {
      await fetch("/api/repos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          url
        })
      })

      setUrl("")

      window.location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 backdrop-blur"
    >
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <SiGithub className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />

          <Input
            placeholder="https://github.com/calcom/cal.com"
            value={url}
            onChange={(e) =>
              setUrl(e.target.value)
            }
            className="h-12 border-zinc-700 bg-black pl-12 text-white"
          />
        </div>

        <Button
          disabled={loading}
          className="h-12 rounded-xl bg-white px-8 text-black hover:bg-zinc-200"
        >
          {loading
            ? "Adding Repository..."
            : "Track Repository"}
        </Button>
      </div>
    </motion.form>
  )
}