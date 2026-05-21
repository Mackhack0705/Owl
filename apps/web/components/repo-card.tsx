"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Pause,
  Play,
  Trash2,
  Settings2
} from "lucide-react"

import {
  Card,
  CardContent
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

type Repo = {
  id: string
  fullName: string
  active: boolean
  trackedLabels: string[]
}

type RepoCardProps = {
  repo: Repo
  fetchRepos: () => void
}

export function RepoCard({
  repo,
  fetchRepos
}: RepoCardProps) {
  const [
    availableLabels,
    setAvailableLabels
  ] = useState<string[]>([])

  const [
    selectedLabels,
    setSelectedLabels
  ] = useState<string[]>(
    repo.trackedLabels || []
  )

  const [
    configuring,
    setConfiguring
  ] = useState(false)

  const [loading, setLoading] =
    useState(false)

  async function toggleRepo(
    id: string
  ) {
    try {
      await fetch(
        `/api/repos/${id}/toggle`,
        {
          method: "PATCH"
        }
      )

      fetchRepos()
    } catch (error) {
      console.error(error)
    }
  }

  async function deleteRepo(
    id: string
  ) {
    try {
      await fetch(
        `/api/repos/${id}`,
        {
          method: "DELETE"
        }
      )

      fetchRepos()
    } catch (error) {
      console.error(error)
    }
  }

  async function fetchLabels() {
    try {
      setLoading(true)

      const response =
        await fetch(
          `/api/repos/${repo.id}/labels`
        )

      const data =
        await response.json()

      setAvailableLabels(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function saveLabels() {
    try {
      setLoading(true)

      await fetch(
        `/api/repos/${repo.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            trackedLabels:
              selectedLabels
          })
        }
      )

      fetchRepos()

      setConfiguring(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function openLabels() {
    setConfiguring(true)

    if (
      availableLabels.length === 0
    ) {
      await fetchLabels()
    }
  }

  useEffect(() => {
    setSelectedLabels(
      repo.trackedLabels || []
    )
  }, [repo.trackedLabels])

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{
        opacity: 0,
        y: -20
      }}
    >
      <Card
        className={`
          group
          border-zinc-800
          bg-zinc-900/60
          backdrop-blur
          transition
          ${
            repo.active
              ? "opacity-100"
              : "opacity-60"
          }
        `}
      >
        <CardContent className="space-y-4 p-5">
          {/* TOP SECTION */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                {repo.fullName}
              </h3>

              <Badge
                className={
                  repo.active
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }
              >
                {repo.active
                  ? "Active"
                  : "Paused"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  toggleRepo(repo.id)
                }
              >
                {repo.active ? (
                  <Pause className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Play className="h-4 w-4 text-emerald-400" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  deleteRepo(repo.id)
                }
                className="
                  opacity-0
                  transition
                  group-hover:opacity-100
                "
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          </div>

          {/* TRACKED LABELS */}
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Tracking Labels
            </p>

            <div className="flex flex-wrap gap-2">
              {repo.trackedLabels
                ?.length > 0 ? (
                repo.trackedLabels.map(
                  (
                    label: string
                  ) => (
                    <Badge
                      key={label}
                      variant="secondary"
                      className="
                        border-zinc-700
                        bg-zinc-800
                        text-zinc-200
                      "
                    >
                      {label}
                    </Badge>
                  )
                )
              ) : (
                <p className="text-sm text-zinc-500">
                  Tracking all
                  issues
                </p>
              )}
            </div>
          </div>

          {/* CONFIGURE BUTTON */}
          <Button
            variant="outline"
            className="
              w-full
              border-zinc-700
              bg-black
              text-white
              hover:bg-zinc-800
            "
            onClick={openLabels}
          >
            <Settings2 className="mr-2 h-4 w-4" />

            Configure Labels
          </Button>

          {/* LABEL CONFIG PANEL */}
          {configuring && (
            <div className="space-y-4 rounded-xl border border-zinc-800 bg-black/50 p-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">
                  Select labels to
                  track
                </h4>

                {loading && (
                  <p className="text-xs text-zinc-500">
                    Loading...
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {availableLabels.map(
                  (label) => {
                    const selected =
                      selectedLabels.includes(
                        label
                      )

                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setSelectedLabels(
                            (
                              prev
                            ) =>
                              selected
                                ? prev.filter(
                                    (
                                      l
                                    ) =>
                                      l !==
                                      label
                                  )
                                : [
                                    ...prev,
                                    label
                                  ]
                          )
                        }}
                        className={`
                          rounded-full
                          border
                          px-3
                          py-1
                          text-sm
                          transition
                          ${
                            selected
                              ? "bg-white text-black"
                              : "border-zinc-700 bg-zinc-900 text-white"
                          }
                        `}
                      >
                        {label}
                      </button>
                    )
                  }
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={saveLabels}
                  disabled={loading}
                  className="
                    flex-1
                    bg-white
                    text-black
                    hover:bg-zinc-200
                  "
                >
                  Save Filters
                </Button>

                <Button
                  variant="outline"
                  onClick={() =>
                    setConfiguring(
                      false
                    )
                  }
                  className="
                    border-zinc-700
                    bg-transparent
                    text-white
                  "
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}