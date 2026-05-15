"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SiGithub } from "react-icons/si"

type Repo = {
  id: string
  fullName: string
}

export function RepoList() {
  const [repos, setRepos] = useState<Repo[]>([])

  async function fetchRepos() {
    const response = await fetch("/api/repos")

    const data = await response.json()

    setRepos(data)
  }

  async function deleteRepo(id: string) {
    await fetch(`/api/repos/${id}`, {
      method: "DELETE"
    })

    fetchRepos()
  }

  useEffect(() => {
    fetchRepos()
  }, [])

  return (
    <div className="space-y-4">
      {repos.map((repo, index) => (
        <motion.div
          key={repo.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-zinc-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-zinc-700 bg-black p-3">
                <SiGithub className="h-5 w-5 text-white" />
              </div>

              <div>
                <h3 className="font-medium text-white">
                  {repo.fullName}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/20 text-emerald-400"
                  >
                    Active
                  </Badge>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteRepo(repo.id)}
              className="opacity-0 transition group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}