# **App Name**: SkillSwapper

## Core Features:

- User Authentication: Enable users to register and log in using Firebase Authentication (email/password). Protect routes to ensure only logged-in users can request skill swaps.
- User Profiles: Allow users to create and manage profiles with name, skills offered, skills wanted, and availability. Implement a toggle to make profiles public or private.
- Search and Browse: Enable users to search and browse public profiles based on skills. Display profile cards with essential information and a 'Request' button.
- Skill Swap Requests: Allow logged-in users to request skill swaps, specify skills to offer/request, and send messages. Track swap status (Pending, Accepted, Rejected) and enable cancellation for pending requests.
- Feedback and Rating: After a skill swap, allow users to rate each other and provide feedback. This will help to build trust within the SkillSwapper community.
- Skill Recommendation: Provide skill recommendations using a generative AI tool, based on the user's existing skills and interests, to suggest potential new skills to learn or offer.

## Style Guidelines:

- Primary color: Deep purple (#6750A4), evokes creativity and skillfulness. 
- Background color: Light purple (#E9DDF7), providing a soft and clean backdrop. 
- Accent color: A bright violet (#9150A4) as an accent color, drawing the eye.
- Body and headline font: 'Inter', sans-serif, for a modern, neutral, clean feel. 
- Use consistent, minimalist icons from a set like Phosphor or Tabler Icons. Ensure icons are intuitive and support accessibility. 
- Employ a mobile-first, responsive design using TailwindCSS grid and flexbox. Ensure content reflows smoothly across devices. Use breakpoints effectively to adapt the layout. 
- Subtle animations and transitions using Framer Motion for a smooth and engaging user experience. Implement page transitions, button hover effects, and modal animations.