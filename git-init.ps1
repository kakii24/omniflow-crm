Remove-Item -Recurse -Force .git

git init
git config user.name "OmniFlow Dev"
git config user.email "dev@omniflow.com"

# Unstage everything just in case
git reset

# 1. Initial setup
git add package.json package-lock.json tsconfig.json next.config.ts .gitignore public/ postcss.config.mjs eslint.config.mjs README.md
git commit -m "chore: initial Next.js 14 setup with Tailwind CSS"

# 2. Auth infrastructure
git add lib/ middleware.ts app/login/
git commit -m "feat(auth): integrate Supabase SSR client and edge middleware"

# 3. Core UI and Landing Page
git add app/globals.css app/layout.tsx app/page.tsx app/components/Navbar.tsx app/components/HeroSection.tsx app/components/FeaturesSection.tsx app/components/Footer.tsx
git commit -m "feat(ui): implement premium minimalist Apple-style landing page"

# 4. Dashboard layout
git add app/dashboard/
git commit -m "feat(dashboard): build responsive metrics layout with KPI bento cards"

# 5. Inventory Table UI
git add app/components/InventoryTableClient.tsx
git commit -m "feat(inventory): create dynamic data tables for hardware assessment"

# 6. Modal Component
git add app/components/AddInventoryModal.tsx
git commit -m "feat(form): add Framer Motion sliding modal for data entry"

# 7. Server Actions
git add app/actions/
git commit -m "feat(backend): implement Server Actions for secure database mutations"

# 8. Everything else
git add .
git commit -m "fix(db): resolve RLS constraints and finalize data pipeline"

# 9. Force push to the existing remote
git remote add origin https://github.com/kakii24/omniflow-crm.git
git push -u origin master --force
