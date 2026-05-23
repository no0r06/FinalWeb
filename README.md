markdown
# Job Board Platform

A full-stack job board application with authentication, 2FA, role-based access control, and complete CRUD operations for job postings.

## 🚀 Features

- **Authentication**: JWT-based authentication with httpOnly cookies
- **2FA**: One-Time Password (OTP) verification for secure login
- **Bot Protection**: Cloudflare Turnstile integration
- **Role-Based Access**: Admin can create/edit/delete jobs, users can only view
- **Full CRUD Operations**: Complete job management for admin users
- **Responsive Design**: Modern black/red themed UI with animations

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Authentication | JWT (jose library) |
| Password Encryption | bcryptjs |
| 2FA | OTP with in-memory storage |
| Bot Protection | Cloudflare Turnstile |
| Email Service | Resend (or terminal logging for development) |
| Styling | CSS-in-JS (inline styles) |
| Deployment | Vercel / Netlify |
| CI/CD | GitHub Actions |

## 📁 Project Structure
src/
├── app/
│ ├── api/
│ │ ├── auth/
│ │ │ ├── login/route.js # Step 1: Verify credentials
│ │ │ ├── verify-otp/route.js # Step 2: Verify OTP
│ │ │ ├── me/route.js # Get current user
│ │ │ └── logout/route.js # Clear session
│ │ └── jobs/
│ │ ├── route.js # GET all, POST new
│ │ └── [id]/route.js # GET one, PUT, DELETE
│ ├── login/page.jsx # Login page with Turnstile
│ ├── verify-otp/page.jsx # OTP verification page
│ └── page.jsx # Job board dashboard
├── lib/
│ ├── auth/jwt.js # JWT sign/verify functions
│ ├── db.js # In-memory data store
│ ├── generateOTP.js # OTP generator
│ ├── otpStore.js # Temporary OTP storage
│ └── sendEmail.js # Email sending (Resend)
├── middleware.js # Route protection
└── .env.local # Environment variables

text

## 🔐 Environment Variables

Create `.env.local` file:

```env
JWT_SECRET=your_jwt_secret_here
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
RESEND_API_KEY=your_resend_api_key (optional)
🧪 Test Credentials
Role	Email	Password
Admin	admin4180@gmail.com	noozmarch06
User	user@example.com	user123
🚦 Authentication Flow
text
1. User visits /login
2. Completes Cloudflare Turnstile
3. Enters email + password
4. Server verifies credentials
5. Server generates 6-digit OTP
6. OTP sent to email (or logged to terminal)
7. User enters OTP at /verify-otp
8. Server issues JWT in httpOnly cookie
9. User redirected to job board
📦 Installation
bash
# Clone repository
git clone https://github.com/no0r06/FinalWeb.git
cd FinalWeb

# Install dependencies
npm install

# Create .env.local (see above)
# Run development server
npm run dev
🚀 Deployment
Deploy to Vercel (Recommended)
Push code to GitHub

Import project at vercel.com

Add environment variables

Deploy

Deploy to Netlify
Push code to GitHub

Import project at netlify.com

Add environment variables

Build command: npm run build

Publish directory: .next

🔄 CI/CD Pipeline
GitHub Actions runs on every push to dev and main:

Lints code

Runs build

Vercel auto-deploys on main merge

👥 Roles
Role	Permissions
Admin	Create, edit, delete jobs
User	View jobs only
📝 API Endpoints
Method	Endpoint	Description	Access
POST	/api/auth/login	Login + send OTP	Public
POST	/api/auth/verify-otp	Verify OTP + issue JWT	Public
GET	/api/auth/me	Get current user	Authenticated
POST	/api/auth/logout	Logout	Authenticated
GET	/api/jobs	Get all jobs	Public
POST	/api/jobs	Create job	Admin
PUT	/api/jobs/[id]	Update job	Admin
DELETE	/api/jobs/[id]	Delete job	Admin
⚠️ Development Notes
OTP emails use Resend (requires API key)

Without Resend key, OTP logs to terminal

Passwords are hashed with bcrypt

JWT stored in httpOnly cookie for security

📄 License
MIT

👨‍💻 Author
Your Name

text

---

## Save this as `README.md` in your project root

```bash
# Create README
cat > README.md << 'EOF'
[paste the content above]
EOF

# Add, commit, push
git add README.md
git commit -m "Add comprehensive README"
git push origin dev
https://chatgpt.com/share/6a11c3fa-02b0-83eb-8835-ea8ce561b564
https://chat.deepseek.com/share/uloeh0q7bilewl60hs
