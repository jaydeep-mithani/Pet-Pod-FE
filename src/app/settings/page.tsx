import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

// /settings itself has no content — the Profile tab is the canonical landing.
export default function SettingsIndexPage() {
  redirect(ROUTES.settingsProfile);
}
