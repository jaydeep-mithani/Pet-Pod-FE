import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

// Profile editing moved into Settings › Profile. This redirect keeps old
// links and bookmarks working; the public profile view stays at /profile/[id].
export default function ProfileRedirectPage() {
  redirect(ROUTES.settingsProfile);
}
