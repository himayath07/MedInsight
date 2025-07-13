import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { 
  BrainCircuit, FileText, Stethoscope, MessageSquare, ChevronRight, 
  ShieldCheck, Zap, Clock, CheckCircle2, HeartPulse, Brain, Activity, 
  Upload, Settings, FileText as FileTextIcon, CheckCircle, Award, Shield, Zap as ZapIcon
} from 'lucide-react';
import { HeroList } from './components/HeroList';

const LandingPage = () => {
  // Animation effect for hero section
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  // Features data
  const features = [
    {
      icon: <ZapIcon className="w-8 h-8 text-blue-600" />,
      title: "Fast & Accurate",
      description: "AI algorithms provide rapid and precise diagnoses in seconds."
    },
    {
      icon: <FileTextIcon className="w-8 h-8 text-green-600" />,
      title: "Customizable Reports",
      description: "Generate reports that fit your medical style or preference."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Seamless Integration",
      description: "Works with X-ray, MRI, CT scans, and Ultrasound formats."
    }
  ];

  // How it works steps
  const howItWorks = [
    {
      icon: <Upload className="w-10 h-10 text-blue-500" />,
      title: "Upload Images",
      description: "Upload your medical images (X-ray, MRI, CT scan, Ultrasound)."
    },
    {
      icon: <Settings className="w-10 h-10 text-blue-500" />,
      title: "AI Processing",
      description: "Our AI processes the images and detects any abnormalities."
    },
    {
      icon: <FileTextIcon className="w-10 h-10 text-blue-500" />,
      title: "Receive Reports",
      description: "Get detailed, AI-generated reports for fast diagnosis."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-cyan-600 text-white py-32 md:py-48">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-6 fade-in-up">
              <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white/90">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                AI-Powered Medical Diagnostics
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Revolutionizing Diagnostics with <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">AI-Driven Insights</span>
              </h1>

              <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                Empowering healthcare providers with fast, accurate, and personalized medical analysis through advanced artificial intelligence.
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link to="/upload" className="fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-900 hover:bg-blue-100 font-semibold text-base px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    Try Free Analysis <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#how-it-works" className="fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:text-white font-medium text-base px-8 py-6 rounded-full transition-all duration-300"
                  >
                    Learn About Our AI
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Feed Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Real-time Activity Feed
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Stay updated with the latest diagnostic activities and system updates in real-time.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div className="p-6">
                  <div className="h-[500px] overflow-y-auto pr-2 -mr-2">
                    <HeroList />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How MedInsight AI Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              A simple three-step process to get accurate medical insights
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose MedInsight AI?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Our platform combines cutting-edge AI with medical expertise to deliver precise, efficient, and accessible diagnostic support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-5 text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Diagnostic Workflow?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Join thousands of healthcare professionals who trust MedInsight AI for accurate and efficient diagnostic support.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/upload">
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-100 font-semibold text-base px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Get Started Free
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:text-white font-medium text-base px-8 py-6 rounded-full transition-all duration-300"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold">MedInsight AI</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Transforming healthcare through AI-powered diagnostic solutions for accurate and efficient patient care.
              </p>
              <div className="flex space-x-4 mt-4">
                {[
                  { name: 'Twitter', icon: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' },
                  { name: 'GitHub', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z', clipRule: 'evenodd' },
                  { name: 'LinkedIn', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z', viewBox: '0 0 24 24' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox={social.viewBox || '0 0 24 24'}
                      aria-hidden="true"
                    >
                      <path
                        fillRule={social.fillRule || 'evenodd'}
                        d={social.icon}
                        clipRule={social.clipRule}
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Solutions</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Medical Imaging', href: '#' },
                  { name: 'Diagnostic Tools', href: '#' },
                  { name: 'Patient Management', href: '#' },
                  { name: 'Clinical Analytics', href: '#' },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
              <ul className="space-y-3">
                {[
                  { name: 'About Us', href: '#' },
                  { name: 'Careers', href: '#' },
                  { name: 'Blog', href: '#' },
                  { name: 'Contact', href: '#' },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Help Center', href: '#' },
                  { name: 'Documentation', href: '#' },
                  { name: 'API Status', href: '#' },
                  { name: 'Security', href: '#' },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} MedInsight AI. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
