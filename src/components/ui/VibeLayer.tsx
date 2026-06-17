"use client";

import { usePathname } from "next/navigation";
import ScrollTracker from "./ScrollTracker";
import VibeEffectsLayer from "./VibeEffectsLayer";
import VibeFab from "./VibeFab";
import { NAVBAR_HIDDEN_ROUTES, ROUTES } from "@/lib/routes";

/**
 * Mounts the vibe-system chrome (scroll tracker, reactive effects, floating
 * vibe switcher) on content pages. Auth/onboarding pages stay clean, and the
 * FAB additionally yields on chat pages so it never covers the composer on
 * mobile.
 */
const VibeLayer: React.FC = () => {
  const pathname = usePathname();

  const hidden = (NAVBAR_HIDDEN_ROUTES as readonly string[]).includes(pathname);
  if (hidden) return null;

  const onChat = pathname.startsWith(ROUTES.chat);

  return (
    <>
      <ScrollTracker />
      <VibeEffectsLayer />
      {!onChat && <VibeFab />}
    </>
  );
};

export default VibeLayer;
