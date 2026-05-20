import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const repos = await prisma.repo.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })

  return NextResponse.json(repos)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const githubUrl = body.url

  const trackedLabels =
    body.trackedLabels || []

  const split = githubUrl
    .replace("https://github.com/", "")
    .split("/")

  const owner = split[0]
  const repo = split[1]

  const existing =
    await prisma.repo.findUnique({
      where: {
        fullName: `${owner}/${repo}`
      }
    })

  if (existing) {
    return NextResponse.json(existing)
  }

  const created =
    await prisma.repo.create({
      data: {
        owner,
        name: repo,
        fullName: `${owner}/${repo}`,
        trackedLabels
      }
    })

  return NextResponse.json(created)
}