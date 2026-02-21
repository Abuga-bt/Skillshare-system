import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Search, 
  ArrowRightLeft, 
  MessageSquare, 
  Star, 
  Sparkles,
  Shield,
  Heart,
  Zap,
  Globe,
  ChevronRight
} from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ skills: 0, members: 0, exchanges: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [skillsRes, profilesRes, exchangesRes] = await Promise.all([
        supabase.from('skills').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('exchange_requests').select('id', { count: 'exact', head: true }),
      ]);
      setStats({
        skills: skillsRes.count ?? 0,
        members: profilesRes.count ?? 0,
        exchanges: exchangesRes.count ?? 0,
      });
    };
    fetchStats();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center px-4 overflow-hidden gradient-hero py-12">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-accent rounded-full animate-float" />
        <div className="absolute top-2/3 left-1/4 w-2 h-2 bg-primary rounded-full animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-5 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            Community-Powered Skill Exchange
          </div>
          
          <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4 animate-slide-up leading-tight">
            Share What You Know,
            <br />
            <span className="text-gradient">Learn What You Need</span>
          </h1>
          
          <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Connect with neighbors, exchange skills, and build a stronger community through collaborative learning and mutual support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {user ? (
              <>
                <Link to="/skills">
                  <Button size="sm" className="gap-2 w-full sm:w-auto h-10 px-6 text-sm rounded-xl btn-glow">
                    <Search className="w-4 h-4" /> Explore Skills
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button size="sm" variant="outline" className="gap-2 w-full sm:w-auto h-10 px-6 text-sm rounded-xl border-2">
                    Share Your Skills <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="sm" className="gap-2 h-10 px-6 text-sm rounded-xl btn-glow">
                    Get Started Free <Zap className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/skills">
                  <Button size="sm" variant="outline" className="gap-2 h-10 px-6 text-sm rounded-xl border-2">
                    Browse Skills
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-8 max-w-sm mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {[
              { value: `${stats.skills}+`, label: 'Skills Shared' },
              { value: `${stats.members}`, label: 'Community Members' },
              { value: `${stats.exchanges}`, label: 'Exchanges Made' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-xl md:text-2xl font-display font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">How It Works</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Get started in minutes and connect with skilled neighbors
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { 
                icon: Users, 
                title: 'Create Your Profile', 
                desc: 'List your skills, expertise, and what you want to learn.',
                step: '01'
              },
              { 
                icon: Search, 
                title: 'Find & Connect', 
                desc: 'Browse skills, filter by category, and connect with members.',
                step: '02'
              },
              { 
                icon: ArrowRightLeft, 
                title: 'Exchange & Grow', 
                desc: 'Request exchanges, message providers, and build connections.',
                step: '03'
              },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="relative p-5 rounded-2xl bg-card card-modern animate-slide-up group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="absolute top-4 right-4 text-4xl font-display font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {feature.step}
                </span>
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="text-base font-display font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
              Why Choose Us
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">Built for Community</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Every feature designed to strengthen local connections
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: 'Trusted Network', desc: 'Verified profiles and rating system' },
              { icon: MessageSquare, title: 'Direct Messaging', desc: 'Real-time chat with skill providers' },
              { icon: Star, title: 'Reviews & Ratings', desc: 'Community feedback' },
              { icon: Globe, title: 'Local Focus', desc: 'Connect with neighbors nearby' },
            ].map((feature, i) => (
              <div 
                key={i}
                className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <feature.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden gradient-primary p-8 md:p-10 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative z-10">
              <Heart className="w-8 h-8 text-primary-foreground/80 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-3">
                Ready to Join Your Community?
              </h2>
              <p className="text-primary-foreground/80 text-sm mb-6 max-w-md mx-auto">
                Start sharing skills, learning new things, and building meaningful connections today.
              </p>
              <Link to={user ? "/skills" : "/auth"}>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-10 px-6 text-sm rounded-xl font-semibold"
                >
                  {user ? 'Explore Skills' : 'Join Now — It\'s Free'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </Layout>
  );
};

export default Index;
