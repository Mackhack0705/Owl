import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const issues = await prisma.issue.findMany({
    orderBy: {
      createdAt: "desc"
    },
    take: 50,
    include: {
      repo: true
    }
  })
  const serializedIssues = issues.map(
    (issue) => ({
      ...issue,
      githubIssueId:
        issue.githubIssueId.toString()
    })
  )

  return NextResponse.json(serializedIssues)
}