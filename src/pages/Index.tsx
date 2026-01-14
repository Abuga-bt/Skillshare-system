import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Users, Search, ArrowRightLeft, MessageSquare, Star } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-brand opacity-5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 animate-fade-in">
            Share Skills,{' '}
            <span className="text-gradient">Build Community</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Connect with your neighbors, exchange expertise, and strengthen your local community through skill-sharing and bartering.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {user ? (
              <>
                <Link to="/skills">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    <Search className="w-5 h-5" /> Browse Skills
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                    Add Your Skills
                  </Button>
                </Link>
              </>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="gap-2">
                  Get Started <Users className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Create Your Profile', desc: "List the skills you can offer and what you're looking to learn." },
              { icon: ArrowRightLeft, title: 'Connect & Exchange', desc: 'Find community members with matching skills and request exchanges.' },
              { icon: Star, title: 'Build Trust', desc: 'Rate your experiences and build a reputation in your community.' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-card card-elevated animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-14 h-14 rounded-xl gradient-brand flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
