import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '@/components/StarRating';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MapPin, Mail, Phone, Plus, Trash2, Edit2 } from 'lucide-react';
import { SKILL_CATEGORIES, SkillCategory } from '@/lib/categories';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string;
  location: string;
  phone: string | null;
}

interface Skill {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  is_offering: boolean;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: { full_name: string } | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState({
    title: '',
    description: '',
    category: 'other' as SkillCategory,
    is_offering: true,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSkills();
      fetchReviews();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user!.id)
      .maybeSingle();

    if (error) {
      toast({ title: 'Error loading profile', variant: 'destructive' });
    } else if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchSkills = async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', user!.id);

    if (!error && data) {
      setSkills(data as Skill[]);
    }
  };

  const fetchReviews = async () => {
    // Only select non-sensitive reviewer columns (excluding phone)
    const { data: reviewsData, error } = await supabase
      .from('reviews')
      .select(`
        id, rating, comment, created_at,
        reviewer:profiles!reviews_reviewer_id_fkey(full_name)
      `)
      .eq('reviewed_user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && reviewsData) {
      setReviews(reviewsData as unknown as Review[]);
    }

    // Get average rating
    const { data: ratingData } = await supabase
      .rpc('get_user_rating', { user_uuid: user!.id });

    if (ratingData && ratingData.length > 0) {
      setAverageRating(Number(ratingData[0].average_rating) || 0);
      setTotalReviews(Number(ratingData[0].total_reviews) || 0);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        location: profile.location,
        phone: profile.phone,
      })
      .eq('user_id', user!.id);

    if (error) {
      toast({ title: 'Error saving profile', variant: 'destructive' });
    } else {
      toast({ title: 'Profile saved successfully!' });
    }
    setSaving(false);
  };

  const handleSaveSkill = async () => {
    if (!newSkill.title || !newSkill.description) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    if (editingSkill) {
      const { error } = await supabase
        .from('skills')
        .update(newSkill)
        .eq('id', editingSkill.id);

      if (!error) {
        toast({ title: 'Skill updated!' });
        fetchSkills();
      }
    } else {
      const { error } = await supabase
        .from('skills')
        .insert({ ...newSkill, user_id: user!.id });

      if (!error) {
        toast({ title: 'Skill added!' });
        fetchSkills();
      }
    }

    setSkillDialogOpen(false);
    setEditingSkill(null);
    setNewSkill({ title: '', description: '', category: 'other', is_offering: true });
  };

  const handleDeleteSkill = async (skillId: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', skillId);
    if (!error) {
      toast({ title: 'Skill removed' });
      fetchSkills();
    }
  };

  const openEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setNewSkill({
      title: skill.title,
      description: skill.description,
      category: skill.category,
      is_offering: skill.is_offering,
    });
    setSkillDialogOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">My Profile</h1>

        <div className="grid gap-6">
          {/* Profile Card */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Profile Details</span>
                <div className="flex items-center gap-2">
                  <StarRating rating={averageRating} size="md" />
                  <span className="text-sm text-muted-foreground">({totalReviews} reviews)</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar_url || ''} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                    placeholder="Your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile?.bio || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                    placeholder="Tell the community about yourself..."
                    rows={4}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Location
                    </Label>
                    <Input
                      id="location"
                      value={profile?.location || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, location: e.target.value } : null)}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Phone
                    </Label>
                    <Input
                      id="phone"
                      value={profile?.phone || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveProfile} disabled={saving} className="w-full sm:w-auto">
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className="card-elevated">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>My Skills</span>
                <Dialog open={skillDialogOpen} onOpenChange={(open) => {
                  setSkillDialogOpen(open);
                  if (!open) {
                    setEditingSkill(null);
                    setNewSkill({ title: '', description: '', category: 'other', is_offering: true });
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" /> Add Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Skill Title</Label>
                        <Input
                          value={newSkill.title}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Web Development"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={newSkill.description}
                          onChange={(e) => setNewSkill(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe your skill and experience..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={newSkill.category}
                          onValueChange={(value) => setNewSkill(prev => ({ ...prev, category: value as SkillCategory }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(SKILL_CATEGORIES).map(([key, { label }]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={newSkill.is_offering ? 'offering' : 'seeking'}
                          onValueChange={(value) => setNewSkill(prev => ({ ...prev, is_offering: value === 'offering' }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="offering">I can offer this skill</SelectItem>
                            <SelectItem value="seeking">I'm looking for this skill</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleSaveSkill} className="w-full">
                        {editingSkill ? 'Update Skill' : 'Add Skill'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No skills added yet. Add your first skill to start sharing!
                </p>
              ) : (
                <div className="grid gap-3">
                  {skills.map((skill) => {
                    const category = SKILL_CATEGORIES[skill.category];
                    const Icon = category.icon;
                    return (
                      <div
                        key={skill.id}
                        className="flex items-start justify-between p-4 rounded-lg bg-secondary/50 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{skill.title}</h4>
                              <Badge variant={skill.is_offering ? 'default' : 'outline'} className="text-xs">
                                {skill.is_offering ? 'Offering' : 'Seeking'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{skill.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditSkill(skill)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDeleteSkill(skill.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews Card */}
          {reviews.length > 0 && (
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-lg bg-secondary/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{review.reviewer?.full_name || 'Anonymous'}</span>
                        <StarRating rating={review.rating} size="sm" showValue={false} />
                      </div>
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
