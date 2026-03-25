
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Camera, Save, Loader2 } from 'lucide-react';

export const UserProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user?.email || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    if (!user.email) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', user.id)
        .single();

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          updated_at: new Date().toISOString(),
          created_at: existingProfile ? undefined : new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Photo upload triggered');
    const file = event.target.files?.[0];
    if (!file || !user) {
      console.log('No file selected or no user');
      return;
    }

    if (!user.email) {
      console.log('No user email available');
      toast({
        title: "Error",
        description: "Email is required. Please update your email first.",
        variant: "destructive"
      });
      return;
    }

    console.log('File selected:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      console.log('File too large');
      toast({
        title: "Error",
        description: "File size must be less than 2MB. Please choose a smaller file.",
        variant: "destructive"
      });
      return;
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
      toast({
        title: "Error",
        description: "Please upload a JPG, PNG, or GIF file only.",
        variant: "destructive"
      });
      return;
    }

    setUploadLoading(true);
    try {
      console.log('Starting upload process');
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      console.log('Uploading new file:', fileName);
      
      // Upload the new file first
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, data:', uploadData);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      console.log('Public URL:', publicUrl);

      // Delete old avatar if exists
      if (profile.avatar_url) {
        console.log('Attempting to delete old avatar');
        try {
          const oldPath = new URL(profile.avatar_url).pathname;
          const oldFileName = oldPath.split('/').pop();
          if (oldFileName) {
            console.log('Deleting old file:', oldFileName);
            const { error: deleteError } = await supabase.storage
              .from('avatars')
              .remove([`${user.id}/${oldFileName}`]);
            
            if (deleteError) {
              console.warn('Failed to delete old avatar:', deleteError);
            } else {
              console.log('Successfully deleted old avatar');
            }
          }
        } catch (error) {
          console.warn('Error while trying to delete old avatar:', error);
          // Don't throw error here, just log warning
        }
      }

      // First check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', user.id)
        .single();

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          avatar_url: publicUrl,
          full_name: profile.full_name || '',
          updated_at: new Date().toISOString(),
          created_at: existingProfile ? undefined : new Date().toISOString()
        });

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw updateError;
      }

      console.log('Profile updated successfully');
      
      // Update local state
      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));

      toast({
        title: "Success",
        description: "Profile photo updated successfully"
      });
    } catch (error: any) {
      console.error('Error in photo upload:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload photo",
        variant: "destructive"
      });
    } finally {
      setUploadLoading(false);
      // Reset the file input
      const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and profile settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>
                {profile.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-col gap-1">
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadLoading}
                  onChange={handlePhotoUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  disabled={uploadLoading}
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  {uploadLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <span>{uploadLoading ? 'Uploading...' : 'Change Photo'}</span>
                </Button>
                <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
          </div>

          <Button onClick={updateProfile} disabled={loading} className="flex items-center space-x-2">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Actions</CardTitle>
          <CardDescription>
            Manage your account settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-3">
          <Button variant="outline" className="w-full md:w-auto">
            Change Password
          </Button>
          <Button variant="outline" className="w-full md:w-auto">
            Download Account Data
          </Button>
          <Button variant="destructive" className="w-full md:w-auto">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
