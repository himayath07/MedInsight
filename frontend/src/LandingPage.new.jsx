import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import {
  BrainCircuit,
  FileText,
  Stethoscope,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
  HeartPulse,
  Brain
} from 'lucide-react';
import { HeroList } from './components/HeroList';

const LandingPage = () => {
  const features = [
    {
      icon: <BrainCircuit className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Diagnostics",
      description: "Leverage cutting-edge AI to automatically analyze X-rays, CT scans, MRIs, and Ultrasounds, providing fast, accurate results."
    },
    {
      icon: <FileText className="w-8 h-8 text-green-600" />,
      title: "Customizable Reports",
      description: "Generate AI-powered reports that are fully customizable, making diagnostics clearer and more actionable."
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-purple-600" />,
      title: "Seamless Doctor Discovery",
      description: "Find healthcare professionals based on your location and book appointments in a few simple clicks."
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-amber-600" />,
      title: "Interactive AI Chat",
      description: "Ask questions about your health and get intelligent, easy-to-understand answers powered by AI."
    }
  ];

  const insights = [
    {
      icon: <Activity className="w-6 h-6 text-blue-600" />,
      title: "Instant Analysis",
      description: "Get results in seconds with our advanced AI models"
    },
    {
      icon: <Brain className="w-6 h-6 text-green-600" />,
      title: "Deep Learning",
      description: "Powered by state-of-the-art deep learning algorithms"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared without consent"
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-red-600" />,
      title: "Health First",
      description: "Designed to support healthcare professionals in making better decisions"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-teal-600 text-white py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white/90">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                AI-Powered Medical Diagnostics
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Transforming Healthcare with <span className="bg-gradient-to-r from-cyan-300 to-teal-300 bg-clip-text text-transparent">AI-Powered Insights</span>
              </h1>

              <p className="text-lg md:text-xl text-blue-100 max-w-xl">
                Empowering doctors and patients with accurate, fast, and actionable diagnostics through advanced artificial intelligence.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/upload">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-900 hover:bg-blue-100 font-semibold text-base px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:text-white font-medium text-base px-8 py-6 rounded-full transition-all duration-300"
                  >
                    Explore the Technology
                  </Button>
                </a>
              </div>

              <div className="pt-4 flex items-center text-blue-100 text-sm">
                <div className="flex -space-x-3 mr-4">
                  {['JD', 'SL', 'RK'].map((initial, i) => (
                    <div 
                      key={i}
                      className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-sm font-medium text-white border-2 border-white/20"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <span>Trusted by 5,000+ medical professionals worldwide</span>
              </div>
            </div>

            <div className="hidden md:block relative">
              <div className="relative">
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
                <div className="relative z-10">
                  <HeroList />
                </div>
              </div>
            </div>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-5 text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Learn more
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Real-Time Insights Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Real-Time Insights for Every Patient
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get instant, AI-powered analysis of medical images with detailed reports and actionable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {insights.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex-shrink-0 mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-2xl transform -rotate-1"></div>
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Analysis Complete</span>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Chest X-ray Analysis</h4>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-teal-500 w-3/4"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
                      <p className="font-semibold text-gray-900 dark:text-white">94.7%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Findings</p>
                      <p className="font-semibold text-gray-900 dark:text-white">3 Detected</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" size="lg">
                    View Full Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-teal-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Future of Medical Diagnostics?</h2>
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MedInsight AI</h3>
              <p className="text-gray-400 text-sm">
                Empowering healthcare with AI-driven diagnostic solutions for better patient outcomes.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} MedInsight AI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
