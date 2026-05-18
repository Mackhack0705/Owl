"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type Issue = {
  id: string
  title: string
  url: string
  author: string
  createdAt: string
  labels: string[]
  hasLinkedPr: boolean
  linkedPrUrl: string
  linkedPrState: string
  repo: {
    fullName: string
  }
}

export function IssueFeed() {
  const [issues, setIssues] = useState<Issue[]>([])

  async function fetchIssues() {
    const response = await fetch("/api/issues")

    const data = await response.json()

    setIssues(data)
  }

  useEffect(() => {
    fetchIssues()

    const interval = setInterval(() => {
      fetchIssues()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      {issues.map((issue, index) => (
        <motion.a
          key={issue.id}
          href={issue.url}
          target="_blank"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03 }}
          className="block rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur transition hover:border-zinc-700"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-medium leading-relaxed text-white">
                {issue.title}
              </h3>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                <span>{issue.repo.fullName}</span>

                <span>•</span>

                <span>{issue.author}</span>

                <span>•</span>

                <span>
                  {formatDistanceToNow(
                    new Date(issue.createdAt),
                    {
                      addSuffix: true
                    }
                  )}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {issue.labels.map((label) => (
                  <Badge
                    key={label}
                    variant="secondary"
                    className="bg-zinc-800 text-zinc-300"
                  >
                    {label}
                  </Badge>
                ))}
              </div>

              {
                issue.hasLinkedPr && (
                  <Badge className="bg-yellow-500/20 text-yellow-400">
                    Has PR
                  </Badge>
                )
              }
            </div>

            <ExternalLink className="mt-1 h-4 w-4 text-zinc-500" />
          </div>
        </motion.a>
      ))}
    </div>
  )
}