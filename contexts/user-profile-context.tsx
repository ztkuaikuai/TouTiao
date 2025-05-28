"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@/hooks/use-user';
import { createClient } from '@/utils/supabase/client';
// import type { User } from '@supabase/auth-helpers-nextjs'; // Temporarily removed

// 与 user-profile-section.tsx 中类似的接口定义
export interface UserProfile {
  id: number;
  created_at: string;
  user_id: string;
  avatar_url?: string | null;
  name?: string | null;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  loadingProfile: boolean;
  updateProfileName: (newName: string) => Promise<{ success: boolean; error?: any }>;
  // 如果需要，可以添加一个 refetchProfile 函数
  // refetchProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser] = useUser(); // authUser type is inferred from useUser hook
  const supabase = createClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchAndInitializeProfile = async () => {
      if (!authUser || !authUser.id) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);
      try {
        const { data: existingProfile, error: fetchError } = await supabase
          .from('user-profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116: No rows found
          console.error('Error fetching user profile:', fetchError.message);
          setProfile(null);
          // setLoadingProfile(false) is in finally
          return;
        }

        if (existingProfile) {
          setProfile(existingProfile as UserProfile);
        } else {
          const defaultName = authUser.email?.split('@')[0] || `user-${authUser.id.substring(0, 6)}`;
          const { data: newProfileData, error: insertError } = await supabase
            .from('user-profiles')
            .insert([{ user_id: authUser.id, name: defaultName }])
            .select('*')
            .single();

          if (insertError) {
            console.error('Error initializing user profile:', insertError.message);
            setProfile(null);
          } else if (newProfileData) {
            setProfile(newProfileData as UserProfile);
          }
        }
      } catch (error) {
        console.error("An unexpected error occurred while fetching/initializing profile:", error);
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchAndInitializeProfile();
  }, [authUser, supabase]);

  const updateProfileName = async (newName: string): Promise<{ success: boolean; error?: any }> => {
    if (!authUser || !authUser.id || !profile || !newName.trim()) {
      return { success: false, error: new Error("User not authenticated, profile not loaded, or new name is empty.") };
    }
    if (newName.trim() === profile.name) {
        return { success: true }; // No change needed
    }

    setLoadingProfile(true); // Indicate loading state for profile update
    try {
      const { data: updatedProfile, error } = await supabase
        .from('user-profiles')
        .update({ name: newName.trim() })
        .eq('user_id', authUser.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating name in context:', error.message);
        return { success: false, error };
      } else if (updatedProfile) {
        setProfile(updatedProfile as UserProfile);
        return { success: true };
      }
      return { success: false, error: new Error("Update did not return a profile.") }; // Should not happen
    } catch (error) {
      console.error('Unexpected error updating name in context:', error);
      return { success: false, error };
    } finally {
      setLoadingProfile(false);
    }
  };
  
  // Optional: refetchProfile function if needed later
  // const refetchProfile = async () => { ... same logic as in useEffect ... }

  return (
    <UserProfileContext.Provider value={{ profile, loadingProfile, updateProfileName }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}; 