"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Pause, Play, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SiGithub } from "react-icons/si"
import { RepoCard } from "./repo-card"

type Repo = {
  id: string
  fullName: string
  active: boolean
  trackedLabels: string[]
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

  async function toggleRepo(id: string) {
    await fetch(
      `/api/repos/${id}/toggle`,
      {
        method: "PATCH"
      }
    )

    fetchRepos()
  }

  return (
    <div className="space-y-4">
      {repos.map((repo, index) => (
        <RepoCard repo={repo} fetchRepos={fetchRepos} key={repo.id}/>
      ))}
    </div>
  )
}