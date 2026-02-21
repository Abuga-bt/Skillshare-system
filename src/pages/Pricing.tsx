import { Layout } from '@/components/Layout';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
  {
    name: 'Free',
    price: 'R0',
    period: '/month',
    description: 'Get started with basic skill sharing',
    features: [
      'Create up to 3 skill listings',
      'Browse all skills',
      'Send exchange requests',
      'Direct messaging',
      'Basic profile',
    ],
    cta: 'Get Started',
    popular: false,
    icon: Zap,
  },
  {
    name: 'Premium',
    price: 'R49',
    period: '/month',
    description: 'Stand out and get more exchanges',
    features: [
      'Unlimited skill listings',
      'Featured skill badges',
      'Priority in search results',
      'Verified provider badge',
      'Advanced analytics',
      'Priority support',
    ],
    cta: 'Upgrade to Premium',
    popular: true,
    icon: Crown,
  },
  {
    name: 'Pro',
    price: 'R99',
    period: '/month',
    description: 'For serious skill providers',
    features: [
      'Everything in Premium',
      'Multiple featured listings',
      'Custom profile branding',
      'Bulk messaging',
      'Export exchange history',
      'API access',
      'Dedicated support',
    ],
    cta: 'Go Pro',
    popular: false,
    icon: Star,
  },
];

const Pricing = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-3 gap-1 text-primary border-primary">
            <Crown className="w-3 h-3" /> Pricing
          </Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            Choose Your Plan
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Start free and upgrade as you grow. Premium features help you stand out and get more skill exchanges.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative overflow-hidden transition-all hover:scale-[1.02] ${
                  plan.popular ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-bold">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>

                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link to={user ? '#' : '/auth'}>
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-xl font-display font-bold mb-3">How the Developer Benefits</h2>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-sm">
            <div className="p-4 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-1">Subscription Revenue</h3>
              <p className="text-muted-foreground text-xs">Monthly recurring income from Premium & Pro users</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-1">Featured Listings</h3>
              <p className="text-muted-foreground text-xs">Providers pay to boost their skills to the top of search</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-1">Commission Model</h3>
              <p className="text-muted-foreground text-xs">Small % fee on paid exchanges between users</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

export default Pricing;
