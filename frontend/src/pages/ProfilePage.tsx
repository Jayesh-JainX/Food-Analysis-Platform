import { UserProfile } from "@/components/profile/UserProfile";
import { SEO } from "@/components/shared/SEO";

export default function ProfilePage() {
  return (
    <>
      <SEO
        title="Profile"
        description="Manage your Wellness AI Lens profile, preferences, and personalize your food analysis experience. View your scan history and nutrition tracking data."
        keywords="user profile, account settings, food preferences, nutrition history, wellness tracking, health profile, dietary preferences"
      />
      <UserProfile />
    </>
  );
}
