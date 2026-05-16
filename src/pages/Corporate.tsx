import React from 'react';
import { motion } from 'motion/react';
import { Shield, Info, HelpCircle, Mail, MapPin, Phone } from 'lucide-react';

const ContentWrapper = ({ children, title, icon: Icon }: any) => (
  <div className="max-w-4xl mx-auto px-6 py-20">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-20"
    >
      <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8">
        <Icon className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-headline-xl text-on-surface mb-4 font-display">{title}</h1>
      <div className="h-1.5 w-20 bg-primary mx-auto rounded-full" />
    </motion.div>
    <div className="glass-surface rounded-[48px] p-12 md:p-20 border border-outline-variant/10 shadow-2xl prose prose-invert max-w-none">
      {children}
    </div>
  </div>
);

export const About = () => (
  <ContentWrapper title="About Zen-Gamer" icon={Info}>
    <h2 className="text-2xl font-display font-bold text-on-surface mb-6">The Sanctuary for Elite Play</h2>
    <p className="text-on-surface-variant leading-relaxed mb-8">
      Zen-Gamer was born from a simple observation: the gaming marketplace is fragmented, chaotic, and often untrustworthy. We built this sanctuary to be different—a curated, high-fidelity clearing house where elite services and hardware are traded with absolute focus and flow.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-primary">Our Mission</h3>
        <p className="text-sm text-on-surface-variant">To empower every competitive player with the neural-linked gear and master-class coaching they need to transcend their limits.</p>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-secondary">Our Vision</h3>
        <p className="text-sm text-on-surface-variant">To become the global standard for gamer excellence, where every deployment is secure, every operator is verified, and every transaction is seamless.</p>
      </div>
    </div>
  </ContentWrapper>
);

export const Privacy = () => (
  <ContentWrapper title="Privacy Policy" icon={Shield}>
    <h2 className="text-2xl font-display font-bold text-on-surface mb-6">Your Data, Your Sanctuary</h2>
    <p className="text-on-surface-variant leading-relaxed mb-8">
      We treat your personal information with the same precision and security as a high-tier deployment. This policy outlines how we protect your digital footprint within our ecosystem.
    </p>
    <h3 className="text-lg font-bold text-on-surface mb-4">1. Data Collection</h3>
    <p className="text-sm text-on-surface-variant mb-6">We only collect data that is essential for platform functionality, such as your operator credentials, order history, and communication logs.</p>
    <h3 className="text-lg font-bold text-on-surface mb-4">2. Neural Link Security</h3>
    <p className="text-sm text-on-surface-variant mb-6">All sensitive data is encrypted using 256-bit protocols. Your payment information is never stored directly on our servers.</p>
  </ContentWrapper>
);

export const Terms = () => (
  <ContentWrapper title="Terms of Service" icon={Shield}>
    <h2 className="text-2xl font-display font-bold text-on-surface mb-6">Operator Code of Conduct</h2>
    <p className="text-on-surface-variant leading-relaxed mb-8">
      By entering the Zen-Gamer marketplace, you agree to abide by our Operator Code of Conduct. We maintain a high-trust environment through strict enforcement of these terms.
    </p>
    <h3 className="text-lg font-bold text-on-surface mb-4">1. Account Integrity</h3>
    <p className="text-sm text-on-surface-variant mb-6">Sellers must provide accurate descriptions of their services and gear. Any misrepresentation will result in immediate decommissioning of the operator profile.</p>
    <h3 className="text-lg font-bold text-on-surface mb-4">2. Transaction Flow</h3>
    <p className="text-sm text-on-surface-variant mb-6">All transactions must occur within the Zen-Gamer checkout system to ensure buyer protection and verified deployment.</p>
  </ContentWrapper>
);

export const Support = () => (
  <ContentWrapper title="Contact Support" icon={HelpCircle}>
    <h2 className="text-2xl font-display font-bold text-on-surface mb-12 text-center">How can we assist your deployment?</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="glass-card rounded-3xl p-8 text-center space-y-4">
        <Mail className="w-8 h-8 text-primary mx-auto" />
        <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Email Hub</h3>
        <p className="text-xs text-on-surface-variant">support@zen-gamer.com</p>
      </div>
      <div className="glass-card rounded-3xl p-8 text-center space-y-4">
        <MapPin className="w-8 h-8 text-primary mx-auto" />
        <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Tactical HQ</h3>
        <p className="text-xs text-on-surface-variant">Ulaanbaatar, Mongolia</p>
      </div>
      <div className="glass-card rounded-3xl p-8 text-center space-y-4">
        <Phone className="w-8 h-8 text-primary mx-auto" />
        <h3 className="text-sm font-black uppercase tracking-widest text-on-surface">Emergency Link</h3>
        <p className="text-xs text-on-surface-variant">+976 1234-5678</p>
      </div>
    </div>
    <div className="mt-16 p-10 bg-primary/5 rounded-[32px] border border-primary/20">
      <h3 className="text-lg font-bold text-on-surface mb-6">Open a Support Ticket</h3>
      <div className="space-y-6">
        <input type="text" placeholder="Subject" className="w-full bg-background border border-outline-variant/20 rounded-2xl p-4 outline-none focus:border-primary transition-all" />
        <textarea placeholder="How can we help?" rows={4} className="w-full bg-background border border-outline-variant/20 rounded-2xl p-4 outline-none focus:border-primary transition-all" />
        <button className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:brightness-110 transition-all">Deploy Request</button>
      </div>
    </div>
  </ContentWrapper>
);
