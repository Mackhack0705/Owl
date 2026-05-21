import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _: Request,
  {
    params
  }: {
    params: Promise<{ id: string }>
  }
) {
  const { id } = await params

  await prisma.repo.delete({
    where: {
      id
    }
  })

  return NextResponse.json({
    success: true
  })
}

export async function PATCH(
  req: Request,
  {
    params
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  const { id } = await params

  const body =
    await req.json()

  const updated =
    await prisma.repo.update({
      where: {
        id
      },
      data: {
        trackedLabels:
          body.trackedLabels
      }
    })

  return NextResponse.json(
    updated
  )
}