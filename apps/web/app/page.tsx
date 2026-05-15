import { AddRepoForm } from "@/components/add-repo-form"
import { BackgroundGlow } from "@/components/background-glow"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { IssueFeed } from "@/components/issue-feed"
import { RepoList } from "@/components/repo-list"
import { StatsCards } from "@/components/stats-cards"

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <BackgroundGlow />

      <DashboardNavbar />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
            Track Open Source
            <span className="block bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
              Issues In Realtime
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-zinc-400">
            Monitor GitHub repositories and receive Telegram notifications instantly whenever new issues are created.
          </p>
        </div>

        <div className="mt-10">
          <AddRepoForm />
        </div>

        <div className="mt-10">
          <StatsCards />
        </div>

        <div className="mt-12 grid gap-8 xl:grid-cols-[400px_1fr]">
          <div>
            <h2 className="mb-5 text-2xl font-semibold">
              Tracked Repositories
            </h2>

            <RepoList />
          </div>

          <div>
            <h2 className="mb-5 text-2xl font-semibold">
              Latest Issues
            </h2>

            <IssueFeed />
          </div>
        </div>
      </div>
    </main>
  )
}