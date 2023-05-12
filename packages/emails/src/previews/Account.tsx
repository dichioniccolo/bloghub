import { default as LoginLinkEmail } from "../LoginLink";
import { default as ProjectInviteEmail } from "../ProjectInvite";
import { default as WelcomeEmailChild } from "../WelcomeEmail";

export function LoginLink() {
  return <LoginLinkEmail url="thelink" />;
}

export function ProjectInvite() {
  return <ProjectInviteEmail url="thelink" projectName="Vercel" />;
}

export function WelcomeEmail() {
  return <WelcomeEmailChild email="youremail@gmail.com" />;
}
