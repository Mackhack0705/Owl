import { PrismaClient } from "@prisma/client"
import { findLinkedPr } from "./github.js"

const prisma = new PrismaClient()

async function fetchIssues(owner: string, repo: string) {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?sort=created&direction=desc&per_page=10`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json"
      }
    }
  )

  return response.json()
}

async function sendTelegramMessage(message: string) {
  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML"
      })
    }
  )
}

export async function pollRepositories() {
  const repos = await prisma.repo.findMany({
    where: {
      active: true
    }
  })

  for (const repo of repos) {
    console.log(`Checking repo: ${repo.fullName}`)

    const issues = await fetchIssues(
      repo.owner,
      repo.name
    )

    console.log(
      `Fetched ${issues.length} issues`
    )

    for (const issue of issues) {
      if (issue.pull_request) continue

      const issueLabels =
        issue.labels.map(
          (label: any) => label.name
        )

      const shouldTrack =
        repo.trackedLabels.length === 0 ||
        repo.trackedLabels.some(
          (trackedLabel) =>
            issueLabels.includes(
              trackedLabel
            )
        )

      if (!shouldTrack) {
        console.log(
          `Skipping issue due to label filter`
        )

        continue
      }

      console.log(
        `Processing issue: ${issue.title}`
      )

      const exists =
        await prisma.issue.findUnique({
          where: {
            githubIssueId: BigInt(issue.id)
          }
        })

      if (exists) {
        console.log("Issue already exists")
        continue
      }

      const linkedPr = await findLinkedPr(
        repo.owner,
        repo.name,
        issue.number
      )

      const issueCreatedAt = new Date(issue.created_at)
      const now = new Date()

      const diffMinutes =
        (now.getTime() - issueCreatedAt.getTime()) /
        1000 /
        60

      if (diffMinutes > 10) {
        console.log(
          "Skipping old issue notification"
        )

        continue
      }

      console.log("Creating issue")

      await prisma.issue.create({
        data: {
          githubIssueId: BigInt(issue.id),
          title: issue.title,
          url: issue.html_url,
          issueNumber: issue.number,
          author: issue.user.login,
          labels: issue.labels.map(
            (l: any) => l.name
          ),
          hasLinkedPr: !!linkedPr,
          linkedPrUrl: linkedPr?.html_url || null,
          linkedPrState: linkedPr?.state || null,
          repoId: repo.id,
          createdAt: new Date(
            issue.created_at
          )
        }
      })

      const labels =
        issue.labels
          .map(
            (label: any) => label.name
          )
          .join(" • ")

      const createdAt =
        new Date(
          issue.created_at
        ).toLocaleString()

      const message = `
      🚨 <b>New Open Source Issue</b>

      📦 <b>Repo:</b>
      ${repo.fullName}

      🏷 <b>Labels:</b>
      ${labels || "No labels"}

      📝 <b>Title:</b>
      ${issue.title}

      👤 <b>Author:</b>
      ${issue.user.login}

      💬 <b>Comments:</b>
      ${issue.comments}

      🔗 <a href="${issue.html_url}">
        Open Issue
      </a>

      ⏰ <b>Created:</b>
      ${createdAt}
      `

      console.log(
        "Sending Telegram notification"
      )

      await sendTelegramMessage(message)

    }
  }
}