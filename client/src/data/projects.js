import lookupImg from '../assets/lookup.png';

import railwayImg from '../assets/railway.png';

export const projects = [
  {
    id: 1,
    name: 'Kanku.in',
    category: 'E-Commerce',
    description: 'A full-featured e-commerce platform with complex product filtering, seamless checkout, and integrated payment gateways.',
    image: '',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Stripe'],
    link: 'https://github.com/AhmedKhatri06/Kanku.in'
  },
  {
    id: 2,
    name: 'LookUp',
    category: 'Web Application',
    description: 'A multi-search web application that aggregates data from various sources into a single, highly performant dashboard.',
    image: lookupImg,
    technologies: ['React', 'Vite', 'REST APIs', 'CSS3'],
    link: 'https://github.com/AhmedKhatri06/LookUp'
  },
  {
    id: 3,
    name: 'Rail Ticket Booking UI',
    category: 'UI/UX',
    description: 'A modern rail ticket booking interface focused on making train travel planning simple and user-friendly. Includes key booking flows like searching trains, selecting routes, choosing seats, and completing the payment process.',
    image: railwayImg,
    technologies: ['Figma', 'UI/UX', 'Prototyping'],
    link: 'https://www.figma.com/design/Z56ZLysRCDvkx7RBmiyDIw/Rail-ticket-booking--Community-?node-id=0-1&p=f&t=hBfc48EYKdMuf0R4-0'
  }
];
