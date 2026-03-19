import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { events, insights } from "../lib/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const seedEvents = [
  {
    title: "Annual Dental Career Fair 2026",
    description: "Connect with dental schools, residency programs, and industry professionals. Network, learn about admissions, and explore career paths in dentistry.",
    date: "2026-04-12",
    endDate: "2026-04-13",
    time: "10:00",
    location: "Toronto Convention Centre",
    category: "Career",
    registrationUrl: "https://example.com/career-fair",
    featured: true,
    published: true,
  },
  {
    title: "Hands-On Suturing Workshop",
    description: "Learn basic suturing techniques used in oral surgery. Materials and guidance provided by fourth-year dental students.",
    date: "2026-04-20",
    time: "14:00",
    location: "Health Sciences Building, Room 204",
    category: "Workshop",
    featured: false,
    published: true,
  },
  {
    title: "DAT Prep Study Group Kickoff",
    description: "Join our structured DAT preparation group. We cover biology, chemistry, perceptual ability, and reading comprehension over 8 weeks.",
    date: "2026-05-01",
    time: "18:00",
    location: "Scott Library, Room 312",
    category: "Academic",
    featured: true,
    published: true,
  },
  {
    title: "Guest Speaker: Dr. Amira Hassan — Pediatric Dentistry",
    description: "Dr. Hassan shares her journey from pre-dental student to running a pediatric dental clinic in underserved communities.",
    date: "2026-05-10",
    time: "17:30",
    location: "Lassonde Building, Auditorium B",
    category: "Speaker",
    featured: false,
    published: true,
  },
  {
    title: "Spring Social & Mixer",
    description: "Wrap up the semester with fellow ADS members. Food, games, and networking in a relaxed setting. All members welcome.",
    date: "2026-05-18",
    time: "19:00",
    location: "The Absinthe Pub, York University",
    category: "Social",
    featured: false,
    published: true,
  },
  {
    title: "Dental School Application Panel",
    description: "Hear from recently admitted dental students about their application experience, interviews, and what made their applications stand out.",
    date: "2026-06-05",
    time: "16:00",
    location: "Virtual — Zoom",
    category: "Academic",
    featured: true,
    published: true,
  },
  {
    title: "Community Oral Health Screening",
    description: "Volunteer alongside licensed dentists to provide free oral health screenings at the Jane-Finch Community Centre.",
    date: "2026-06-14",
    time: "09:00",
    location: "Jane-Finch Community Centre",
    category: "Volunteer",
    registrationUrl: "https://example.com/volunteer-signup",
    featured: false,
    published: true,
  },
  {
    title: "Impression Taking & Moulding Lab",
    description: "Get hands-on experience with alginate impressions and dental stone casting. Limited spots available — register early.",
    date: "2026-06-22",
    time: "13:00",
    location: "Bethune College, Lab 105",
    category: "Workshop",
    registrationUrl: "https://example.com/moulding-lab",
    featured: false,
    published: true,
  },
  {
    title: "Summer Research Opportunities Info Session",
    description: "Learn about summer research positions in dental biomaterials, oral pathology, and public health dentistry at partner institutions.",
    date: "2026-07-03",
    time: "15:00",
    location: "Virtual — Zoom",
    category: "Academic",
    featured: false,
    published: true,
  },
  {
    title: "ADS Welcome Back BBQ — Fall 2026",
    description: "Kick off the new academic year with Atlantis Dental Society! Meet new members, reconnect with returning ones, and enjoy a BBQ on the quad.",
    date: "2026-09-10",
    time: "12:00",
    location: "Vari Hall Quad, York University",
    category: "Social",
    featured: true,
    published: true,
  },
];

