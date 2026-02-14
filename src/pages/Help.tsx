import { Layout } from '@/components/Layout';
import { Footer } from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  BookOpen,
  Users,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "How do I create a skill listing?",
    answer: "Go to your Profile page and click 'Add Skill'. Fill in the title, description, and category. Choose whether you're offering or seeking this skill, then save."
  },
  {
    question: "How does skill exchange work?",
    answer: "Browse the Skills page to find someone offering what you need. Click 'Request Exchange' and send a message explaining what you'd like to learn. The provider will review and respond to your request."
  },
  {
    question: "Is SkillSwap free to use?",
    answer: "Yes! SkillSwap is completely free. We believe in community-powered learning where skills are exchanged without monetary transactions."
  },
  {
    question: "How do I contact someone about their skill?",
    answer: "You can send a direct message through the Messages page or request an exchange on their skill listing. Both methods notify the skill provider."
  },
  {
    question: "Can I offer multiple skills?",
    answer: "Absolutely! You can list as many skills as you'd like on your profile. This increases your chances of finding great exchange opportunities."
  },
  {
    question: "How do reviews and ratings work?",
    answer: "After completing an exchange, both parties can leave reviews. Ratings help build trust in the community and showcase reliable members."
  },
  {
    question: "What if an exchange doesn't work out?",
    answer: "Communication is key. If you need to cancel, message the other person as soon as possible. You can decline or cancel exchange requests through the Exchanges page."
  },
  {
    question: "How do I edit or delete a skill?",
    answer: "Visit your Profile page where all your skills are listed. Each skill card has edit and delete options available."
  }
];

const quickLinks = [
  { icon: Users, title: "Getting Started", description: "Create your profile and list your first skill", link: "/profile" },
  { icon: BookOpen, title: "Browse Skills", description: "Explore what the community has to offer", link: "/skills" },
  { icon: MessageSquare, title: "Messages", description: "Connect with other community members", link: "/messages" },
  { icon: Shield, title: "Community Guidelines", description: "Learn about our community standards", link: "/about" },
];

const Help = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-16 px-4 gradient-hero">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              Help Center
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              How Can We Help?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions and learn how to make the most of SkillSwap
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">Quick Links</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((item, i) => (
                <Link key={i} to={item.link}>
                  <Card className="h-full hover:border-primary/30 transition-all duration-300 cursor-pointer group">
                    <CardHeader className="pb-2">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{item.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 px-4 bg-secondary/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`}
                  className="bg-card rounded-xl border border-border px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="gradient-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
                      Still Have Questions?
                    </h2>
                    <p className="text-primary-foreground/80 mb-6">
                      Can't find what you're looking for? We're here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Button variant="secondary" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Contact Support
                      </Button>
                      
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-32 h-32 rounded-full bg-primary-foreground/10 flex items-center justify-center">
                      <Zap className="w-16 h-16 text-primary-foreground/60" />
                    </div>
                  </div>
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

export default Help;
