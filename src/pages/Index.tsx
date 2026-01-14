import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
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

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden gradient-hero">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-accent rounded-full animate-float" />
        <div className="absolute top-2/3 left-1/4 w-3 h-3 bg-primary rounded-full animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Community-Powered Skill Exchange
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 animate-slide-up leading-tight">
            Share What You Know,
            <br />
            <span className="text-gradient">Learn What You Need</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Connect with neighbors, exchange skills, and build a stronger community through collaborative learning and mutual support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {user ? (
              <>
                <Link to="/skills">
                  <Button size="lg" className="gap-2 w-full sm:w-auto h-14 px-8 text-base rounded-xl btn-glow">
                    <Search className="w-5 h-5" /> Explore Skills
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto h-14 px-8 text-base rounded-xl border-2">
                    Share Your Skills <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button size="lg" className="gap-2 h-14 px-8 text-base rounded-xl btn-glow">
                    Get Started Free <Zap className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/skills">
                  <Button size="lg" variant="outline" className="gap-2 h-14 px-8 text-base rounded-xl border-2">
                    Browse Skills
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {[
              { value: '500+', label: 'Skills Shared' },
              { value: '1.2K', label: 'Community Members' },
              { value: '3K+', label: 'Exchanges Made' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-display font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started in minutes and connect with skilled neighbors
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Users, 
                title: 'Create Your Profile', 
                desc: 'List your skills, expertise, and what you want to learn. Showcase your talents to the community.',
                step: '01'
              },
              { 
                icon: Search, 
                title: 'Find & Connect', 
                desc: 'Browse skills, filter by category, and connect directly with community members who match your needs.',
                step: '02'
              },
              { 
                icon: ArrowRightLeft, 
                title: 'Exchange & Grow', 
                desc: 'Request skill exchanges, message providers, and build lasting connections through mutual learning.',
                step: '03'
              },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="relative p-8 rounded-2xl bg-card card-modern animate-slide-up group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="absolute top-6 right-6 text-6xl font-display font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {feature.step}
                </span>
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">Built for Community</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every feature designed to strengthen local connections
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Trusted Network', desc: 'Verified profiles and rating system' },
              { icon: MessageSquare, title: 'Direct Messaging', desc: 'Real-time chat with skill providers' },
              { icon: Star, title: 'Reviews & Ratings', desc: 'Build trust through community feedback' },
              { icon: Globe, title: 'Local Focus', desc: 'Connect with neighbors nearby' },
            ].map((feature, i) => (
              <div 
                key={i}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden gradient-primary p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            
            <div className="relative z-10">
              <Heart className="w-12 h-12 text-primary-foreground/80 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
                Ready to Join Your Community?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Start sharing skills, learning new things, and building meaningful connections today.
              </p>
              <Link to={user ? "/skills" : "/auth"}>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="h-14 px-8 text-base rounded-xl font-semibold"
                >
                  {user ? 'Explore Skills' : 'Join Now — It\'s Free'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">SkillSwap</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Building stronger communities through skill sharing
          </p>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
