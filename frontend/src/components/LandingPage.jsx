import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, ShieldCheck, Activity, Upload, BarChart2, 
  Users, FileText, HeartPulse, Brain, Bone, Eye, 
  Stethoscope, CheckCircle, Zap, Clock, Shield, 
  BarChart, Star, PlayCircle 
} from 'lucide-react';
import { Button } from './ui/button';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const FeatureCard = React.memo(({ icon, title, description, delay }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      transition={{ delay: delay || 0 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
    >
      <div className="w-14 h-14 bg-blue-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
});

FeatureCard.displayName = 'FeatureCard';

const AnimatedBlob = React.memo(({ className, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{
      opacity: [0.6, 0.4, 0.6],
      scale: [1, 1.1, 1],
      x: [0, 20, 0],
      y: [0, 20, 0],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      ease: 'easeInOut',
      repeat: Infinity,
      delay: delay,
    }}
    className={`absolute rounded-full filter blur-3xl opacity-20 ${className}`}
  />
));

AnimatedBlob.displayName = 'AnimatedBlob';

const LandingPage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden relative">
      {/* Animated background elements */}
      <AnimatedBlob className="w-96 h-96 bg-blue-400 -top-48 -left-48" delay={0} />
      <AnimatedBlob className="w-80 h-80 bg-indigo-400 top-1/4 -right-40" delay={1} />
      <AnimatedBlob className="w-64 h-64 bg-purple-400 bottom-20 left-1/4" delay={2} />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm" />
        <div className="relative w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8 text-center z-10"
          >
            <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm px-4 py-2 rounded-full mb-4">
              AI-Powered Medical Diagnostics
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              The Future of <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Medical Diagnosis</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Advanced diagnostic tools that empower healthcare professionals to detect, analyze, and diagnose medical conditions with unprecedented accuracy and speed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Link to="/upload" className="flex justify-center">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-medium transform transition-all hover:scale-105"
                >
                  Try Now for Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  className="px-8 py-6 text-lg group"
                >
                  <PlayCircle className="h-5 w-5 mr-2 group-hover:text-blue-600 transition-colors" />
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-4 pt-8">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800" />
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 text-center">
                  <p className="font-medium">Trusted by 5000+ medical professionals</p>
                  <div className="flex items-center justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-1">4.9/5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute -right-64 -top-64 w-[600px] h-[600px] bg-blue-50 dark:bg-blue-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute -left-64 bottom-0 w-[500px] h-[500px] bg-purple-50 dark:bg-purple-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={staggerContainer}
            ref={ref}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm px-4 py-2 rounded-full mb-4">
              Powerful Features
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced Diagnostic Capabilities
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive medical imaging analysis powered by cutting-edge AI technology
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="h-8 w-8 text-blue-600" />} 
              title="Brain MRI Analysis"
              description="Advanced detection of tumors, hemorrhages, and other neurological conditions with 97% accuracy."
              delay={0.1}
            />
            <FeatureCard 
              icon={<Bone className="h-8 w-8 text-green-600" />} 
              title="Bone Fracture Detection"
              description="Instant identification of fractures and bone abnormalities from X-ray and CT scans."
              delay={0.2}
            />
            <FeatureCard 
              icon={<HeartPulse className="h-8 w-8 text-red-600" />} 
              title="Cardiac Analysis"
              description="Comprehensive heart health assessment from CT and MRI scans."
              delay={0.3}
            />
            <FeatureCard 
              icon={<Eye className="h-8 w-8 text-purple-600" />} 
              title="Retinal Scan Analysis"
              description="Early detection of diabetic retinopathy and other eye conditions."
              delay={0.4}
            />
            <FeatureCard 
              icon={<Stethoscope className="h-8 w-8 text-yellow-600" />} 
              title="Lung Nodule Detection"
              description="Accurate identification of pulmonary nodules from CT scans."
              delay={0.5}
            />
            <FeatureCard 
              icon={<BarChart2 className="h-8 w-8 text-indigo-600" />} 
              title="Blood Sugar Analysis"
              description="Track and analyze blood sugar levels with intelligent insights."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-200/50 dark:bg-grid-gray-800/50 [mask-image:linear-gradient(0deg,transparent,white,white,transparent)] dark:[mask-image:linear-gradient(0deg,transparent,black,black,transparent)]" />
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={staggerContainer}
            ref={ref}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { 
                number: '95%', 
                label: 'Accuracy Rate',
                description: 'Industry-leading accuracy for reliable diagnostics'
              },
              { 
                number: '50K+', 
                label: 'Scans Analyzed',
                description: 'Trusted by medical professionals worldwide'
              },
              { 
                number: '1K+', 
                label: 'Healthcare Partners',
                description: 'Leading hospitals and clinics using our platform'
              },
              { 
                number: '24/7', 
                label: 'Support',
                description: 'Dedicated team ready to assist you anytime'
              },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  {stat.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {stat.label}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-200/50 dark:bg-grid-gray-800/50 [mask-image:linear-gradient(0deg,transparent,white,darkgray)] dark:[mask-image:linear-gradient(0deg,transparent,black,black)]" />
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div 
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={staggerContainer}
            ref={ref}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm px-4 py-2 rounded-full mb-4">
              Simple Process
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get accurate diagnostic results in just a few simple steps
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Upload Your Scans',
                description: 'Easily upload DICOM or standard image files',
                icon: <Upload className="h-8 w-8 text-white" />
              },
              {
                step: '2',
                title: 'AI Analysis',
                description: 'Our advanced algorithms process your scans',
                icon: <Activity className="h-8 w-8 text-white" />
              },
              {
                step: '3',
                title: 'Get Results',
                description: 'Receive detailed diagnostic reports',
                icon: <FileText className="h-8 w-8 text-white" />
              }
            ].map((item, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-75 group-hover:opacity-100 blur transition duration-200" />
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg h-full">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 dark:bg-gray-800 rounded-full mb-6">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Secure & Compliant</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Your data security is our top priority. We adhere to the highest industry standards.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { name: 'HIPAA Compliant', icon: <ShieldCheck className="h-10 w-10 text-green-500" /> },
              { name: 'Data Encrypted', icon: <ShieldCheck className="h-10 w-10 text-blue-500" /> },
              { name: 'Secure Cloud', icon: <ShieldCheck className="h-10 w-10 text-purple-500" /> },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="mb-3">{item.icon}</div>
                <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 transform -skew-y-3 -z-0" />
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(transparent,white,transparent)]" />
        
        <div className="relative max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full mb-6">
              Get Started Today
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your diagnostic workflow?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of healthcare professionals using our AI-powered diagnostic tools to deliver better patient outcomes.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/upload">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-medium transform transition-all hover:scale-105">
                  Try It Free
                </Button>
              </Link>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 px-8 py-6 text-lg group">
                Request Demo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <div className="mt-10 pt-8 border-t border-white/10">
              <div className="flex flex-wrap justify-center gap-x-10 gap-y-6">
                {[
                  { icon: <Shield className="h-6 w-6 text-white" />, text: 'HIPAA Compliant' },
                  { icon: <Zap className="h-6 w-6 text-white" />, text: 'Instant Results' },
                  { icon: <Clock className="h-6 w-6 text-white" />, text: '24/7 Support' },
                  { icon: <BarChart className="h-6 w-6 text-white" />, text: 'Analytics Dashboard' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {item.icon}
                    <span className="text-white/90">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MedInsight AI</h3>
              <p className="text-gray-400">Advanced medical imaging analysis powered by artificial intelligence.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'API', 'Integrations'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                {['Documentation', 'Guides', 'Blog', 'Support'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                {['About', 'Careers', 'Contact', 'Privacy Policy'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} MedInsight AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
