import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import PricingPlan from '../models/PricingPlan.js';
import Testimonial from '../models/Testimonial.js';
import BlogPost from '../models/BlogPost.js';
import User from '../models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI not set in environment.');
      process.exit(1);
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected.');

    // 1. Seed Services
    const servicesCount = await Service.countDocuments();
    if (servicesCount === 0) {
      console.log('Seeding initial Services...');
      await Service.create([
        {
          name: 'Custom Web Applications',
          slug: 'custom-web-applications',
          description: 'Tailored, responsive, and resilient full-stack web applications built using the modern MERN stack.',
          startingPrice: '₹35,000',
          icon: 'Code',
          order: 1,
          active: true
        },
        {
          name: 'E-Commerce & Digital Storefronts',
          slug: 'ecommerce-storefronts',
          description: 'High-converting, lightning-fast online stores with secure checkout, inventory management, and analytics.',
          startingPrice: '₹45,000',
          icon: 'ShoppingBag',
          order: 2,
          active: true
        },
        {
          name: 'API & Cloud Architecture',
          slug: 'api-cloud-architecture',
          description: 'Secure, high-throughput RESTful microservices, third-party integrations, and scalable cloud deployments.',
          startingPrice: '₹25,000',
          icon: 'Server',
          order: 3,
          active: true
        }
      ]);
      console.log('Services seeded successfully.');
    } else {
      console.log(`Services collection already has ${servicesCount} items.`);
    }

    // 2. Seed Projects
    const projectsCount = await Project.countDocuments();
    if (projectsCount === 0) {
      console.log('Seeding initial Projects...');
      await Project.create([
        {
          name: 'Nexus Analytics SaaS Dashboard',
          category: 'SaaS / Web App',
          description: 'Real-time telemetry and revenue metrics dashboard featuring custom interactive charting and team workspaces.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
          technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'TailwindCSS'],
          link: 'https://mern-craft.vercel.app'
        },
        {
          name: 'Aura Luxe E-Commerce Platform',
          category: 'E-Commerce',
          description: 'Luxury lifestyle storefront with instantaneous search, cart persistence, and Stripe payment gateway integration.',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
          technologies: ['React', 'Express', 'MongoDB', 'Stripe'],
          link: 'https://mern-craft.vercel.app'
        },
        {
          name: 'Optima Health Patient Portal',
          category: 'Healthcare / Portal',
          description: 'HIPAA-compliant telemedicine portal for scheduling, encrypted medical records, and live physician consultations.',
          image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
          technologies: ['React', 'Node.js', 'MongoDB', 'WebRTC'],
          link: 'https://mern-craft.vercel.app'
        }
      ]);
      console.log('Projects seeded successfully.');
    } else {
      console.log(`Projects collection already has ${projectsCount} items.`);
    }

    // 3. Seed Pricing Plans
    const pricingCount = await PricingPlan.countDocuments();
    if (pricingCount === 0) {
      console.log('Seeding initial Pricing Plans...');
      await PricingPlan.create([
        {
          tier: 'Starter Launch',
          price: '₹19,999',
          description: 'Ideal for early-stage startups and small businesses needing a rapid, polished market presence.',
          features: [
            'Up to 5 Responsive Pages',
            'Modern UI/UX Design with Smooth Animations',
            'Contact & Inquiry Lead Capture',
            'SEO & Mobile Optimization',
            'Basic Deployment & Domain Setup',
            '1 Month Maintenance & Support'
          ],
          isPopular: false
        },
        {
          tier: 'Professional Growth',
          price: '₹44,999',
          description: 'Full-featured dynamic web application tailored for growing digital products and service businesses.',
          features: [
            'Full-Stack MERN Architecture',
            'Custom Admin Dashboard & CMS',
            'User Authentication & Protected Dashboards',
            'Database Modeling & Secure REST APIs',
            'Lead Management & Email Notifications',
            'Priority 3 Months Support'
          ],
          isPopular: true
        },
        {
          tier: 'Enterprise Custom',
          price: 'Custom',
          description: 'End-to-end bespoke digital engineering for organizations with complex requirements.',
          features: [
            'Tailored Scalable Microservices Architecture',
            'Third-Party Integrations & Custom Payments',
            'High-Concurrency Database Optimization',
            'End-to-End Security Hardening & Audit',
            'Dedicated Lead Developer & SLA Support',
            'Full Source Ownership & Handover'
          ],
          isPopular: false
        }
      ]);
      console.log('Pricing plans seeded successfully.');
    } else {
      console.log(`Pricing plans collection already has ${pricingCount} items.`);
    }

    // 4. Seed Testimonials
    const testimonialsCount = await Testimonial.countDocuments();
    if (testimonialsCount === 0) {
      console.log('Seeding initial Testimonials...');
      await Testimonial.create([
        {
          clientName: 'Sarah Jenkins',
          company: 'Nexus Analytics Ltd.',
          review: 'MernCraft delivered our customer dashboard ahead of schedule. The code quality, speed, and responsiveness of the team were world-class.',
          rating: 5
        },
        {
          clientName: 'Rahul Mehta',
          company: 'Aura Retail',
          review: 'Working with MernCraft was a game changer for our online business. Our customer checkout conversions increased by 40% after the redesign.',
          rating: 5
        },
        {
          clientName: 'David Chen',
          company: 'Optima Health Tech',
          review: 'Top-tier MERN stack engineers. Their attention to detail on API security and clean user experience was outstanding throughout the project.',
          rating: 5
        }
      ]);
      console.log('Testimonials seeded successfully.');
    } else {
      console.log(`Testimonials collection already has ${testimonialsCount} items.`);
    }

    // 5. Seed Initial Blog Post
    const blogCount = await BlogPost.countDocuments();
    if (blogCount === 0) {
      console.log('Seeding initial Blog Post...');
      const adminUser = await User.findOne({ role: 'admin' });
      await BlogPost.create({
        title: 'Building Scalable Full-Stack Web Applications with MERN in 2026',
        slug: 'building-scalable-mern-apps-2026',
        excerpt: 'Key design patterns, security essentials, and architectural decisions required to ship production-grade MERN web apps.',
        content: 'Building scalable modern web applications requires a holistic focus on architecture, performance, and security. In this guide, we dive deep into schema design, JWT session hygiene, rate limiting, and component modularity for production MERN platforms...',
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        category: 'Web Development',
        tags: ['MERN', 'React', 'Node.js', 'Architecture'],
        author: adminUser?._id,
        status: 'published'
      });
      console.log('Blog post seeded successfully.');
    } else {
      console.log(`Blog collection already has ${blogCount} items.`);
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
