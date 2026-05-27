import Link from "next/link";
import { Heart } from "lucide-react";
import Button from "../ui/Button";
import ScrollReveal from "../ui/ScrollReveal";
import { ROUTES } from "@/lib/routes";

const FinalCTASection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25) 0, transparent 40%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.18) 0, transparent 35%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center text-white sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            One conversation could change a life.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            Whether you have love to give or a pet who needs a new home, you
            belong here.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href={ROUTES.signup} className="w-full sm:w-auto">
              <Button
                variant="floating"
                size="lg"
                icon={<Heart className="h-5 w-5" />}
                className="w-full sm:w-auto sm:min-w-[200px]"
              >
                Join Pet Pod
              </Button>
            </Link>
            <Link href={ROUTES.pets} className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full bg-white/10 text-white hover:bg-white/20 sm:w-auto sm:min-w-[200px]"
              >
                Browse pets first
              </Button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FinalCTASection;