const seedInsights = [
  {
    title: "How I Scored a 25 AA on the DAT",
    slug: "how-i-scored-25-aa-dat",
    excerpt: "A breakdown of my 4-month study plan, resources, and strategies that helped me achieve a competitive DAT score.",
    body: "# My DAT Journey\n\nPreparing for the DAT was one of the most challenging experiences of my undergraduate career. Here's exactly how I approached it.\n\n## Study Schedule\n\nI dedicated 4 months of focused preparation, studying 4-6 hours daily while maintaining a part-time course load.\n\n## Resources I Used\n\n- DAT Bootcamp for practice tests\n- Feralis Biology Notes\n- Chad's Videos for chemistry\n- Generator for PAT practice\n\n## Key Takeaways\n\nConsistency beats intensity. I studied every single day without exception, even if some days were only 2 hours.",
    author: "Sarah Chen",
    authorPosition: "4th Year Biology",
    category: "DAT Prep",
    published: true,
    publishedDate: "2026-01-15",
  },
  {
    title: "5 Things I Wish I Knew Before Applying to Dental School",
    slug: "5-things-before-dental-school",
    excerpt: "From GPA requirements to extracurriculars, here are the things that surprised me most about the dental school application process.",
    body: "# What Nobody Told Me\n\nThe dental school application process is unlike anything else. Here are five things I learned the hard way.\n\n## 1. Your GPA Matters More Than You Think\n\nMost Canadian dental schools have hard GPA cutoffs.\n\n## 2. Shadowing Hours Add Up\n\nStart early — you'll need 100+ hours.\n\n## 3. The Interview is Everything\n\nOnce you meet the academic cutoffs, the interview determines your fate.\n\n## 4. Research Experience Stands Out\n\n## 5. Community Involvement is Non-Negotiable",
    author: "Marcus Williams",
    authorPosition: "ADS Vice President",
    category: "Admissions",
    published: true,
    publishedDate: "2026-01-28",
  },
  {
    title: "A Day in the Life of a First-Year Dental Student",
    slug: "day-in-life-dental-student",
    excerpt: "We followed a first-year student at UofT Dentistry through a typical day — from 7am sim lab to evening study sessions.",
    body: "# 7:00 AM — Wake Up\n\nThe alarm goes off and it's time for another day at the Faculty of Dentistry.\n\n# 8:30 AM — Simulation Lab\n\nToday we're practicing cavity preparations on typodont teeth.\n\n# 12:00 PM — Lunch & Study Group\n\n# 1:30 PM — Anatomy Lecture\n\n# 4:00 PM — Clinic Observation\n\n# 7:00 PM — Evening Review\n\nDental school is intense but incredibly rewarding.",
    author: "Priya Patel",
    authorPosition: "Guest Contributor",
    category: "Student Life",
    published: true,
    publishedDate: "2026-02-10",
  },
  {
    title: "The Importance of Dental Outreach in Underserved Communities",
    slug: "dental-outreach-underserved-communities",
    excerpt: "Why community service should be at the heart of every aspiring dentist's journey, and how ADS is making an impact.",
    body: "# Beyond the Clinic\n\nOral health is deeply connected to overall health, yet millions of Canadians lack access to basic dental care.\n\n## The Problem\n\nOver 6 million Canadians avoid the dentist due to cost.\n\n## What ADS Is Doing\n\nOur community screening events have reached over 200 people this year alone.\n\n## How You Can Help\n\nVolunteer with us at our next community event.",
    author: "Jordan Lee",
    authorPosition: "Outreach Coordinator",
    category: "Community",
    published: true,
    publishedDate: "2026-02-22",
  },
  {
    title: "Comparing Canadian Dental Schools: What to Consider",
    slug: "comparing-canadian-dental-schools",
    excerpt: "An honest look at the differences between UofT, Western, McGill, UBC, and other Canadian dental programs.",
    body: "# Choosing the Right School\n\nCanada has 10 dental schools, each with unique strengths.\n\n## Location & Cost\n\nTuition ranges dramatically across provinces.\n\n## Curriculum Style\n\nSome schools are PBL-focused while others use traditional lectures.\n\n## Clinical Exposure\n\nEarly clinical exposure varies significantly.\n\n## Class Size & Culture\n\nSmaller classes often mean closer mentorship.",
    author: "Aaliyah Thompson",
    authorPosition: "ADS President",
    category: "Admissions",
    published: true,
    publishedDate: "2026-03-01",
  },
  {
    title: "Research Spotlight: Biomaterials in Modern Dentistry",
    slug: "research-spotlight-biomaterials",
    excerpt: "How new composite resins and ceramic materials are changing the landscape of restorative dentistry.",
    body: "# The Materials Revolution\n\nDental materials have evolved dramatically in the past decade.\n\n## Composite Resins\n\nModern composites offer better aesthetics and durability than ever before.\n\n## Ceramics\n\nZirconia-based restorations are becoming the gold standard for crowns and bridges.\n\n## What This Means for Students\n\nUnderstanding biomaterials gives pre-dental students a competitive edge in interviews.",
    author: "Dr. Kevin Zhao",
    authorPosition: "Faculty Advisor",
    category: "Research",
    published: true,
    publishedDate: "2026-03-05",
  },
  {
    title: "Mental Health in Pre-Dental Students: Breaking the Silence",
    slug: "mental-health-pre-dental",
    excerpt: "The pressure of maintaining a high GPA while preparing for the DAT takes a toll. Here's how to manage it.",
    body: "# It's Okay to Struggle\n\nThe pre-dental journey is stressful. Acknowledging that is the first step.\n\n## Common Challenges\n\n- Academic pressure and competition\n- Imposter syndrome\n- Balancing work, school, and volunteering\n\n## Strategies That Help\n\n- Set boundaries around study time\n- Find a support network\n- Use campus mental health resources\n\n## ADS Support\n\nWe host peer support circles every month.",
    author: "Natasha Rivera",
    authorPosition: "Wellness Chair",
    category: "Wellness",
    published: true,
    publishedDate: "2026-03-10",
  },
  {
    title: "From Biology Major to Dental School: My Non-Linear Path",
    slug: "biology-to-dental-school",
    excerpt: "I didn't always want to be a dentist. Here's how a gap year and a volunteer trip changed my career trajectory.",
    body: "# The Unexpected Journey\n\nI started university as a biology major with plans for med school.\n\n## The Gap Year\n\nAfter third year, I took a gap year to volunteer abroad.\n\n## The Turning Point\n\nA dental clinic in rural Guatemala showed me the transformative power of oral healthcare.\n\n## Making the Switch\n\nI came back, joined ADS, and started shadowing dentists.\n\n## Where I Am Now\n\nI'm now in my first year at Western Dentistry.",
    author: "Daniel Okafor",
    authorPosition: "Alumni",
    category: "Student Life",
    published: true,
    publishedDate: "2026-03-14",
  },
  {
    title: "Interview Prep: CDA Structured Interview Tips",
    slug: "cda-interview-tips",
    excerpt: "Practical strategies for acing the CDA Structured Interview used by most Canadian dental schools.",
    body: "# Mastering the CDA Interview\n\nThe CDA Structured Interview is your chance to show who you are beyond your GPA.\n\n## Format Overview\n\nYou'll face 7-8 stations, each 8 minutes long.\n\n## Station Types\n\n- Ethical scenarios\n- Communication exercises\n- Personal questions\n\n## Top Tips\n\n1. Practice with a timer\n2. Use the STAR method\n3. Show empathy, not just logic\n4. Be genuine — interviewers can spot rehearsed answers",
    author: "Sarah Chen",
    authorPosition: "4th Year Biology",
    category: "Admissions",
    published: true,
    publishedDate: "2026-03-18",
  },
  {
    title: "ADS Year in Review: 2025-2026 Highlights",
    slug: "ads-year-in-review-2025-2026",
    excerpt: "A look back at our biggest events, milestones, and the community we've built over the past academic year.",
    body: "# What a Year\n\nFrom our first meeting in September to our final social in April, this year has been incredible.\n\n## By the Numbers\n\n- 150+ active members\n- 12 events hosted\n- 200+ community members screened\n- 3 dental school partnerships\n\n## Highlights\n\n- Our first-ever Dental Career Fair\n- The suturing workshop series\n- Community screening at Jane-Finch\n\n## Looking Ahead\n\nNext year we're planning even bigger things. Stay tuned.",
    author: "Aaliyah Thompson",
    authorPosition: "ADS President",
    category: "Club News",
    published: true,
    publishedDate: "2026-03-19",
  },
];

async function seed() {
  console.log("Seeding events...");
  for (const event of seedEvents) {
    await db.insert(events).values(event);
  }
  console.log(`  ${seedEvents.length} events created`);

  console.log("Seeding insights...");
  for (const insight of seedInsights) {
    await db.insert(insights).values(insight);
  }
  console.log(`  ${seedInsights.length} insights created`);

  console.log("Done!");
}

seed().catch(console.error);
