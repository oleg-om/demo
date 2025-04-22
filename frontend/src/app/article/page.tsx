import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default async function AuthorHomePage() {
  redirect(ROUTES.HOME);
}
