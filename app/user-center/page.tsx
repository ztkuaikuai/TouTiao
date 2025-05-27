import UserCenterHeader from "@/components/user-center-header"
import UserProfileSection from "@/components/user-profile-section"
import UserContentTabs from "@/components/user-content-tabs"

export default function UserCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserCenterHeader />
      <UserProfileSection />
      <UserContentTabs />
    </div>
  )
}
