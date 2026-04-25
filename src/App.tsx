import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import Hls from "hls.js";
import * as Icons from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as const },
});

const navLinks = [
  { name: "Discover", href: "#hero" },
  { name: "Features", href: "#platform" },
  { name: "About", href: "#about" },
  { name: "Pricing", href: "#cta" },
];
const socialIcons = [Icons.Camera, Icons.BriefcaseBusiness, Icons.MessageCircle];
const avatarColors = ["#3B82F6", "#10B981", "#F59E0B"];

const platformCards = [
  {
    icon: Icons.Zap,
    title: "Lightning Fast",
    description: "Experience blazing-fast performance with our optimized infrastructure and cutting-edge technology.",
  },
  {
    icon: Icons.Shield,
    title: "Secure by Design",
    description: "Enterprise-grade security with end-to-end encryption and compliance with global standards.",
  },
  {
    icon: Icons.Globe,
    title: "Global Scale",
    description: "Deploy anywhere in the world with our distributed network and edge computing capabilities.",
  },
];

const features = [
  {
    title: "Real-time Sync",
    description: "Instant collaboration with live updates across all your devices and team members.",
  },
  {
    title: "Smart Analytics",
    description: "Deep insights into your performance with AI-powered recommendations and dashboards.",
  },
  {
    title: "Seamless Integration",
    description: "Connect with 100+ tools and services you already use with one-click integrations.",
  },
  {
    title: "24/7 Support",
    description: "Expert help whenever you need it with dedicated support teams and extensive documentation.",
  },
];

function RevealParagraph({
  text,
  className,
  emphasizeWords = [],
}: {
  text: string;
  className: string;
  emphasizeWords?: string[];
}) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"],
  });

  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = (index + 1) / words.length;
        const clean = word.replace(/[^\w]/g, "").toLowerCase();
        const highlighted = emphasizeWords.includes(clean);
        return (
          <RevealWord
            key={`${word}-${index}`}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
            className={highlighted ? "text-foreground" : "text-[hsl(var(--hero-subtitle))]"}
          />
        );
      })}
    </p>
  );
}

function RevealWord({
  word,
  progress,
  range,
  className,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  className: string;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className={className}>
      {word}{" "}
    </motion.span>
  );
}

