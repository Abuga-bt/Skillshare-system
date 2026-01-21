import { Layout } from '@/components/Layout';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Users, 
  Globe, 
  Sparkles,
  Target,
  Lightbulb,
  HandHeart,
  ArrowRightLeft,
  CheckCircle,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: HandHeart,
    title: "Community First",
    description: "We believe in the power of neighbors helping neighbors. Every skill shared strengthens our community bonds."
  },
  {
    icon: Lightbulb,
    title: "Lifelong Learning",
    description: "Learning doesn't stop at school. We create opportunities for continuous growth and knowledge exchange."
  },
  {
    icon: Globe,
    title: "Accessibility",
    description: "Skills should be accessible to everyone, regardless of economic background. That's why SkillSwap is free."
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "We maintain a safe environment through verified profiles, reviews, and community guidelines."
  }
];

const stats = [
  { value: "500+", label: "Skills Shared" },
  { value: "1,200+", label: "Community Members" },
  { value: "3,000+", label: "Exchanges Completed" },
  { value: "50+", label: "Skill Categories" }
];

const guidelines = [
  "Be respectful and professional in all interactions",
  "Honor your commitments and communicate promptly",
  "Share knowledge generously and patiently",
  "Provide honest, constructive feedback",
  "Report any concerns to maintain community safety"
];

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 px-4 gradient-hero relative overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Our Story
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Building Stronger Communities
              <br />
              <span className="text-gradient">One Skill at a Time</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              SkillSwap was born from a simple idea: everyone has something valuable to teach, 
              and everyone has something new to learn.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <Target className="w-4 h-4" />
                  Our Mission
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Democratizing Knowledge Exchange
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  We're on a mission to create a world where knowledge flows freely between people. 
                  Where a retired teacher can share wisdom with a young entrepreneur, and a tech-savvy 
                  teenager can help neighbors navigate the digital world.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  SkillSwap removes financial barriers to learning by enabling direct skill-for-skill 
                  exchanges. Your time and knowledge are your currency.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <Card key={i} className="text-center p-6 card-modern">
                    <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                Our Values
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                What We Stand For
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                These core values guide everything we do at SkillSwap
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <Card key={i} className="card-modern">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <ArrowRightLeft className="w-4 h-4" />
                How It Works
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Simple, Free, Effective
              </h2>
            </div>

            <div className="space-y-6">
              {[
                { step: "01", title: "Create Your Profile", desc: "Sign up and list the skills you can offer and what you'd like to learn." },
                { step: "02", title: "Discover & Connect", desc: "Browse skills in your community and reach out to potential exchange partners." },
                { step: "03", title: "Exchange & Grow", desc: "Meet up, share knowledge, and help each other grow. Leave reviews to build trust." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                    <span className="text-xl font-display font-bold text-primary-foreground">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-xl mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="py-20 px-4 bg-secondary/30">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                <Users className="w-4 h-4" />
                Community Guidelines
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Our Community Standards
              </h2>
              <p className="text-muted-foreground text-lg">
                Help us maintain a welcoming, productive environment for everyone
              </p>
            </div>

            <Card className="p-8">
              <ul className="space-y-4">
                {guidelines.map((guideline, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{guideline}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="gradient-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-10 md:p-14 text-center">
                <Heart className="w-12 h-12 mx-auto mb-6 opacity-80" />
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                  Ready to Join Our Community?
                </h2>
                <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                  Start sharing your skills and learning new ones today. It's free, forever.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/auth">
                    <Button size="lg" variant="secondary" className="h-12 px-8 font-semibold">
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/skills">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="h-12 px-8 font-semibold bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                    >
                      Browse Skills
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        <Footer />
      </div>
    </Layout>
  );
};

export default About;
