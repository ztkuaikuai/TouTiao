"use client"

import { useState, useEffect, useRef } from "react";
import { useUser } from "@/hooks/use-user";
import { useUserProfile } from "@/contexts/user-profile-context";
import { ChevronRight, Edit3, Save, X, Camera } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import Followers from "./follow/followers";
import Following from "./follow/following";

export default function UserProfileSection() {
  const params = useParams();
  const userIdFromParams = params?.['user-id'] as string | undefined;

  const [authUser] = useUser();
  const { profile, loadingProfile, updateProfileName, updateProfileAvatar } = useUserProfile();
  const supabase = createClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // 新增：用于存储通过 user-id 查询到的 profile
  const [externalProfile, setExternalProfile] = useState<any>(null);
  const [loadingExternalProfile, setLoadingExternalProfile] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [nameUpdateLoading, setNameUpdateLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // 通过 user-id 查询外部用户 profile
  useEffect(() => {
    if (userIdFromParams) {
      setLoadingExternalProfile(true);
      supabase
        .from('user-profiles')
        .select('*')
        .eq('user_id', userIdFromParams)
        .single()
        .then(({ data, error }) => {
          setExternalProfile(data || null);
          setLoadingExternalProfile(false);
        });
    } else {
      setExternalProfile(null);
    }
  }, [userIdFromParams]);

  // 姓名编辑逻辑，兼容外部 profile
  useEffect(() => {
    if (userIdFromParams) {
      setNewName(externalProfile?.name || "");
    } else if (profile?.name) {
      setNewName(profile.name);
    }
  }, [profile?.name, externalProfile?.name, userIdFromParams]);

  const handleEditName = () => {
    setIsEditingName(true);
    setNewName(userIdFromParams ? (externalProfile?.name || "") : (profile?.name || ""));
  };

  const handleCancelEditName = () => {
    setIsEditingName(false);
    setNewName(userIdFromParams ? (externalProfile?.name || "") : (profile?.name || ""));
  };

  // 仅允许当前用户编辑自己的信息
  const handleSaveName = async () => {
    if (userIdFromParams || !authUser || !profile || !newName.trim() || newName.trim() === profile.name) {
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

  // 仅允许当前用户编辑自己的头像
  const handleAvatarClick = () => {
    if (avatarUploading || userIdFromParams) return;
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !authUser || !profile) {
      return;
    }

    setAvatarUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `user-avatars/${authUser.id}/avatar.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from('toutiao-bucket')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      if (!data || !data.path) {
        throw new Error("File uploaded successfully but path was not returned.");
      }

      const { data: publicURLData } = supabase.storage
        .from('toutiao-bucket')
        .getPublicUrl(data.path);

      if (publicURLData && publicURLData.publicUrl) {
        const { success, error: updateError } = await updateProfileAvatar(publicURLData.publicUrl);
        if (!success || updateError) {
          console.error("Error updating avatar URL in profile:", updateError?.message);
        }
      } else {
        console.error("Could not get public URL for avatar. publicURLData:", publicURLData);
        throw new Error("Could not get public URL for avatar.");
      }

    } catch (error: any) {
      console.error("Error uploading avatar:", error.message);
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    }
  };

  // 加载中
  if ((userIdFromParams && loadingExternalProfile) || (!userIdFromParams && loadingProfile && authUser)) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          正在加载用户信息...
        </div>
      </div>
    );
  }

  // 未找到用户
  if (userIdFromParams && !loadingExternalProfile && !externalProfile) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          未找到该用户。
        </div>
      </div>
    );
  }

  // 展示外部用户信息
  if (userIdFromParams && externalProfile) {
    return (
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden relative">
                {externalProfile.avatar_url ? (
                  <img src={externalProfile.avatar_url} alt="User avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl">🐧</div>
                )}
              </div>
            </div>
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{externalProfile.name || '用户'}</h1>
              </div>
              <div className="flex items-center space-x-8 mb-4">
                <Followers userId={userIdFromParams} />
                <Following userId={userIdFromParams} />
              </div>
              <button className="flex items-center text-gray-500 hover:text-gray-700 text-sm">
                更多信息
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 展示当前登录用户信息
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {authUser && profile ? (
          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div 
              className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer group"
              onClick={handleAvatarClick}
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden relative">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="User avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl">🐧</div>
                )}
                {!avatarUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-opacity duration-200">
                    <Camera size={24} className="text-white opacity-0 group-hover:opacity-100" />
                  </div>
                )}
                 {avatarUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={avatarInputRef} 
                onChange={handleAvatarFileChange} 
                accept="image/png, image/jpeg, image/gif" 
                className="hidden"
                disabled={avatarUploading}
              />
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
                <Followers userId={authUser.id} />
                <Following userId={authUser.id} />
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
