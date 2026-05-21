import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  _: Request,
  {
    params
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  const { id } = await params

  const issues =
    await prisma.issue.findMany({
      where: {
        repoId: id
      }
    })

  const labelsSet =
    new Set<string>()

  issues.forEach((issue) => {
    issue.labels.forEach(
      (label) => {
        labelsSet.add(label)
      }
    )
  })

  return NextResponse.json(
    Array.from(labelsSet)
  )
}