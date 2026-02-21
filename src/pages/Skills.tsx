import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { StarRating } from '@/components/StarRating';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, MapPin, MessageSquare, ArrowRightLeft, BadgeCheck, Crown } from 'lucide-react';
import { SKILL_CATEGORIES, SkillCategory } from '@/lib/categories';
import { useAuth } from '@/contexts/AuthContext';
import { moderateContent } from '@/lib/moderation';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface SkillWithProfile {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  is_offering: boolean;
  is_featured: boolean;
  user_id: string;
  profile: {
    full_name: string;
    avatar_url: string | null;
    location: string;
    is_verified_provider: boolean;
  } | null;
  rating?: { average_rating: number; total_reviews: number };
}

const Skills = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [skills, setSkills] = useState<SkillWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<SkillWithProfile | null>(null);
  const [exchangeMessage, setExchangeMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    // Fetch skills first
    const { data: skillsData, error } = await supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !skillsData) {
      setLoading(false);
      return;
    }

    // Get unique user IDs and fetch their profiles separately
    const userIds = [...new Set(skillsData.map(s => s.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url, location, is_verified_provider')
      .in('user_id', userIds);

    const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

    // Fetch ratings for each unique user
    const ratingResults = await Promise.all(
      userIds.map(uid => supabase.rpc('get_user_rating', { user_uuid: uid }))
    );
    const ratingMap = new Map<string, { average_rating: number; total_reviews: number }>();
    userIds.forEach((uid, i) => {
      const data = ratingResults[i].data;
      if (data && data.length > 0) {
        ratingMap.set(uid, data[0]);
      }
    });

    // Combine skills with profiles and ratings
    const skillsWithProfiles = skillsData.map(skill => ({
      ...skill,
      profile: profileMap.get(skill.user_id) || null,
      rating: ratingMap.get(skill.user_id),
    }));

    setSkills(skillsWithProfiles as SkillWithProfile[]);
    setLoading(false);
  };

  const filteredSkills = skills.filter((skill) => {
    // Don't show user's own skills
    if (user && skill.user_id === user.id) return false;

    const matchesSearch =
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'offering' && skill.is_offering) ||
      (typeFilter === 'seeking' && !skill.is_offering);

    return matchesSearch && matchesCategory && matchesType;
  });

  const handleSendExchangeRequest = async () => {
    if (!selectedSkill || !user || !exchangeMessage.trim()) {
      toast({ title: 'Please enter a message', variant: 'destructive' });
      return;
    }

    setSendingRequest(true);

    // Content moderation check
    const modResult = await moderateContent(exchangeMessage.trim());
    if (modResult.flagged) {
      toast({
        title: 'Message blocked',
        description: modResult.reason || 'Your message contains inappropriate content.',
        variant: 'destructive',
      });
      setSendingRequest(false);
      return;
    }

    const { error } = await supabase.from('exchange_requests').insert({
      requester_id: user.id,
      provider_id: selectedSkill.user_id,
      skill_id: selectedSkill.id,
      message: exchangeMessage,
    });

    if (error) {
      toast({ title: 'Error sending request', variant: 'destructive' });
    } else {
      toast({ title: 'Exchange request sent!' });
      setSelectedSkill(null);
      setExchangeMessage('');
    }
    setSendingRequest(false);
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Browse Skills</h1>
          <p className="text-muted-foreground">
            Discover skills in your community and start exchanging
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(SKILL_CATEGORIES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="offering">Offering</SelectItem>
              <SelectItem value="seeking">Seeking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length === 0 ? (
          <Card className="card-elevated">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {skills.length === 0
                  ? 'No skills have been shared yet. Be the first!'
                  : 'No skills match your search criteria.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => {
              const category = SKILL_CATEGORIES[skill.category];
              const Icon = category.icon;

              return (
                <Card key={skill.id} className={cn("card-elevated hover:scale-[1.02] transition-transform", skill.is_featured && "ring-2 ring-accent/50")}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {skill.is_featured && (
                          <Badge variant="outline" className="text-accent border-accent gap-1 text-xs">
                            <Crown className="w-3 h-3" /> Featured
                          </Badge>
                        )}
                      </div>
                      <Badge variant={skill.is_offering ? 'default' : 'outline'}>
                        {skill.is_offering ? 'Offering' : 'Seeking'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mt-3">{skill.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {skill.description}
                    </p>

                    <div className="flex items-center gap-3 pt-2 border-t border-border">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={skill.profile?.avatar_url || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {skill.profile?.full_name?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate flex items-center gap-1">
                          {skill.profile?.full_name || 'Anonymous'}
                          {skill.profile?.is_verified_provider && (
                            <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" />
                          )}
                        </p>
                        {skill.profile?.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {skill.profile.location}
                          </p>
                        )}
                      </div>
                    </div>

                    {skill.rating && skill.rating.total_reviews > 0 && (
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        <StarRating rating={Math.round(skill.rating.average_rating)} size="sm" showValue={false} />
                        <span className="text-xs text-muted-foreground">
                          {skill.rating.average_rating.toFixed(1)} ({skill.rating.total_reviews} {skill.rating.total_reviews === 1 ? 'review' : 'reviews'})
                        </span>
                      </div>
                    )}

                    {user && (
                      <Button
                        variant="secondary"
                        className="w-full gap-2"
                        onClick={() => setSelectedSkill(skill)}
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                        Request Exchange
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Exchange Request Dialog */}
        <Dialog open={!!selectedSkill} onOpenChange={(open) => !open && setSelectedSkill(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Skill Exchange</DialogTitle>
            </DialogHeader>
            {selectedSkill && (
              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="font-medium">{selectedSkill.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {selectedSkill.profile?.full_name || 'Anonymous'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Message</label>
                  <Textarea
                    value={exchangeMessage}
                    onChange={(e) => setExchangeMessage(e.target.value)}
                    placeholder="Introduce yourself and explain what you'd like to exchange..."
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleSendExchangeRequest}
                  disabled={sendingRequest}
                  className="w-full"
                >
                  {sendingRequest && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send Request
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
        <Footer />
      </div>
    </Layout>
  );
};

export default Skills;
