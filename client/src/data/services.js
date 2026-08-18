import { Monitor, ShoppingCart, Code, LayoutDashboard, Database, Smartphone, PenTool, Wrench } from 'lucide-react';

export const services = [
  {
    id: 'business-website',
    title: 'Business Website Development',
    description: 'Professional, SEO-optimized websites designed to establish your brand, build trust, and acquire clients.',
    icon: Monitor,
    features: ['Responsive UI', 'Custom pages', 'Contact forms', 'WhatsApp integration', 'SEO-ready structure']
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Development',
    description: 'Scalable online stores with seamless checkout, secure payments, and inventory management.',
    icon: ShoppingCart,
    features: ['Product catalogue', 'Shopping cart & Checkout', 'Payment gateway integration', 'User authentication', 'Order management']
  },
  {
    id: 'custom-web-app',
    title: 'Custom Web Applications',
    description: 'Complex, interactive web apps tailored to your unique business workflows and operations.',
    icon: Code,
    features: ['CRM systems', 'Booking platforms', 'Customer portals', 'SaaS products', 'Internal tools']
  },
  {
    id: 'admin-dashboard',
    title: 'Admin Dashboard Development',
    description: 'Secure and intuitive admin panels to manage your business data, users, and analytics.',
    icon: LayoutDashboard,
    features: ['Authentication', 'User management', 'Data visualization', 'Reports & Export', 'Role-based access']
  },
  {
    id: 'api-backend',
    title: 'API & Backend Development',
    description: 'Robust server-side architectures, databases, and REST APIs to power your digital products.',
    icon: Database,
    features: ['RESTful APIs', 'Database architecture', 'Third-party integrations', 'High security', 'Cloud deployment']
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design & Development',
    description: 'Engaging, conversion-focused user interfaces built with modern design principles.',
    icon: Smartphone,
    features: ['Figma prototyping', 'Conversion optimization', 'Accessibility', 'Micro-interactions', 'Design systems']
  },
  {
    id: 'redesign',
    title: 'Website Redesign',
    description: 'Modernize outdated websites into fast, responsive, and aesthetically pleasing experiences.',
    icon: PenTool,
    features: ['Performance audit', 'Visual overhaul', 'Code refactoring', 'Mobile optimization', 'Migration support']
  },
  {
    id: 'maintenance',
    title: 'Maintenance & Support',
    description: 'Ongoing technical support to keep your applications secure, fast, and up-to-date.',
    icon: Wrench,
    features: ['Bug fixing', 'Performance optimization', 'Security patches', 'Monitoring', 'Minor updates']
  }
];
