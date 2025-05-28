"use client"

import { useState, useEffect } from "react";
import { useUser } from "@/hooks/use-user";
import { useUserProfile } from "@/contexts/user-profile-context";
import { ChevronRight, Edit3, Save, X } from "lucide-react";

export default function UserProfileSection() {
  const [authUser] = useUser();
  const { profile, loadingProfile, updateProfileName } = useUserProfile();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameUpdateLoading, setNameUpdateLoading] = useState(false);

  useEffect(() => {
    if (profile?.name) {
      setNewName(profile.name);
    }
  }, [profile?.name]);

  const handleEditName = () => {
    setIsEditingName(true);
    setNewName(profile?.name || "");
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    if (profile?.name) setNewName(profile.name);
  };

  const handleSaveName = async () => {
    if (!authUser || !profile || !newName.trim() || newName.trim() === profile.name) {
      setIsEditingName(false);
      return;
    }
    setNameUpdateLoading(true);
    const { success, error } = await updateProfileName(newName.trim());
    setNameUpdateLoading(false);

    if (success) {
      setIsEditingName(false);
    } else {
      console.error("Error updating name via context:", error?.message);
      if (profile?.name) setNewName(profile.name);
    }
  };

  if (loadingProfile && authUser) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          正在加载您的个人信息...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {authUser && profile ? (
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="User avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl">🐧</div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                {isEditingName ? (
                  <>
                    <input 
                      type="text" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-2xl font-bold text-gray-900 border-b-2 border-gray-300 focus:border-blue-500 outline-none flex-grow"
                      disabled={nameUpdateLoading}
                    />
                    <button 
                      onClick={handleSaveName} 
                      disabled={nameUpdateLoading || !newName.trim() || (profile !== null && newName.trim() === profile.name)}
                      className="p-1 text-green-500 hover:text-green-700 disabled:opacity-50"
                    >
                      {nameUpdateLoading ? <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div> : <Save size={20} />}
                    </button>
                    <button onClick={handleCancelEditName} disabled={nameUpdateLoading} className="p-1 text-red-500 hover:text-red-700 disabled:opacity-50">
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-gray-900">{profile?.name || authUser?.email?.split('@')[0] || '用户'}</h1>
                    <button onClick={handleEditName} className="p-1 text-gray-500 hover:text-gray-700" disabled={nameUpdateLoading}>
                      <Edit3 size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-500">获赞</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-500">粉丝</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-500">关注</div>
                </div>
              </div>

              {/* More Info Link */}
              <button className="flex items-center text-gray-500 hover:text-gray-700 text-sm">
                更多信息
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        ) : authUser && !profile && !loadingProfile ? (
          <div className="text-center text-gray-600">
            未能加载您的个人信息。请稍后重试。
          </div>
        ) : !authUser && !loadingProfile ? (
          <div className="text-center text-gray-500">
            请先<a href="/login" className="text-blue-500 hover:underline">登录</a>以查看您的个人资料。
          </div>
        ) : null}
      </div>
    </div>
  );
}
