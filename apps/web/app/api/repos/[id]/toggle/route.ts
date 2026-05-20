import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  _: Request,
  {
    params
  }: {
    params: Promise<{ id: string }>
  }
) {
  const { id } = await params

  const repo = await prisma.repo.findUnique({
    where: {
      id
    }
  })

  if (!repo) {
    return NextResponse.json(
      { error: "Repo not found" },
      { status: 404 }
    )
  }

  const updatedRepo =
    await prisma.repo.update({
      where: {
        id
      },
      data: {
        active: !repo.active
      }
    })

  return NextResponse.json(
    updatedRepo
  )
}