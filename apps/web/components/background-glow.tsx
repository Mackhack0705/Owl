export function BackgroundGlow() {
  return (
    <>
      <div className="fixed left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-500/20 blur-[120px]" />

      <div className="fixed bottom-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px]" />
    </>
  )
}