export default function App() {
  const ctaVideoRef = useRef<HTMLVideoElement | null>(null);
  const [videoError, setVideoError] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission logic here
    console.log('Email submitted');
  };

  const handleSocialClick = (platform: string) => {
    const socialUrls: Record<string, string> = {
      'Instagram': 'https://instagram.com/y7xified',
      'LinkedIn': 'https://linkedin.com/company/y7xified',
      'Twitter': 'https://twitter.com/y7xified',
    };
    const url = socialUrls[platform];
    if (url) {
      window.open(url, '_blank');
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  useEffect(() => {
    const video = ctaVideoRef.current;
    if (!video) return;

    const src = "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";
    
    const handleHlsError = () => {
      setVideoError(true);
    };

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, handleHlsError);
      return () => {
        hls.off(Hls.Events.ERROR, handleHlsError);
        hls.destroy();
      };
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, []);

  return (
    <main className="relative bg-background text-foreground">
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between px-8 py-4 md:px-28">
        <div className="flex items-center gap-3">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-foreground/60">
            <div className="h-3 w-3 rounded-full border border-foreground/60" />
          </div>
          <span className="text-lg font-bold">Y7XIFIED</span>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {navLinks.map((link, index) => (
            <div key={link.name} className="flex items-center gap-3">
              <a 
                href={link.href} 
                className="text-sm text-muted-foreground transition hover:text-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(link.href);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {link.name}
              </a>
              {index < navLinks.length - 1 ? <span className="text-muted-foreground">•</span> : null}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {socialIcons.map((Icon, index) => {
            const platforms = ['Instagram', 'LinkedIn', 'Twitter'];
            return (
              <button 
                key={index} 
                className="frosted-glass flex h-10 w-10 items-center justify-center rounded-full"
                onClick={() => handleSocialClick(platforms[index])}
                aria-label={platforms[index]}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </nav>

      <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
          onError={handleVideoError}
        />
        {videoError && (
          <div className="absolute inset-0 bg-background" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-8 pt-28 text-center md:pt-32">
          <motion.div {...fadeUp(0)} className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
            <div className="-space-x-2 flex">
              {avatarColors.map((color, idx) => (
                <div key={idx} className="frosted-glass h-8 w-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: color }}>
                  {String.fromCharCode(65 + idx)}
                </div>
              ))}
            </div>
            <span>50,000+ users trust our platform</span>
          </motion.div>
          <motion.h1
            {...fadeUp(0.1)}
            className="text-5xl font-medium tracking-[-2px] md:text-7xl lg:text-8xl"
          >
            Build <span className="font-serif text-foreground italic font-normal">Amazing</span> Products
          </motion.h1>
          <motion.p
            {...fadeUp(0.2)}
            className="mt-6 max-w-3xl text-lg text-[hsl(var(--hero-subtitle))]"
          >
            The all-in-one platform that helps teams ship faster, collaborate better, and scale with confidence.
          </motion.p>
          <motion.form
            {...fadeUp(0.3)}
            className="frosted-glass mt-10 flex w-full max-w-lg items-center gap-2 rounded-full p-2"
            onSubmit={handleEmailSubmit}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="rounded-full bg-foreground px-8 py-3 text-sm font-semibold tracking-wide text-background"
              aria-label="Get started with email signup"
            >
              GET STARTED
            </motion.button>
          </motion.form>
        </div>
      </section>

      <section id="about" className="px-8 pb-6 pt-52 text-center md:px-28 md:pb-9 md:pt-64">
        <motion.h2 {...fadeUp(0)} className="text-5xl md:text-7xl lg:text-8xl">
          The Future is <span className="font-serif italic">Here.</span> Are You Ready?
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="mx-auto mb-24 mt-8 max-w-2xl text-lg text-muted-foreground">
          Modern teams need modern tools. Stop struggling with outdated workflows and embrace the next generation of productivity.
        </motion.p>
        <div className="mb-20 grid gap-12 md:grid-cols-3 md:gap-8">
          {platformCards.map((item, index) => (
            <motion.article key={item.title} {...fadeUp(0.1 * index)} className="mx-auto max-w-sm">
              <div className="mx-auto flex h-[200px] w-[200px] items-center justify-center rounded-2xl bg-secondary/20">
                <item.icon className="h-24 w-24 text-foreground" />
              </div>
              <h3 className="mt-6 text-base font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
            </motion.article>
          ))}
        </div>
        <motion.p {...fadeUp(0.2)} className="text-center text-sm text-muted-foreground">
          Don't let your competitors get ahead. Start transforming your workflow today.
        </motion.p>
      </section>

      <section className="px-8 pb-32 pt-0 md:px-28 md:pb-44">
        <motion.video
          {...fadeUp(0)}
          autoPlay
          loop
          muted
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
          className="mx-auto mb-20 aspect-square w-full max-w-[800px] rounded-2xl object-cover"
          onError={handleVideoError}
        />
        <RevealParagraph
          className="text-2xl font-medium tracking-[-1px] md:text-4xl lg:text-5xl"
          text="We empower teams to work smarter, not harder — where innovation meets execution and every project becomes a success story."
          emphasizeWords={["innovation", "meets", "execution"]}
        />
        <RevealParagraph
          className="mt-10 text-xl font-medium md:text-2xl lg:text-3xl"
          text="A complete ecosystem for modern development — with better tools, faster delivery, and greater impact for your business."
        />
      </section>

      <section id="platform" className="border-t border-border/30 px-8 py-32 md:px-28 md:py-44">
        <motion.p {...fadeUp(0)} className="text-xs uppercase tracking-[3px] text-muted-foreground">
          PLATFORM
        </motion.p>
        <motion.h2 {...fadeUp(0.1)} className="mt-5 text-4xl md:text-6xl">
          Everything you need to <span className="font-serif italic">succeed</span>
        </motion.h2>
        <motion.video
          {...fadeUp(0.2)}
          autoPlay
          loop
          muted
          playsInline
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"
          className="mt-12 aspect-[3/1] w-full rounded-2xl object-cover"
          onError={handleVideoError}
        />
        <div className="mt-14 grid gap-8 md:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div key={feature.title} {...fadeUp(0.1 * index)}>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="cta" className="relative overflow-hidden border-t border-border/30 px-8 py-32 md:px-28 md:py-44">
        <video 
          ref={ctaVideoRef} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 z-0 h-full w-full object-cover"
          onError={handleVideoError}
        />
        <div className="absolute inset-0 z-[1] bg-background/45" />
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="relative mb-8 flex h-10 w-10 items-center justify-center rounded-full border-2 border-foreground/70">
            <div className="h-5 w-5 rounded-full border border-foreground/70" />
          </div>
          <motion.h2 {...fadeUp(0)} className="text-4xl md:text-6xl">
            Ready to <span className="font-serif italic">Transform</span> Your Workflow?
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="mt-5 max-w-2xl text-muted-foreground">
            Join thousands of teams already using our platform to build better products, faster.
          </motion.p>
          <motion.div {...fadeUp(0.2)} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg">Start Free Trial</Button>
            <Button size="lg" variant="ghost" className="frosted-glass">
              Book Demo
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="flex flex-col items-start justify-between gap-5 px-8 py-12 md:flex-row md:items-center md:px-28">
        <p className="text-sm text-muted-foreground">© 2026 Y7XIFIED. Built for modern teams.</p>
        <div className="flex items-center gap-6">
          {["Privacy", "Terms", "Contact"].map((link) => (
            <a key={link} href="#" className="text-sm text-muted-foreground transition hover:text-foreground">
              {link}
            </a>
          ))}
        </div>
      </footer>
    </main>
  );
}
