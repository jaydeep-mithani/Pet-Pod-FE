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
      <p className="max-w-4xl text-center">
        A community-driven platform dedicated to giving pets a second chance at
        life. We connect loving animals with responsible, caring owners —
        creating lasting bonds while helping reduce pet abandonment. We are
        working hard to bring this project to life as soon as possible, and we
        truely appreciate your patience. Thanks for visiting petpod, please
        visit regulary for any updates if you are interested in staying tuned
        and following our project.
      </p>
    </div>
  );
}
