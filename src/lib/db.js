
import bcrypt from 'bcryptjs';

// Generate this EXACT hash for "noozmarch06"
// Run: node -e "console.log(require('bcryptjs').hashSync('noozmarch06', 10))"
const hashedPassword = '$2b$10$CQWrFkJPhQ028VOzx3DenewO6lO9keoRDHOlSS1F7szced1lEaB6e';

export const users = [
  {
    id: 1,
    email: "noorzohbi8@gmail.com",
    password: "hashedPassword",
    role: "admin"
  },
  {
    id: 2,
    email: "admin4180@gmail.com", 
    password: hashedPassword,
    role: "admin"
  }
];

export const jobs = [
  {
    id: 1,
    title: "React Developer",
    company: "Tech Corp",
    location: "Remote",
    salary: "$80k",
    description: "Build React applications",
    image: "https://picsum.photos/id/100/80/80"
  },
  {
    id: 2,
    title: "Marketing Assistant",
    company: "Brand Co",
    location: "New York",
    salary: "$50k",
    description: "Create marketing campaigns",
    image: "https://picsum.photos/id/20/80/80"
  },
  {
    id: 3,
    title: "Customer Support",
    company: "Service Inc",
    location: "Chicago",
    salary: "$40k",
    description: "Help customers with issues",
    image: "https://picsum.photos/id/26/80/80"
  }
];