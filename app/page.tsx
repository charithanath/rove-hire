import { redirect } from "next/navigation";

// Root route — redirect to the dashboard.
// The HR layout guard will redirect to /login if not authenticated.
export default function RootPage() {
  redirect("/dashboard");
}
