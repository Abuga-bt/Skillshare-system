import { Link } from 'react-router-dom';
import { ArrowRightLeft, Heart, Mail, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  product: [
    { label: 'Browse Skills', href: '/skills' },
    { label: 'Exchanges', href: '/exchanges' },
    { label: 'Messages', href: '/messages' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Help Center', href: '/help' },
    { label: 'Community Guidelines', href: '/about' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold">SkillSwap</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Building stronger communities through skill sharing. Connect, learn, and grow together.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Connecting neighbors worldwide</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Stay Connected</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Join our community and start exchanging skills today.
            </p>
            <Link 
              to="/auth"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>© {currentYear} SkillSwap </span>
            
    
          </div>
          
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
