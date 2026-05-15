import { PrismaClient } from "@prisma/client"

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
        text: message
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
          repoId: repo.id,
          createdAt: new Date(
            issue.created_at
          )
        }
      })

      console.log(
        "Sending Telegram notification"
      )

      await sendTelegramMessage(
        `🚨 New Issue\n\nRepo: ${repo.fullName}\nIssue: ${issue.title}\n${issue.html_url}`
      )
    }
  }
}