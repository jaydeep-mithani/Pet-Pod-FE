export default function Home() {
  return (
    <div className="flex items-center justify-center flex-col gap-4 h-screen">
      <h6 className="text-2xl font-black">Code Name</h6>
      <h1
        className="text-9xl font-bold animate-ping"
        style={{ animationDuration: "3s" }}
      >
        Pet Pod
      </h1>
      <h3 className="text-5xl animate-pulse">Coming Soon...</h3>
    </div>
  );
}
