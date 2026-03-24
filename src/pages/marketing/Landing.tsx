import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MarketingLayout } from '@/components/marketing/MarketingLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VideoBackground } from '@/components/ui/video-background';
import { ContactDialog } from '@/components/contact/ContactDialog';
import { Phone, Bot, BarChart3, Clock, Users, Zap, CheckCircle, Play, ArrowRight, Star, TrendingUp, Settings, Target, Shield, Globe, Building, GraduationCap, Stethoscope, Store, HeadphonesIcon, Database, MessageSquare, Filter, UserCheck, LayoutDashboard, Smartphone, DollarSign, Award, Headphones, Calendar, Lock, Gauge } from 'lucide-react';
const Landing = () => {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [liveStats, setLiveStats] = useState({
    callsToday: 8247,
    leadsQualified: 1834,
    activeUsers: 127
  });

  // Animate live stats
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        callsToday: prev.callsToday + Math.floor(Math.random() * 3),
        leadsQualified: prev.leadsQualified + Math.floor(Math.random() * 2),
        activeUsers: prev.activeUsers + (Math.random() > 0.7 ? 1 : 0)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const features = [{
    icon: Settings,
    title: "Automated Follow-Ups for Sales",
    description: "Our AI automatically follows up with every lead at the perfect time, ensuring no opportunity slips through the cracks.",
    benefit: "Stop lead delay completely"
  }, {
    icon: Phone,
    title: "B2B Follow-Up Automation Tool",
    description: "Purpose-built for B2B sales cycles with multi-touch sequences that adapt to prospect responses and engagement levels.",
    benefit: "300% increase in follow-up consistency"
  }, {
    icon: Target,
    title: "Sales Pipeline Automation",
    description: "Automate your entire sales pipeline from initial contact to qualification, objection handling, and appointment setting.",
    benefit: "85% reduction in manual follow-up tasks"
  }, {
    icon: Database,
    title: "Sales Engagement Platform Integration",
    description: "Seamlessly connects with your existing CRM and sales tools to create a unified sales engagement platform.",
    benefit: "Zero manual data entry or task switching"
  }, {
    icon: BarChart3,
    title: "Follow-Up Performance Analytics",
    description: "Track which follow-up sequences convert best, optimize timing, and eliminate ineffective outreach patterns.",
    benefit: "45% improvement in follow-up conversion rates"
  }];
  const howItWorks = [{
    step: "01",
    title: "We Set Up Your Sales Pipeline Automation",
    description: "We configure your entire sales follow-up system with personalized sequences that prevent lead decay at every stage.",
    icon: Settings,
    time: "24-48 hours"
  }, {
    step: "02",
    title: "Automated Follow-Ups Begin Instantly",
    description: "The moment a lead enters your system, our AI begins a personalized follow-up sequence with perfect timing.",
    icon: Bot,
    time: "Under 30 seconds"
  }, {
    step: "03",
    title: "B2B Follow-Up Tool Qualifies Leads",
    description: "Our B2B follow-up automation tool identifies buying signals, handles objections, and nurtures leads until they're ready.",
    icon: Target,
    time: "Continuous engagement"
  }, {
    step: "04",
    title: "Sales Engagement Platform Dashboard",
    description: "Monitor all follow-up activities, conversion rates, and pipeline health in one comprehensive sales engagement platform.",
    icon: LayoutDashboard,
    time: "Real-time insights"
  }];
  const socialProof = [{
    metric: "10M+",
    label: "AI Calls Completed",
    icon: Phone
  }, {
    metric: "400%",
    label: "Average ROI Increase",
    icon: TrendingUp
  }, {
    metric: "2.3M+",
    label: "Leads Qualified",
    icon: UserCheck
  }, {
    metric: "98.7%",
    label: "Uptime Guarantee",
    icon: Shield
  }];
  const whyChooseUs = [{
    icon: Settings,
    title: "Complete Sales Pipeline Automation",
    description: "We build your entire sales follow-up system with automated sequences that keep your pipeline moving without manual effort.",
    proof: "Eliminates 40+ hours of follow-up work weekly"
  }, {
    icon: Bot,
    title: "B2B Follow-Up Automation Tool",
    description: "Our specialized B2B follow-up tool understands complex sales cycles, handles objections, and nurtures relationships automatically.",
    proof: "85% of prospects engage more with our automated follow-ups"
  }, {
    icon: Clock,
    title: "Stop lead delay Completely",
    description: "Perfectly timed follow-ups prevent leads from going cold. Our system ensures consistent engagement at every stage of your pipeline.",
    proof: "78% reduction in lead decay compared to manual follow-up"
  }, {
    icon: DollarSign,
    title: "Sales Engagement Platform ROI",
    description: "Our comprehensive sales engagement platform delivers measurable results with detailed analytics on every follow-up activity.",
    proof: "Average 3.4x ROI from automated follow-ups for sales"
  }];
  const industries = [{
    name: "Real Estate",
    icon: Building,
    description: "Lead qualification & appointment setting"
  }, {
    name: "Financial Services",
    icon: TrendingUp,
    description: "Compliance-ready loan & insurance calls"
  }, {
    name: "EdTech & Courses",
    icon: GraduationCap,
    description: "Student enrollment & consultation booking"
  }, {
    name: "SaaS & Tech",
    icon: Globe,
    description: "Demo booking & trial conversion"
  }, {
    name: "Healthcare",
    icon: Stethoscope,
    description: "Patient screening & appointment setting"
  }, {
    name: "Local Businesses",
    icon: Store,
    description: "Service inquiries & quote generation"
  }, {
    name: "Call Centers",
    icon: HeadphonesIcon,
    description: "Overflow handling & lead qualification"
  }, {
    name: "Marketing Agencies",
    icon: Target,
    description: "Client lead processing & qualification"
  }];
  const whatYouGet = ["Automated follow-ups for sales that never miss", "Complete sales pipeline automation", "B2B follow-up automation tool", "Sales engagement platform with analytics", "Advanced lead scoring to prevent lead decay", "Human handoff for hot prospects", "24/7 technical support & optimization", "Custom follow-up sequences & conversation flows"];
  const testimonials = [{
    name: "Karan Shah",
    role: "Co-founder, FinGrow",
    company: "Financial Services",
    content: "Convelix's automated follow-ups for sales transformed our pipeline completely. We went from manually following up with 50 leads per day to having AI manage 2,000+ follow-ups daily. Our sales pipeline automation has eliminated lead decay entirely.",
    rating: 5,
    results: "400% increase in qualified leads",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  }, {
    name: "Riya Malhotra",
    role: "Director of Sales, PropLead",
    company: "Real Estate",
    content: "Their B2B follow-up automation tool is incredible. The AI is so natural that prospects actually prefer it over our human reps sometimes. It never has a bad day, never forgets to follow up, and our sales engagement platform converts 3x better than our old system.",
    rating: 5,
    results: "300% increase in appointments set",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
  }, {
    name: "Michael Chen",
    role: "CEO, TechFlow Solutions",
    company: "SaaS",
    content: "We were spending $15K/month on lead generation with mediocre results. Convelix's sales pipeline automation costs half that and delivers 5x more qualified demos. The automated follow-ups have completely stopped our lead decay issues.",
    rating: 5,
    results: "500% ROI in first quarter",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  }];
  
  const faqs = [{
    question: "How quickly can you set up our automated follow-ups for sales?",
    answer: "Most clients have their sales pipeline automation up and running within 24-48 hours. We handle all the technical setup, integrations, and testing so you can start preventing lead decay immediately."
  }, {
    question: "How does your B2B follow-up automation tool work?",
    answer: "Our B2B follow-up automation tool doesn't just send generic messages - it creates personalized follow-up sequences, handles objections, asks intelligent questions, and knows exactly when to escalate to your team. It's a complete sales engagement platform."
  }, {
    question: "How do you prevent lead decay in our sales pipeline?",
    answer: "Our automated follow-ups for sales are timed perfectly to maintain engagement without being pushy. The system analyzes response patterns and engagement signals to optimize follow-up timing and prevent leads from going cold."
  }, {
    question: "Can your sales pipeline automation integrate with our existing CRM?",
    answer: "Absolutely. Our sales engagement platform seamlessly integrates with all major CRMs and sales tools. You get a complete summary of all follow-up activities, lead qualification status, and next steps in your existing systems."
  }, {
    question: "What ROI can we expect from your automated follow-ups?",
    answer: "Most clients see a 300-500% ROI within the first 90 days of implementing our automated follow-ups for sales. The exact results depend on your current follow-up process, lead volume, and sales cycle length. Contact us for a personalized assessment."
  }];
  const playDemo = () => {
    setIsPlayingDemo(true);
    setTimeout(() => setIsPlayingDemo(false), 4000);
  };
  return <MarketingLayout>
      {/* Header Section with Video Background */}
      <section className="relative bg-gradient-to-br from-brand-50 via-background to-secondary text-foreground overflow-hidden min-h-screen">
        {/* Video Background */}
        <VideoBackground src="https://player.cloudinary.com/embed/?cloud_name=dknafpppp&public_id=GettyImages-942150714_1_ktjqaa&profile=cld-default" className="z-0 opacity-40" />
        
        {/* Light overlay for readability */}
        <div className="absolute inset-0 bg-background/60 z-10"></div>
        
        {/* Animated decorative elements */}
        <div className="absolute inset-0 z-20">
          <div className="absolute top-20 left-10 w-2 h-2 bg-brand-400 rounded-full animate-bounce opacity-60"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-brand-500 rounded-full animate-bounce opacity-40" style={{
          animationDelay: '1s'
        }}></div>
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-brand-300 rounded-full animate-bounce opacity-50" style={{
          animationDelay: '2s'
        }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-28 lg:px-36 lg:pt-48 z-30 h-full flex items-center">
          <div className="text-center w-full">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Automated Follow-Ups{' '}
              <span className="text-brand-600">
                For Sales That Convert
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-4xl mx-auto">
              Stop losing leads with slow follow-ups. Our AI automates your sales pipeline, 
              <strong className="text-brand-600"> keeps your leads warm, and helps you close deals faster.</strong>
            </p>

            {/* Key Benefits */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="bg-card/90 border border-border backdrop-blur-md rounded-full px-4 py-2 flex items-center shadow-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-brand-600" />
                <span className="text-sm text-foreground">Stop lead delay</span>
              </div>
              <div className="bg-card/90 border border-border backdrop-blur-md rounded-full px-4 py-2 flex items-center shadow-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-brand-600" />
                <span className="text-sm text-foreground">B2B follow-up automation</span>
              </div>
              <div className="bg-card/90 border border-border backdrop-blur-md rounded-full px-4 py-2 flex items-center shadow-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-brand-600" />
                <span className="text-sm text-foreground">Sales pipeline automation</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <ContactDialog formType="consultation">
                <Button size="lg" className="text-lg px-8 py-4">
                  Get Automated Sales Follow-Ups
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </ContactDialog> 
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      {/* <section className="py-16 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {socialProof.map((stat, index) => <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{stat.metric}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>)}
          </div>
        </div>
      </section> */}

      {/* What We Do - Enhanced */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-brand-100 rounded-full px-4 py-2 mb-6 border border-brand-200">
              <Award className="w-4 h-4 mr-2 text-brand-700" />
              <span className="text-brand-800 font-medium">The Complete Lead-to-Sale Solution</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              We Don't Just Call Leads. We Build Lead Empires.
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              While others sell calling software, we become your complete lead generation partner. From capture to conversion, 
              we handle everything so you can focus on closing deals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => <Card key={index} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">{feature.description}</p>
                  <div className="bg-brand-50 rounded-lg p-3 border border-brand-100">
                    <p className="text-brand-800 font-medium text-sm">{feature.benefit}</p>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              From Zero to Lead Machine in 48 Hours
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We handle the heavy lifting while you focus on what you do best - closing deals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {howItWorks.map((step, index) => <div key={index} className="flex items-start space-x-6 group p-5 rounded-lg border">
                <div className="flex-shrink-0 flex flex-col">
                  <div className="w-20 h-20 bg-gradient-to-r from-brand-500 to-brand-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-3xl font-bold text-brand-600">{step.step}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-3 items-center mb-2">
                    <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                    <div className="ml-auto bg-brand-100 text-brand-700 text-xs px-3 py-1 rounded-full font-medium border border-brand-200">
                      {step.time}
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>)}
          </div>

          <div className="text-center mt-16">
            <ContactDialog formType="demo">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Your 48-Hour Setup
                <Calendar className="ml-2 h-5 w-5" />
              </Button>
            </ContactDialog>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-brand-50 to-secondary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Why 500+ Companies Choose Convelix
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're not just another calling tool. We're your complete lead generation partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, index) => <Card key={index} className="bg-card border border-border shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">{item.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                  <div className="bg-gradient-to-r from-brand-50 to-secondary rounded-lg p-4 border border-brand-100">
                    <div className="flex items-center text-brand-800">
                      <Gauge className="w-4 h-4 mr-2" />
                      <span className="font-medium text-sm">{item.proof}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Industries - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Trusted Across Every Industry
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From real estate to SaaS, our AI adapts to your industry's unique needs and compliance requirements.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => <Card key={index} className="bg-gradient-to-br from-muted to-secondary border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <industry.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{industry.name}</h3>
                  <p className="text-sm text-muted-foreground">{industry.description}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Real Results from Real Customers
            </h2>
            <p className="text-xl text-muted-foreground">Don't just take our word for it</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => <Card key={index} className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 text-brand-500 fill-brand-500" />)}
                  </div>
                  <p className="text-lg text-foreground mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                  <div className="bg-brand-50 rounded-lg p-4 mb-6 border border-brand-100">
                    <p className="text-brand-800 font-semibold text-sm">{testimonial.results}</p>
                  </div>
                  <div className="flex items-center">
                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <p className="font-bold text-lg text-foreground">{testimonial.name}</p>
                      <p className="text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* What You Get - Enhanced */}
      <section className="py-24 bg-muted border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-foreground">
                Everything You Need to Dominate Your Market
              </h2>
              
              <div className="space-y-4 mb-8">
                {whatYouGet.map((item, index) => <div key={index} className="flex items-center space-x-4">
                    <CheckCircle className="w-6 h-6 text-brand-600 flex-shrink-0" />
                    <span className="text-xl text-foreground">{item}</span>
                  </div>)}
              </div>
              
              <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
                <h3 className="text-xl font-bold mb-4 text-foreground">🎯 Limited Time Bonus</h3>
                <p className="text-lg text-muted-foreground">Free consultation call with our lead generation experts (Value: $2,500)</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <ContactDialog formType="demo">
                  <Button size="lg" className="text-lg px-8 py-4">
                    Claim Your Free Setup
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </ContactDialog>
                <ContactDialog formType="pricing">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-brand-300 text-white hover:bg-brand-50">
                    See Pricing Options
                  </Button>
                </ContactDialog>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold mb-6 text-center text-foreground">Performance Guarantee</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-brand-50 border border-brand-100 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-brand-600">48hrs</div>
                    <div className="text-sm text-muted-foreground">Setup Time</div>
                  </div>
                  <div className="bg-brand-50 border border-brand-100 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-brand-600">24/7</div>
                    <div className="text-sm text-muted-foreground">AI Calling</div>
                  </div>
                  <div className="bg-brand-50 border border-brand-100 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-brand-600">10K+</div>
                    <div className="text-sm text-muted-foreground">Calls/Day</div>
                  </div>
                  <div className="bg-brand-50 border border-brand-100 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-brand-600">400%</div>
                    <div className="text-sm text-muted-foreground">Avg ROI</div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="bg-brand-100 border border-brand-200 rounded-lg p-4">
                    <div className="flex items-center justify-center mb-2">
                      <Shield className="w-5 h-5 text-brand-700 mr-2" />
                      <span className="font-semibold text-brand-900">60-Day Money Back Guarantee</span>
                    </div>
                    <p className="text-sm text-muted-foreground">If you don't see results, we'll refund every penny</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about getting started</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-brand-50 via-background to-secondary text-foreground relative overflow-hidden border-t border-brand-100">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-brand-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-brand-400 rounded-full blur-3xl animate-pulse" style={{
          animationDelay: '1s'
        }}></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center bg-brand-100 backdrop-blur-md rounded-full px-6 py-2 mb-8 border border-brand-200">
            <Clock className="w-4 h-4 mr-2 text-brand-700" />
            <span className="text-brand-800 font-medium">⚡ Limited Spots Available - Setup Fee Waived This Month</span>
          </div>

          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground">
            Ready to 10X Your Lead Conversion?
          </h2>
          <p className="text-xl lg:text-2xl mb-8 text-muted-foreground leading-relaxed">
            Join 500+ companies already using AI to qualify thousands of leads daily. 
            <strong className="text-brand-600"> Your competition is already calling.</strong>
          </p>

          <div className="bg-card border border-border rounded-2xl p-8 mb-12 shadow-md">
            <h3 className="text-2xl font-bold mb-4 text-foreground">🚀 What Happens Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-foreground">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center mr-3 text-primary-foreground font-bold">1</div>
                <span>15-min strategy call</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center mr-3 text-primary-foreground font-bold">2</div>
                <span>Custom system build</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-brand-700 rounded-full flex items-center justify-center mr-3 text-primary-foreground font-bold">3</div>
                <span>AI starts calling leads</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <ContactDialog formType="demo">
              <Button size="lg" className="text-lg px-8 py-4 animate-pulse">
                Get Free Lead System Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </ContactDialog>
            <ContactDialog formType="pricing">
              <Button size="lg" variant="outline" className="border-brand-300 text-brand-800 hover:bg-brand-50 text-lg px-8 py-4">
                View Pricing
              </Button>
            </ContactDialog>
          </div>

          <p className="text-muted-foreground mt-8 text-sm">
            🔒 No contracts • 60-day guarantee • Setup in 48 hours
          </p>
        </div>
      </section>
    </MarketingLayout>;
};
export default Landing;