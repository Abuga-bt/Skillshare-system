import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/StarRating';
import { useNavigate } from 'react-router-dom';

interface ExchangeRequest {
  id: string;
  message: string;
  status: string;
  created_at: string;
  requester_id: string;
  provider_id: string;
  skill: {
    title: string;
  } | null;
  requester: {
    full_name: string;
    avatar_url: string | null;
  } | null;
  provider: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

const Exchanges = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState<ExchangeRequest | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (user) fetchExchanges();
  }, [user]);

  const fetchExchanges = async () => {
    const { data, error } = await supabase
      .from('exchange_requests')
      .select(`
        *,
        skill:skills(title),
        requester:profiles!exchange_requests_requester_id_fkey(full_name, avatar_url),
        provider:profiles!exchange_requests_provider_id_fkey(full_name, avatar_url)
      `)
      .or(`requester_id.eq.${user!.id},provider_id.eq.${user!.id}`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setExchanges(data as unknown as ExchangeRequest[]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('exchange_requests')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating request', variant: 'destructive' });
    } else {
      toast({ title: `Request ${status}!` });
      fetchExchanges();
    }
  };

  const openReviewDialog = (exchange: ExchangeRequest) => {
    setSelectedExchange(exchange);
    setReviewDialogOpen(true);
  };

  const submitReview = async () => {
    if (!selectedExchange || !user) return;
    setSubmittingReview(true);

    const reviewedUserId =
      selectedExchange.requester_id === user.id
        ? selectedExchange.provider_id
        : selectedExchange.requester_id;

    const { error } = await supabase.from('reviews').insert({
      reviewer_id: user.id,
      reviewed_user_id: reviewedUserId,
      exchange_id: selectedExchange.id,
      rating: reviewRating,
      comment: reviewComment || null,
    });

    if (error) {
      toast({ title: 'Error submitting review', variant: 'destructive' });
    } else {
      toast({ title: 'Review submitted!' });
      setReviewDialogOpen(false);
      setSelectedExchange(null);
      setReviewRating(5);
      setReviewComment('');
    }
    setSubmittingReview(false);
  };

  const receivedExchanges = exchanges.filter((e) => e.provider_id === user?.id);
  const sentExchanges = exchanges.filter((e) => e.requester_id === user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'accepted': return 'bg-green-100 text-green-700';
      case 'declined': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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

  const ExchangeCard = ({ exchange, isReceived }: { exchange: ExchangeRequest; isReceived: boolean }) => {
    const otherPerson = isReceived ? exchange.requester : exchange.provider;
    const otherPersonId = isReceived ? exchange.requester_id : exchange.provider_id;

    return (
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={otherPerson?.avatar_url || ''} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {otherPerson?.full_name?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{otherPerson?.full_name || 'Anonymous'}</span>
                <Badge className={getStatusColor(exchange.status)}>
                  {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Skill: <span className="font-medium">{exchange.skill?.title || 'Unknown'}</span>
              </p>
              <p className="text-sm mt-2 text-foreground">{exchange.message}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(exchange.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            {isReceived && exchange.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => updateStatus(exchange.id, 'accepted')}
                  className="gap-1"
                >
                  <Check className="w-4 h-4" /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => updateStatus(exchange.id, 'declined')}
                  className="gap-1"
                >
                  <X className="w-4 h-4" /> Decline
                </Button>
              </>
            )}
            {exchange.status === 'accepted' && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate(`/messages?user=${otherPersonId}`)}
                  className="gap-1"
                >
                  <MessageSquare className="w-4 h-4" /> Message
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateStatus(exchange.id, 'completed')}
                  className="gap-1"
                >
                  Mark Complete
                </Button>
              </>
            )}
            {exchange.status === 'completed' && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => openReviewDialog(exchange)}
                className="gap-1"
              >
                <Star className="w-4 h-4" /> Leave Review
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold mb-8">Exchange Requests</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="received">
              Received ({receivedExchanges.length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent ({sentExchanges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            {receivedExchanges.length === 0 ? (
              <Card className="card-elevated">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No exchange requests received yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {receivedExchanges.map((exchange) => (
                  <ExchangeCard key={exchange.id} exchange={exchange} isReceived />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent">
            {sentExchanges.length === 0 ? (
              <Card className="card-elevated">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">You haven't sent any exchange requests yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sentExchanges.map((exchange) => (
                  <ExchangeCard key={exchange.id} exchange={exchange} isReceived={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leave a Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rating</label>
                <StarRating
                  rating={reviewRating}
                  size="lg"
                  interactive
                  onRatingChange={setReviewRating}
                  showValue={false}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Comment (optional)</label>
                <Textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience..."
                  rows={3}
                />
              </div>
              <Button
                onClick={submitReview}
                disabled={submittingReview}
                className="w-full"
              >
                {submittingReview && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Exchanges;
