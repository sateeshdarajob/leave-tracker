//This is an application to track teams leaves and Steps below to run and use it.

Double click on the batch file - proxyrun.bat

Open URL in Browser - http://localhost:5000/


Some important setup details -->
===================================
How do I run this in my local machine and start using it?

    Here's a step-by-step guide to run this leave tracker app on your local machine:

Prerequisites
Node.js installed (v16 or later recommended)
npm or yarn (comes with Node.js)
Code editor (VS Code recommended)

Step-by-Step Setup
===================
Create a new Next.js project (if you don't have one):--------
npx create-next-app@latest leave-tracker
cd leave-tracker

Install required dependencies:-----------
npm install date-fns lucide-react
npm install @radix-ui/react-popover @radix-ui/react-slot class-variance-authority clsx tailwind-merge

Set up Shadcn UI components (if not already set up):---------
npx shadcn@latest init
Follow the prompts to configure your styling preferences.

Add individual Shadcn components:--------------
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add calendar
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add label

Create the component file:-----------
Create a new file at app/monthly-leave-tracker.tsx
Copy the entire code from my previous response into this file

Update your main page (optional): Edit app/page.tsx to include your component:----------
import MonthlyLeaveDatesTracker from './monthly-leave-tracker'

export default function Home() {
  return <MonthlyLeaveDatesTracker />
}

Run the development server:----------
npm run dev

Access the application: Open your browser and visit:--------

http://localhost:3000 or http://localhost:5000 (if you run batch file)

//Now you are all set to use application
