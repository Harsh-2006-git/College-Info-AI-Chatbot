import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Layers,
  ShieldCheck,
  Search,
  Award,
  HelpCircle,
  Clock,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

/* ========================================================================= */
/* PREMIUM BESPOKE ICONS FOR HERO & SERVICES                                 */
/* ========================================================================= */

// 1. 24/7 Instant Support — Solid Blue Speech Bubble with 3 Dots
const ChatSupportIcon = () => (
  <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#1557D6] flex items-center justify-center shadow-[0_6px_18px_rgba(21,87,214,0.28)] transition-transform group-hover:scale-105">
    <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 11.5C20 16.1944 15.9706 20 11 20C9.62648 20 8.32439 19.708 7.15814 19.1832L3.5 20.5L4.85501 16.9935C3.70773 15.4852 3 13.5937 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 20 6.80558 20 11.5Z"
        fill="white"
      />
      <circle cx="8" cy="11.5" r="1.3" fill="#1557D6" />
      <circle cx="12" cy="11.5" r="1.3" fill="#1557D6" />
      <circle cx="16" cy="11.5" r="1.3" fill="#1557D6" />
    </svg>
  </div>
);

// 2. Academic Information — Solid Blue Graduation Cap
const AcademicCapIcon = () => (
  <div className="w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center transition-transform group-hover:scale-105">
    <svg className="w-10 h-10 sm:w-11 sm:h-11" viewBox="0 0 48 48" fill="none">
      <path d="M24 8L4 18L24 28L44 18L24 8Z" fill="#1557D6" />
      <path d="M12 23V31C12 31 16 37 24 37C32 37 36 31 36 31V23L24 29L12 23Z" fill="#0F46B3" />
      <path d="M41 19.5V30" stroke="#1557D6" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="41" cy="32" r="2.2" fill="#1557D6" />
    </svg>
  </div>
);

// 3. Admission Guidance — Solid Blue Classical Campus Building
const AdmissionBuildingIcon = () => (
  <div className="w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center transition-transform group-hover:scale-105">
    <svg className="w-10 h-10 sm:w-11 sm:h-11" viewBox="0 0 48 48" fill="none">
      <path d="M24 7L8 16H40L24 7Z" fill="#1557D6" />
      <path d="M24 3V7M24 3L28 5L24 7" stroke="#1557D6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="10" y="16" width="28" height="3" fill="#0F46B3" />
      <rect x="11" y="19" width="4.5" height="15" rx="1" fill="#1557D6" />
      <rect x="18.5" y="19" width="4.5" height="15" rx="1" fill="#1557D6" />
      <rect x="26" y="19" width="4.5" height="15" rx="1" fill="#1557D6" />
      <rect x="33.5" y="19" width="4.5" height="15" rx="1" fill="#1557D6" />
      <rect x="8" y="34" width="32" height="3.5" rx="0.5" fill="#0F46B3" />
      <rect x="6" y="37.5" width="36" height="3.5" rx="0.5" fill="#1557D6" />
    </svg>
  </div>
);

// 4. Exams & Results — Solid Blue Clipboard with Checklist & Pen
const ExamsClipboardIcon = () => (
  <div className="w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center transition-transform group-hover:scale-105">
    <svg className="w-10 h-10 sm:w-11 sm:h-11" viewBox="0 0 48 48" fill="none">
      <rect x="10" y="8" width="28" height="34" rx="4" fill="#1557D6" />
      <path d="M18 6C18 4.89543 18.8954 4 20 4H28C29.1046 4 30 4.89543 30 6V9H18V6Z" fill="#0B378F" />
      <circle cx="24" cy="6.5" r="1.2" fill="white" />
      <rect x="14" y="13" width="20" height="24" rx="2" fill="white" />
      <line x1="17" y1="18" x2="28" y2="18" stroke="#1557D6" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="23" x2="28" y2="23" stroke="#1557D6" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="28" x2="24" y2="28" stroke="#1557D6" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 31L29 34L36 26" stroke="#00C853" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// Quick Action Pill Icons
const BookIcon = () => (
  <svg className="w-5 h-5 text-[#1557D6]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5 text-[#1557D6]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C9.24 2 7 4.24 7 7c0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.76-2.24-5-5-5zm0 12c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5 text-[#1557D6]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM7 11h5v5H7z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-5 h-5 text-[#1557D6]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
  </svg>
);

const FacilityIcon = () => (
  <svg className="w-5 h-5 text-[#1557D6]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3L2 8v2h20V8L12 3zM4 11v8h3v-8H4zm6 0v8h4v-8h-4zm7 0v8h3v-8h-3zM2 20v2h20v-2H2z" />
  </svg>
);

/* ========================================================================= */
/* TRUST METRIC & STATS ICONS (EXACT REFERENCE DESIGN)                       */
/* ========================================================================= */

// 1. 100+ Colleges — College Campus Icon
const TrustCollegesIcon = () => (
  <div className="w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-[14px] bg-gradient-to-b from-white to-[#F6FAFF] border border-[#D9E8FC] flex items-center justify-center shadow-[0_4px_16px_rgba(21,87,214,0.07)] flex-shrink-0 group-hover:scale-105 transition-transform">
    <svg className="w-7 h-7 sm:w-[30px] sm:h-[30px]" viewBox="0 0 36 36" fill="none">
      {/* Base Foundation */}
      <rect x="4" y="27" width="28" height="2.2" rx="0.5" fill="#1557D6" />
      <rect x="5.5" y="25" width="25" height="2" rx="0.4" fill="#0F46B3" />

      {/* Left Column / Tower */}
      <path d="M6 13H11V25H6V13Z" fill="#1557D6" />
      <path d="M5.5 13L8.5 9.5L11.5 13H5.5Z" fill="#0F46B3" />
      <rect x="7.8" y="15" width="1.4" height="2.8" rx="0.4" fill="white" />
      <rect x="7.8" y="19.5" width="1.4" height="2.8" rx="0.4" fill="white" />

      {/* Right Column / Tower */}
      <path d="M25 13H30V25H25V13Z" fill="#1557D6" />
      <path d="M24.5 13L27.5 9.5L30.5 13H24.5Z" fill="#0F46B3" />
      <rect x="26.8" y="15" width="1.4" height="2.8" rx="0.4" fill="white" />
      <rect x="26.8" y="19.5" width="1.4" height="2.8" rx="0.4" fill="white" />

      {/* Center Main Building Body */}
      <rect x="11" y="15" width="14" height="10" fill="#1557D6" />
      <path d="M10 15L18 7.5L26 15H10Z" fill="#1557D6" />
      <path d="M18 4.5V7.5M18 4.5L20.5 6L18 7.5" stroke="#1557D6" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Center Arch Entrance */}
      <path d="M15 25V19C15 17.34 16.34 16 18 16C19.66 16 21 17.34 21 19V25H15Z" fill="white" />
      <path d="M16.5 25V20C16.5 19.17 17.17 18.5 18 18.5C18.83 18.5 19.5 19.17 19.5 20V25H16.5Z" fill="#1557D6" />
    </svg>
  </div>
);

// 2. 1M+ Students — Double Users Icon
const TrustStudentsIcon = () => (
  <div className="w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-[14px] bg-gradient-to-b from-white to-[#F6FAFF] border border-[#D9E8FC] flex items-center justify-center shadow-[0_4px_16px_rgba(21,87,214,0.07)] flex-shrink-0 group-hover:scale-105 transition-transform">
    <svg className="w-7 h-7 sm:w-[30px] sm:h-[30px]" viewBox="0 0 36 36" fill="none">
      {/* Front User Head */}
      <circle cx="14" cy="11.5" r="4.2" fill="#1557D6" />
      {/* Front User Body */}
      <path d="M6.5 26.5C6.5 21.8 9.8 18.8 14 18.8C18.2 18.8 21.5 21.8 21.5 26.5H6.5Z" fill="#1557D6" />

      {/* Back User Head */}
      <circle cx="23.5" cy="13" r="3.4" fill="#1557D6" />
      {/* Back User Shoulder Contour */}
      <path d="M21 20.8C23.2 21.4 25.8 23 26.5 26.5" stroke="#1557D6" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
);

// 3. 10M+ Queries Answered — Chat Bubble with 3 Dots
const TrustQueriesIcon = () => (
  <div className="w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-[14px] bg-gradient-to-b from-white to-[#F6FAFF] border border-[#D9E8FC] flex items-center justify-center shadow-[0_4px_16px_rgba(21,87,214,0.07)] flex-shrink-0 group-hover:scale-105 transition-transform">
    <svg className="w-7 h-7 sm:w-[30px] sm:h-[30px]" viewBox="0 0 36 36" fill="none">
      {/* Bubble Outline */}
      <path
        d="M18 7.5C11.3726 7.5 6 12.2 6 18C6 20.24 6.78 22.31 8.11 23.99L7 28L11.21 26.85C13.12 27.88 15.42 28.5 18 28.5C24.6274 28.5 30 23.8 30 18C30 12.2 24.6274 7.5 18 7.5Z"
        stroke="#1557D6"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="white"
      />
      {/* 3 Horizontal Dots */}
      <circle cx="13" cy="18" r="1.4" fill="#1557D6" />
      <circle cx="18" cy="18" r="1.4" fill="#1557D6" />
      <circle cx="23" cy="18" r="1.4" fill="#1557D6" />
    </svg>
  </div>
);

// 4. 99.5% Response Accuracy — Clock Icon
const TrustAccuracyIcon = () => (
  <div className="w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-[14px] bg-gradient-to-b from-white to-[#F6FAFF] border border-[#D9E8FC] flex items-center justify-center shadow-[0_4px_16px_rgba(21,87,214,0.07)] flex-shrink-0 group-hover:scale-105 transition-transform">
    <svg className="w-7 h-7 sm:w-[30px] sm:h-[30px]" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="11" stroke="#1557D6" strokeWidth="2.4" />
      <path d="M18 11.5V18L22.2 18" stroke="#1557D6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// 5. Secure. Reliable. Built for Education — 3D Glossy Blue Shield
const TrustSecurityShieldIcon = () => (
  <div className="w-12 h-12 sm:w-[52px] sm:h-[52px] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
    <svg className="w-11 h-11 sm:w-12 sm:h-12" viewBox="0 0 44 44" fill="none">
      <defs>
        <linearGradient id="trustShieldOuterGrad" x1="6" y1="4" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="0.5" stopColor="#1D4ED8" />
          <stop offset="1" stopColor="#0B378F" />
        </linearGradient>
        <linearGradient id="trustShieldFacetLeft" x1="12" y1="10" x2="22" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="1" stopColor="#BFDBFE" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="trustShieldFacetRight" x1="22" y1="10" x2="32" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DBEAFE" stopOpacity="0.85" />
          <stop offset="1" stopColor="#93C5FD" stopOpacity="0.45" />
        </linearGradient>
        <filter id="trustShieldShadow" x="0" y="2" width="44" height="42" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="3.5" stdDeviation="3" floodColor="#1557D6" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Outer Shield with Drop Shadow */}
      <g filter="url(#trustShieldShadow)">
        <path
          d="M22 4.5L8 9.8V21.5C8 30.2 14.2 37.2 22 39.5C29.8 37.2 36 30.2 36 21.5V9.8L22 4.5Z"
          fill="url(#trustShieldOuterGrad)"
        />
      </g>

      {/* Left Glossy Inner Facet */}
      <path
        d="M22 9.5L13 13.5V21.5C13 27.5 17 32.8 22 34.8V9.5Z"
        fill="url(#trustShieldFacetLeft)"
      />

      {/* Right Glossy Inner Facet */}
      <path
        d="M22 9.5L31 13.5V21.5C31 27.5 27 32.8 22 34.8V9.5Z"
        fill="url(#trustShieldFacetRight)"
      />
    </svg>
  </div>
);

/* ========================================================================= */
/* WHY CHOOSE OUR AI CHATBOT? ICONS (EXACT REFERENCE DESIGN)                 */
/* ========================================================================= */

const WhyInstantResponsesIcon = () => (
  <svg className="w-10 h-10 text-[#1557D6]" viewBox="0 0 36 36" fill="none">
    <path
      d="M18 7.5C11.37 7.5 6 12.2 6 18C6 20.35 6.8 22.5 8.2 24.25L7 28.5L11.5 27.25C13.4 28.35 15.6 29 18 29C24.63 29 30 24.2 30 18C30 12.2 24.63 7.5 18 7.5Z"
      stroke="#1557D6"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="13" cy="18" r="1.5" fill="#1557D6" />
    <circle cx="18" cy="18" r="1.5" fill="#1557D6" />
    <circle cx="23" cy="18" r="1.5" fill="#1557D6" />
  </svg>
);

const WhyAIPoweredIcon = () => (
  <svg className="w-10 h-10 text-[#1557D6]" viewBox="0 0 36 36" fill="none">
    {/* Left hemisphere lobes */}
    <path
      d="M17 9C15.5 7.5 13 7.2 11.2 8.5C9.2 9.8 8.8 12.5 9 14.5C7.2 15.8 6.5 18.2 7.2 20.5C7.8 22.5 9.5 23.8 11.2 24C11.5 26.2 13.5 28 15.8 28C16.6 28 17 27.5 17 27V9Z"
      stroke="#1557D6"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Right hemisphere lobes */}
    <path
      d="M19 9C20.5 7.5 23 7.2 24.8 8.5C26.8 9.8 27.2 12.5 27 14.5C28.8 15.8 29.5 18.2 28.8 20.5C28.2 22.5 26.5 23.8 24.8 24C24.5 26.2 22.5 28 20.2 28C19.4 28 19 27.5 19 27V9Z"
      stroke="#1557D6"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Neural nodes */}
    <circle cx="13" cy="14" r="1.2" fill="#1557D6" />
    <circle cx="13" cy="21" r="1.2" fill="#1557D6" />
    <circle cx="23" cy="14" r="1.2" fill="#1557D6" />
    <circle cx="23" cy="21" r="1.2" fill="#1557D6" />
    <path d="M13 14H15M21 14H23M13 21H15M21 21H23" stroke="#1557D6" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const WhyKnowledgeIcon = () => (
  <svg className="w-10 h-10 text-[#1557D6]" viewBox="0 0 36 36" fill="none">
    <rect x="8.5" y="6.5" width="19" height="23" rx="3.5" stroke="#1557D6" strokeWidth="2.2" />
    <path d="M14 11.5H22C22.8 11.5 23.5 12.2 23.5 13V15.5C23.5 16.3 22.8 17 22 17H14C13.2 17 12.5 16.3 12.5 15.5V13C12.5 12.2 13.2 11.5 14 11.5Z" stroke="#1557D6" strokeWidth="1.8" />
    <circle cx="15.5" cy="14.2" r="0.8" fill="#1557D6" />
    <path d="M18 14.2H20.5" stroke="#1557D6" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const WhyPersonalizedIcon = () => (
  <svg className="w-10 h-10 text-[#1557D6]" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="12" r="4.8" stroke="#1557D6" strokeWidth="2.2" />
    <path d="M9 27.5C9 23 13 20.5 18 20.5C23 20.5 27 23 27 27.5" stroke="#1557D6" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const WhyMultiPlatformIcon = () => (
  <svg className="w-10 h-10 text-[#1557D6]" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="18" r="11" stroke="#1557D6" strokeWidth="2.2" />
    <ellipse cx="18" cy="18" rx="5" ry="11" stroke="#1557D6" strokeWidth="2" />
    <path d="M7 18H29" stroke="#1557D6" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const WhySecureIcon = () => (
  <svg className="w-10 h-10 text-[#1557D6]" viewBox="0 0 36 36" fill="none">
    <rect x="8.5" y="15" width="19" height="15" rx="3.5" stroke="#1557D6" strokeWidth="2.2" />
    <path d="M12.5 15V11.5C12.5 8.5 15 6 18 6C21 6 23.5 8.5 23.5 11.5V15" stroke="#1557D6" strokeWidth="2.2" strokeLinecap="round" />
    <circle cx="18" cy="22" r="1.8" fill="#1557D6" />
  </svg>
);

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroQuery, setHeroQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(0);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!heroQuery.trim()) {
      navigate('/chat');
      return;
    }
    navigate('/chat', { state: { query: heroQuery.trim() } });
  };

  const handleQuickAction = (topicTitle) => {
    navigate('/chat', { state: { query: `Tell me about ${topicTitle} and official guidelines.` } });
  };

  const quickActionItems = [
    { title: 'Course Information', IconComponent: BookIcon },
    { title: 'Admission Process', IconComponent: UserIcon },
    { title: 'Exam Schedule', IconComponent: CalendarIcon },
    { title: 'Results & Grades', IconComponent: AnalyticsIcon },
    { title: 'Campus Facilities', IconComponent: FacilityIcon },
  ];

  const heroFeatureItems = [
    {
      titleLine1: '24/7 Instant',
      titleLine2: 'Support',
      IconComponent: ChatSupportIcon,
    },
    {
      titleLine1: 'Academic',
      titleLine2: 'Information',
      IconComponent: AcademicCapIcon,
    },
    {
      titleLine1: 'Admission',
      titleLine2: 'Guidance',
      IconComponent: AdmissionBuildingIcon,
    },
    {
      titleLine1: 'Exams &',
      titleLine2: 'Results',
      IconComponent: ExamsClipboardIcon,
    },
  ];

  const whyChooseItems = [
    {
      title: 'Instant Responses',
      desc: 'Get immediate answers to your academic and campus-related queries.',
      IconComponent: WhyInstantResponsesIcon,
    },
    {
      title: 'AI-Powered',
      desc: 'Smart NLP model understands questions and provides precise information.',
      IconComponent: WhyAIPoweredIcon,
    },
    {
      title: 'Comprehensive Knowledge',
      desc: 'Covers admissions, courses, exams, results, fees, facilities, placements and more.',
      IconComponent: WhyKnowledgeIcon,
    },
    {
      title: 'Personalized Assistance',
      desc: 'Tailored responses based on user roles – students, faculty, or parents.',
      IconComponent: WhyPersonalizedIcon,
    },
    {
      title: 'Multi-Platform Access',
      desc: 'Accessible on website, mobile, WhatsApp, and other messaging platforms.',
      IconComponent: WhyMultiPlatformIcon,
    },
    {
      title: 'Secure & Compliant',
      desc: 'Built with enterprise-grade security and data privacy compliance.',
      IconComponent: WhySecureIcon,
    },
  ];

  const beneficiaryItems = [
    {
      title: 'Students',
      desc: 'Get help with courses, exams, results, fees, and campus facilities.',
      image: '/assets/student.jpg',
      badgeBg: 'bg-[#1557D6]',
      Icon: () => (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
        </svg>
      )
    },
    {
      title: 'Faculty',
      desc: 'Access academic calendars, policies, and important updates.',
      image: '/assets/faculty.jpg',
      badgeBg: 'bg-[#9D7BFF]',
      Icon: () => (
        <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C9.24 2 7 4.24 7 7c0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.76-2.24-5-5-5zm0 12c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z" />
        </svg>
      )
    },
    {
      title: 'Parents',
      desc: 'Stay informed about admissions, progress, and announcements.',
      image: '/assets/parents.jpg',
      badgeBg: 'bg-[#E53E3E]',
      Icon: () => (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="7.5" r="3" />
          <path d="M4 18.5v-1c0-2.2 1.8-4 4-4h2c2.2 0 4 1.8 4 4v1H4z" />
          <circle cx="16.5" cy="9.5" r="2.2" />
          <path d="M14.5 18.5v-.8c0-1.4 1-2.6 2.4-3 .7.7 1.6 1.1 2.6 1.1h.5v2.7h-5.5z" />
        </svg>
      )
    },
    {
      title: 'Administrators',
      desc: 'Automate support and reduce manual workload.',
      image: '/assets/admin.jpg',
      badgeBg: 'bg-[#8B5CF6]',
      Icon: () => (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" fill="white" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
        </svg>
      )
    },
  ];

  const faqs = [
    {
      q: 'Where does the chatbot get its college information?',
      a: 'The system uses Retrieval-Augmented Generation (RAG) directly indexed against official college handbook PDFs, course catalogs, examination circulars, and campus administration records.',
    },
    {
      q: 'Can I upload custom documents or new college circulars?',
      a: 'Yes! Administrators and students can upload official PDFs directly into the workspace. The documents are instantly embedded into ChromaDB vector storage for immediate querying.',
    },
    {
      q: 'Are answers verified with exact page numbers?',
      a: 'Absolutely. Every generated answer includes transparent source citations showing the exact page number and text snippet from the official document.',
    },
    {
      q: 'Is the service accessible on mobile devices 24/7?',
      a: 'Yes, CampusAI is fully responsive and accessible round-the-clock on smartphones, tablets, and desktops.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#172033] font-sans selection:bg-[#EAF3FF] selection:text-[#1557D6] overflow-x-hidden">

      {/* ========================================================= */}
      {/* 1. HEADER / NAVIGATION                                    */}
      {/* ========================================================= */}
      <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-[#F0F4FA] transition-all">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 h-[76px] flex items-center justify-between">

          {/* Exact Logo & Brand */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3.5 cursor-pointer select-none group"
          >
            {/* Blue Academic Shield with Layered Open Book */}
            <div className="w-[44px] h-[44px] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform drop-shadow-[0_4px_14px_rgba(21,87,214,0.30)]">
              <svg width="44" height="44" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Shield Base */}
                <path
                  d="M10 8 L24 4 L38 8 V24 C38 34 24 43 24 43 C24 43 10 34 10 24 V8 Z"
                  fill="#1557D6"
                />
                <path
                  d="M24 4 L38 8 V24 C38 34 24 43 24 43 V4 Z"
                  fill="#0F49B8"
                />

                {/* Layered Outer Pages */}
                <path
                  d="M13.5 17.5 L15.5 17 V30 L13.5 29 V17.5 Z"
                  fill="white"
                  opacity="0.8"
                />
                <path
                  d="M34.5 17.5 L32.5 17 V30 L34.5 29 V17.5 Z"
                  fill="white"
                  opacity="0.8"
                />

                {/* Main Open Book Pages */}
                <path
                  d="M16 15 C19 14.2 22 14.5 24 16.5 C26 14.5 29 14.2 32 15 V28.5 C29 27.5 26 27.5 24 29.5 C22 27.5 19 27.5 16 28.5 V15 Z"
                  fill="white"
                />

                {/* Inner Spine Line & Page Arc */}
                <path
                  d="M24 16.5 V29.5"
                  stroke="#1557D6"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M21.5 30.5 C22.5 31.8 25.5 31.8 26.5 30.5"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="flex flex-col text-left">
              <span className="font-extrabold text-[21px] sm:text-[22px] tracking-[-0.015em] text-[#1557D6] leading-tight font-sans">
                College InfoBot
              </span>
              <span className="text-[12px] sm:text-[12.5px] font-normal text-[#5F6878] leading-tight mt-0.5">
                Your AI Academic Assistant
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-[#4B5563]">
            <a href="#hero" className="text-[#1557D6] font-semibold transition-colors">
              Home
            </a>
            <a href="#why-choose-us" className="hover:text-[#1557D6] transition-colors">
              Why Choose Us
            </a>
            <a href="#benefits" className="hover:text-[#1557D6] transition-colors">
              Who Benefits
            </a>
            <a href="#faq" className="hover:text-[#1557D6] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Action CTA Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => navigate('/chat')}
              className="text-[15px] font-medium text-[#4B5563] hover:text-[#1557D6] px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/chat')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1557D6] hover:bg-[#0f46b3] text-white text-[14.5px] font-semibold shadow-[0_8px_24px_rgba(21,87,214,0.22)] hover:shadow-[0_12px_28px_rgba(21,87,214,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <span>Try AI Assistant</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#0B1F44] hover:bg-[#F5F9FF] transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-[#EAF3FF] px-6 py-5 flex flex-col gap-4 shadow-lg overflow-hidden"
            >
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-[#1557D6] py-1"
              >
                Home
              </a>
              <a
                href="#why-choose-us"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#4B5563] py-1"
              >
                Why Choose Us
              </a>
              <a
                href="#benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#4B5563] py-1"
              >
                Who Benefits
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#4B5563] py-1"
              >
                FAQ
              </a>
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => navigate('/chat')}
                  className="w-full py-3 rounded-full bg-[#1557D6] text-white font-semibold text-center text-sm shadow-[0_8px_20px_rgba(21,87,214,0.2)]"
                >
                  Launch AI Assistant
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>


      {/* ========================================================= */}
      {/* 2. REFINED RESPONSIVE HERO SECTION (MATCHING REFERENCE)   */}
      {/* ========================================================= */}
      <section
        id="hero"
        className="relative min-h-[calc(100vh-76px)] flex items-center justify-center overflow-hidden bg-white py-8 lg:py-2"
        style={{
          background: `
            radial-gradient(circle at 74% 48%, rgba(21, 87, 214, 0.07) 0%, rgba(255, 255, 255, 0) 55%),
            #FFFFFF
          `
        }}
      >

        {/* Balanced AI Grid & Micro-Dot Background Texture */}
        <div
          className="absolute inset-0 pointer-events-none z-0 select-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 1px 1px, rgba(21, 87, 214, 0.11) 1.2px, transparent 0),
              linear-gradient(to right, rgba(21, 87, 214, 0.028) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(21, 87, 214, 0.028) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px, 24px 24px, 24px 24px',
            maskImage: 'radial-gradient(ellipse 90% 85% at 50% 50%, black 50%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 90% 85% at 50% 50%, black 50%, transparent 100%)'
          }}
        />

        {/* 1. College Building Background (Soft Top, Bottom & Left Blends) */}
        <div className="absolute right-0 top-8 sm:top-10 lg:top-12 w-[50%] lg:w-[54%] h-[68%] max-h-[470px] pointer-events-none select-none z-0 hidden md:block overflow-hidden">
          <img
            src="/assets/college.png"
            alt="Campus Architecture"
            className="w-full h-full object-cover object-top"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, transparent 6%, rgba(0,0,0,0.05) 16%, rgba(0,0,0,0.4) 32%, rgba(0,0,0,0.85) 55%, black 70%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 10%, black 25%, black 65%, rgba(0,0,0,0.2) 88%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 6%, rgba(0,0,0,0.05) 16%, rgba(0,0,0,0.4) 32%, rgba(0,0,0,0.85) 55%, black 70%), linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.25) 10%, black 25%, black 65%, rgba(0,0,0,0.2) 88%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'destination-in'
            }}
          />
        </div>

        {/* 2. Bottom-Left Dotted Matrix & Subtle Wave Curves */}
        <div className="absolute left-0 bottom-0 pointer-events-none z-0 select-none w-[540px] h-[220px] overflow-hidden">
          {/* Subtle Dot Grid */}
          <svg className="absolute left-6 bottom-6 w-[200px] h-[130px] opacity-60" viewBox="0 0 200 130" fill="none">
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 14 }).map((_, col) => {
                const opacity = Math.max(0.08, 0.65 - (col / 13) * 0.55);
                return (
                  <circle
                    key={`${row}-${col}`}
                    cx={col * 14 + 6}
                    cy={row * 14 + 6}
                    r="1.5"
                    fill="#BFD9FF"
                    opacity={opacity}
                  />
                );
              })
            )}
          </svg>

          {/* Thin Light Wave Curves */}
          <svg className="w-full h-full" viewBox="0 0 540 220" fill="none">
            <path d="M-30 180 C 90 180, 140 120, 260 145 C 380 170, 430 110, 580 135" stroke="#BFD9FF" strokeWidth="1.1" opacity="0.6" />
            <path d="M-30 195 C 100 195, 150 135, 270 160 C 390 185, 440 125, 590 150" stroke="#D0E3FF" strokeWidth="1.1" opacity="0.55" />
            <path d="M-30 210 C 110 210, 160 150, 280 175 C 400 200, 450 140, 600 165" stroke="#E0EEFF" strokeWidth="1.1" opacity="0.5" />
          </svg>
        </div>

        {/* Main Grid Container */}
        <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-8 lg:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">

          {/* ------------------------------------------------------- */}
          {/* LEFT HERO TEXT & FEATURE BADGES (Cols 1 to 6)            */}
          {/* ------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center text-left"
          >

            {/* Serif Display Headline */}
            <h1 className="font-serif text-[34px] sm:text-[44px] md:text-[48px] lg:text-[52px] xl:text-[58px] leading-[1.04] tracking-[-0.02em] font-bold">
              <span className="text-[#0B1F44] block whitespace-nowrap">AI Chatbot for</span>
              <span className="text-[#1557D6] block whitespace-nowrap">Academic and College</span>
              <span className="text-[#1557D6] block whitespace-nowrap">Information Services</span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="mt-5 sm:mt-6 text-[#5F6878] text-[16px] sm:text-[18px] leading-[1.65] max-w-[480px] font-normal">
              Empowering students with instant answers to academic, admission, and campus related queries.
            </p>

            {/* 4 Feature Badges */}
            <div className="mt-9 sm:mt-11 flex items-start justify-between max-w-[480px]">
              {heroFeatureItems.map((item, idx) => {
                const Icon = item.IconComponent;
                return (
                  <div
                    key={idx}
                    onClick={() => handleQuickAction(item.titleLine1 + ' ' + item.titleLine2)}
                    className="flex flex-col items-center text-center cursor-pointer group"
                  >
                    <div className="mb-2">
                      <Icon />
                    </div>
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#0B1F44] group-hover:text-[#1557D6] transition-colors leading-tight block">
                      {item.titleLine1}
                    </span>
                    <span className="text-[13px] sm:text-[14px] font-bold text-[#0B1F44] group-hover:text-[#1557D6] transition-colors leading-tight block">
                      {item.titleLine2}
                    </span>
                  </div>
                );
              })}
            </div>

          </motion.div>


          {/* ------------------------------------------------------- */}
          {/* RIGHT HERO VISUAL (SHIFTED DOWN & BALANCED)             */}
          {/* ------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 xl:col-span-6 relative flex flex-col items-center justify-center min-h-[480px] sm:min-h-[520px] lg:min-h-[550px] pt-8 sm:pt-12"
          >

            {/* Subtle Circular Rings around Robot Base */}
            <div className="absolute left-[54%] top-[62%] -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[360px] h-[300px] sm:h-[360px] rounded-full border border-[#85B8FD]/40 pointer-events-none z-1" />
            <div className="absolute left-[54%] top-[62%] -translate-x-1/2 -translate-y-1/2 w-[370px] sm:w-[440px] h-[370px] sm:h-[440px] rounded-full border border-[#B8D7FD]/20 pointer-events-none z-1" />

            {/* Floating Greeting Bubble (Compact, 2 Lines Only) */}
            <div className="absolute left-2 sm:left-4 lg:left-8 top-5 sm:top-7 z-30 bg-white border border-[#C8DEFF] rounded-[20px] sm:rounded-[22px] px-4 py-2.5 shadow-[0_10px_30px_rgba(37,99,235,0.10)] max-w-[245px] sm:max-w-[260px]">
              <p className="text-[#0B1F44] font-bold text-[13.5px] sm:text-[14px] leading-snug flex items-center gap-1">
                <span>👋</span>
                <span>Hello! I'm your AI Assistant.</span>
              </p>
              <p className="text-[#5F6878] text-[12px] sm:text-[12.5px] mt-0.5 font-normal leading-tight">
                How can I help you today?
              </p>

              {/* Bubble pointer */}
              <div className="absolute -bottom-1.5 right-7 w-3 h-3 bg-white border-b border-r border-[#C8DEFF] transform rotate-45" />
            </div>

            {/* Quick Action Pills (Compact, Lowered) */}
            <div className="absolute left-0 sm:left-2 lg:left-4 top-[160px] sm:top-[175px] z-30 flex flex-col gap-1.5 sm:gap-2 w-[175px] sm:w-[195px]">
              {quickActionItems.map((item, idx) => {
                const Icon = item.IconComponent;
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(item.title)}
                    className="flex items-center gap-2.5 bg-white/95 backdrop-blur-sm border border-[#C8DEFF] hover:border-[#1557D6] hover:bg-[#F5F9FF] text-[#1E293B] hover:text-[#1557D6] font-medium text-[12px] sm:text-[13px] px-3.5 py-1.5 sm:py-2 rounded-full shadow-[0_3px_10px_rgba(37,99,235,0.05)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.12)] transition-all duration-200 hover:scale-[1.02] cursor-pointer text-left group"
                  >
                    <div className="flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon />
                    </div>
                    <span className="truncate">{item.title}</span>
                  </button>
                );
              })}
            </div>

            {/* 3D AI Robot (Static, Shifted Down) */}
            <div className="relative z-20 flex items-center justify-center translate-x-10 sm:translate-x-14 lg:translate-x-18 pt-10 pb-5 select-none pointer-events-none">
              <img
                src="/assets/robot.png"
                alt="AI Campus Robot"
                className="w-[220px] sm:w-[260px] lg:w-[290px] xl:w-[325px] max-h-[340px] object-contain drop-shadow-[0_14px_28px_rgba(21,87,214,0.14)]"
              />
            </div>

            {/* Chat Input Bar */}
            <div className="relative z-30 w-full max-w-[360px] sm:max-w-[390px] -mt-3 sm:-mt-4">
              <form
                onSubmit={handleSearchSubmit}
                className="w-full bg-white border border-[#C8DEFF] focus-within:border-[#1557D6] rounded-full p-1.5 pl-4.5 shadow-[0_10px_30px_rgba(37,99,235,0.10)] hover:shadow-[0_12px_35px_rgba(37,99,235,0.14)] flex items-center justify-between gap-2.5 transition-all"
              >
                <input
                  type="text"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder="Type your question..."
                  className="w-full bg-transparent text-[14px] text-[#0B1F44] placeholder-[#8A94A6] focus:outline-none font-normal"
                />
                <button
                  type="submit"
                  aria-label="Send Query"
                  className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full bg-[#1557D6] hover:bg-[#0f46b3] text-white flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(21,87,214,0.30)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 -translate-x-0.5 translate-y-0.5" viewBox="0 0 24 24" fill="none">
                    <path d="M21 3L10.5 13.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 3L14.3 21L10.5 13.5L3 9.7L21 3Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </button>
              </form>
            </div>

          </motion.div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 2.5 TRUSTED BY EDUCATIONAL INSTITUTIONS SECTION (NEW)      */}
      {/* ========================================================= */}
      <section className="relative w-full bg-white/90 border-t border-b border-[#EAF3FF] py-9 sm:py-11 overflow-hidden">
        {/* Ambient Subtle Background Accent */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: 'radial-gradient(ellipse 70% 80% at 85% 20%, rgba(21, 87, 214, 0.04) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          
          {/* Section Heading */}
          <h2 className="text-center font-bold text-[#0B1F44] text-[18px] sm:text-[20px] md:text-[21px] tracking-tight mb-7 sm:mb-9">
            Trusted by Educational Institutions
          </h2>

          {/* Stats & Trust Elements Row */}
          <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-8 lg:gap-4 xl:gap-6">
            
            {/* 1. 100+ Colleges */}
            <div className="flex items-center gap-3.5 group cursor-default">
              <TrustCollegesIcon />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-[23px] sm:text-[26px] md:text-[28px] text-[#1557D6] leading-none tracking-tight">
                  100+
                </span>
                <span className="text-[13px] sm:text-[13.5px] font-medium text-[#4B5563] mt-1 leading-tight">
                  Colleges
                </span>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="hidden xl:block h-10 w-[1px] bg-gradient-to-b from-transparent via-[#D8E6F8] to-transparent" />

            {/* 2. 1M+ Students */}
            <div className="flex items-center gap-3.5 group cursor-default">
              <TrustStudentsIcon />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-[23px] sm:text-[26px] md:text-[28px] text-[#1557D6] leading-none tracking-tight">
                  1M+
                </span>
                <span className="text-[13px] sm:text-[13.5px] font-medium text-[#4B5563] mt-1 leading-tight">
                  Students
                </span>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="hidden xl:block h-10 w-[1px] bg-gradient-to-b from-transparent via-[#D8E6F8] to-transparent" />

            {/* 3. 10M+ Queries Answered */}
            <div className="flex items-center gap-3.5 group cursor-default">
              <TrustQueriesIcon />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-[23px] sm:text-[26px] md:text-[28px] text-[#1557D6] leading-none tracking-tight">
                  10M+
                </span>
                <span className="text-[13px] sm:text-[13.5px] font-medium text-[#4B5563] mt-1 leading-tight">
                  Queries Answered
                </span>
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="hidden xl:block h-10 w-[1px] bg-gradient-to-b from-transparent via-[#D8E6F8] to-transparent" />

            {/* 4. 99.5% Response Accuracy */}
            <div className="flex items-center gap-3.5 group cursor-default">
              <TrustAccuracyIcon />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-[23px] sm:text-[26px] md:text-[28px] text-[#1557D6] leading-none tracking-tight">
                  99.5%
                </span>
                <span className="text-[13px] sm:text-[13.5px] font-medium text-[#4B5563] mt-1 leading-tight">
                  Response Accuracy
                </span>
              </div>
            </div>

            {/* Main Distinct Vertical Divider before Security Badge */}
            <div className="hidden lg:block h-12 w-[1.5px] bg-[#D4E3F8]" />

            {/* 5. Secure. Reliable. Built for Education */}
            <div className="flex items-center gap-3.5 group cursor-default">
              <TrustSecurityShieldIcon />
              <div className="flex flex-col text-left">
                <span className="font-bold text-[15.5px] sm:text-[16px] text-[#0B1F44] leading-tight">
                  Secure. Reliable.
                </span>
                <span className="text-[12.5px] sm:text-[13px] font-medium text-[#64748B] mt-0.5 leading-tight">
                  Built for Education.
                </span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 2.6 WHY CHOOSE OUR AI CHATBOT? SECTION (NEW)              */}
      {/* ========================================================= */}
      <section id="why-choose-us" className="py-16 sm:py-20 lg:py-24 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-[28px] sm:text-[34px] lg:text-[38px] font-bold text-[#0B1F44] tracking-tight">
              Why Choose Our AI Chatbot?
            </h2>
            <p className="mt-3 text-[#5F6878] text-[15px] sm:text-[16px] max-w-2xl mx-auto leading-relaxed">
              Advanced AI technology designed to deliver accurate, instant, and personalized responses.
            </p>
          </div>

          {/* 6 Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-4.5 xl:gap-5">
            {whyChooseItems.map((item, idx) => {
              const Icon = item.IconComponent;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E2EDFA] p-6 sm:p-5.5 xl:p-6 flex flex-col items-center text-center shadow-[0_4px_16px_rgba(21,87,214,0.03)] hover:shadow-[0_12px_28px_rgba(21,87,214,0.08)] hover:border-[#1557D6]/40 hover:-translate-y-1 transition-all duration-300 group"
                >
                  {/* Top Icon */}
                  <div className="w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[15.5px] sm:text-[16px] text-[#0B1F44] mb-2.5 leading-snug group-hover:text-[#1557D6] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#5F6878] text-[12.5px] sm:text-[13px] leading-[1.55] font-normal">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 3. WHO CAN BENEFIT? SECTION (EXACT COMPACT REFERENCE)     */}
      {/* ========================================================= */}
      <section id="benefits" className="py-14 sm:py-16 lg:py-20 bg-white relative border-t border-[#EAF3FF]">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
            <h2 className="text-[26px] sm:text-[32px] lg:text-[36px] font-bold text-[#0B1F44] tracking-tight">
              Who Can Benefit?
            </h2>
          </div>

          {/* 4 Beneficiary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {beneficiaryItems.map((item, idx) => {
              const Icon = item.Icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-[24px] border border-[#E2EDFA] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(21,87,214,0.04)] hover:shadow-[0_12px_28px_rgba(21,87,214,0.09)] hover:border-[#1557D6]/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 sm:gap-4 group"
                >
                  {/* Left Character Illustration (Full natural view, no clipping) */}
                  <div className="w-[105px] sm:w-[118px] xl:w-[125px] h-[150px] sm:h-[165px] flex items-center justify-center flex-shrink-0 select-none pointer-events-none group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain object-center select-none"
                    />
                  </div>

                  {/* Right Content */}
                  <div className="flex flex-col items-start text-left flex-1 min-w-0">
                    {/* Top Circular Badge */}
                    <div className={`w-9 h-9 rounded-full ${item.badgeBg} flex items-center justify-center text-white shadow-[0_3px_8px_rgba(0,0,0,0.12)] mb-2 flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon />
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-[17px] sm:text-[18px] text-[#0B1F44] mb-1 leading-tight group-hover:text-[#1557D6] transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[#5F6878] text-[12.5px] sm:text-[13px] leading-[1.45] font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 4. INSTANT ANSWERS ACROSS ALL CAMPUS SERVICES            */}
      {/* ========================================================= */}
      <section id="services" className="py-16 sm:py-20 lg:py-24 bg-[#F5F9FF] border-t border-[#EAF3FF] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div style={{ background: 'radial-gradient(ellipse 60% 50% at 80% 10%, rgba(21,87,214,0.05) 0%, transparent 70%)' }} className="absolute inset-0" />
          <div style={{ background: 'radial-gradient(ellipse 40% 40% at 20% 90%, rgba(21,87,214,0.04) 0%, transparent 70%)' }} className="absolute inset-0" />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF3FF] text-[#1557D6] font-semibold text-[11px] uppercase tracking-widest mb-4">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>
              Campus Intelligence
            </span>
            <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-extrabold text-[#0B1F44] tracking-tight leading-[1.15]">
              Instant Answers Across<br className="hidden sm:block" /> All Campus Services
            </h2>
            <p className="mt-4 text-[#5F6878] text-[15px] sm:text-[16px] leading-relaxed max-w-2xl mx-auto">
              DocuChat connects directly with official handbooks, university portals, and notices to give you verified answers in seconds.
            </p>
          </div>

          {/* 6 Service Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

            {/* 1. Academics */}
            <div className="group bg-white rounded-[22px] border border-[#E2EDFA] p-6 shadow-[0_4px_20px_rgba(21,87,214,0.04)] hover:shadow-[0_16px_36px_rgba(21,87,214,0.10)] hover:border-[#1557D6]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[13px] bg-[#EAF3FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1557D6] transition-colors duration-300">
                  <svg className="w-5.5 h-5.5 text-[#1557D6] group-hover:text-white transition-colors duration-300" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#1557D6] bg-[#EAF3FF] px-2.5 py-0.5 rounded-full">Academics</span>
                  <h3 className="mt-2 font-bold text-[17px] text-[#0B1F44] leading-tight group-hover:text-[#1557D6] transition-colors">Course Catalog &amp; Syllabi</h3>
                </div>
              </div>
              <p className="text-[#5F6878] text-[13.5px] leading-[1.6] flex-1">
                Instant access to department-wise credit structures, prerequisites, syllabus PDFs, and faculty listings.
              </p>
              <button
                onClick={() => handleQuickAction('Course Catalog and Syllabi')}
                className="mt-1 self-start inline-flex items-center gap-1.5 text-[#1557D6] text-[13px] font-semibold hover:gap-2.5 transition-all group-hover:underline"
              >
                Ask about this <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 2. Enrollment */}
            <div className="group bg-white rounded-[22px] border border-[#E2EDFA] p-6 shadow-[0_4px_20px_rgba(21,87,214,0.04)] hover:shadow-[0_16px_36px_rgba(21,87,214,0.10)] hover:border-[#1557D6]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[13px] bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#2563EB] transition-colors duration-300">
                  <svg className="w-5.5 h-5.5 text-[#2563EB] group-hover:text-white transition-colors duration-300" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full">Enrollment</span>
                  <h3 className="mt-2 font-bold text-[17px] text-[#0B1F44] leading-tight group-hover:text-[#1557D6] transition-colors">Admissions &amp; Eligibility</h3>
                </div>
              </div>
              <p className="text-[#5F6878] text-[13.5px] leading-[1.6] flex-1">
                Verify cutoff scores, required documentation, fee waivers, and step-by-step registration timelines.
              </p>
              <button
                onClick={() => handleQuickAction('Admissions and Eligibility')}
                className="mt-1 self-start inline-flex items-center gap-1.5 text-[#1557D6] text-[13px] font-semibold hover:gap-2.5 transition-all group-hover:underline"
              >
                Ask about this <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3. Examinations */}
            <div className="group bg-white rounded-[22px] border border-[#E2EDFA] p-6 shadow-[0_4px_20px_rgba(21,87,214,0.04)] hover:shadow-[0_16px_36px_rgba(21,87,214,0.10)] hover:border-[#1557D6]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[13px] bg-[#FFF7ED] flex items-center justify-center flex-shrink-0 group-hover:bg-[#EA580C] transition-colors duration-300">
                  <svg className="w-5.5 h-5.5 text-[#EA580C] group-hover:text-white transition-colors duration-300" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#EA580C] bg-[#FFF7ED] px-2.5 py-0.5 rounded-full">Examinations</span>
                  <h3 className="mt-2 font-bold text-[17px] text-[#0B1F44] leading-tight group-hover:text-[#1557D6] transition-colors">Exam Schedules &amp; Dates</h3>
                </div>
              </div>
              <p className="text-[#5F6878] text-[13.5px] leading-[1.6] flex-1">
                Check midterm, final semester schedules, practical exam dates, and hall ticket download guidelines.
              </p>
              <button
                onClick={() => handleQuickAction('Exam Schedules and Dates')}
                className="mt-1 self-start inline-flex items-center gap-1.5 text-[#1557D6] text-[13px] font-semibold hover:gap-2.5 transition-all group-hover:underline"
              >
                Ask about this <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4. Evaluation */}
            <div className="group bg-white rounded-[22px] border border-[#E2EDFA] p-6 shadow-[0_4px_20px_rgba(21,87,214,0.04)] hover:shadow-[0_16px_36px_rgba(21,87,214,0.10)] hover:border-[#1557D6]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[13px] bg-[#F0FDF4] flex items-center justify-center flex-shrink-0 group-hover:bg-[#16A34A] transition-colors duration-300">
                  <svg className="w-5.5 h-5.5 text-[#16A34A] group-hover:text-white transition-colors duration-300" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#16A34A] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full">Evaluation</span>
                  <h3 className="mt-2 font-bold text-[17px] text-[#0B1F44] leading-tight group-hover:text-[#1557D6] transition-colors">Results &amp; Grade Criteria</h3>
                </div>
              </div>
              <p className="text-[#5F6878] text-[13.5px] leading-[1.6] flex-1">
                Detailed breakdown of grading formulas, SGPA/CGPA evaluation, revaluation windows, and transcripts.
              </p>
              <button
                onClick={() => handleQuickAction('Results and Grade Criteria')}
                className="mt-1 self-start inline-flex items-center gap-1.5 text-[#1557D6] text-[13px] font-semibold hover:gap-2.5 transition-all group-hover:underline"
              >
                Ask about this <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 5. Campus Life */}
            <div className="group bg-white rounded-[22px] border border-[#E2EDFA] p-6 shadow-[0_4px_20px_rgba(21,87,214,0.04)] hover:shadow-[0_16px_36px_rgba(21,87,214,0.10)] hover:border-[#1557D6]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[13px] bg-[#F5F3FF] flex items-center justify-center flex-shrink-0 group-hover:bg-[#7C3AED] transition-colors duration-300">
                  <svg className="w-5.5 h-5.5 text-[#7C3AED] group-hover:text-white transition-colors duration-300" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#7C3AED] bg-[#F5F3FF] px-2.5 py-0.5 rounded-full">Campus Life</span>
                  <h3 className="mt-2 font-bold text-[17px] text-[#0B1F44] leading-tight group-hover:text-[#1557D6] transition-colors">Hostels &amp; Campus Amenities</h3>
                </div>
              </div>
              <p className="text-[#5F6878] text-[13.5px] leading-[1.6] flex-1">
                Explore campus map, digital library access, sports complexes, cafeteria menus, and hostel allotment rules.
              </p>
              <button
                onClick={() => handleQuickAction('Hostels and Campus Amenities')}
                className="mt-1 self-start inline-flex items-center gap-1.5 text-[#1557D6] text-[13px] font-semibold hover:gap-2.5 transition-all group-hover:underline"
              >
                Ask about this <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 6. Financial Aid */}
            <div className="group bg-white rounded-[22px] border border-[#E2EDFA] p-6 shadow-[0_4px_20px_rgba(21,87,214,0.04)] hover:shadow-[0_16px_36px_rgba(21,87,214,0.10)] hover:border-[#1557D6]/30 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-[13px] bg-[#FFF1F2] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E11D48] transition-colors duration-300">
                  <svg className="w-5.5 h-5.5 text-[#E11D48] group-hover:text-white transition-colors duration-300" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#E11D48] bg-[#FFF1F2] px-2.5 py-0.5 rounded-full">Financial Aid</span>
                  <h3 className="mt-2 font-bold text-[17px] text-[#0B1F44] leading-tight group-hover:text-[#1557D6] transition-colors">Scholarships &amp; Aid</h3>
                </div>
              </div>
              <p className="text-[#5F6878] text-[13.5px] leading-[1.6] flex-1">
                Merit-based, need-based, and government scholarship details, application deadlines, and disbursement status.
              </p>
              <button
                onClick={() => handleQuickAction('Scholarships and Financial Aid')}
                className="mt-1 self-start inline-flex items-center gap-1.5 text-[#1557D6] text-[13px] font-semibold hover:gap-2.5 transition-all group-hover:underline"
              >
                Ask about this <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================= */}
      {/* 5. FAQ SECTION                                            */}
      {/* ========================================================= */}
      <section id="faq" className="py-20 bg-[#F9FBFF] border-t border-[#EAF3FF]">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">

          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAF3FF] text-[#1557D6] font-semibold text-xs uppercase tracking-wider mb-3.5">
              <HelpCircle className="w-3.5 h-3.5" /> Answers for Students
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0B1F44] tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#DCE7F7] rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? -1 : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-lg text-[#0B1F44] hover:text-[#1557D6] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-[#1557D6] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-5 text-[#5F6878] text-[15px] leading-relaxed border-t border-[#F0F5FF] pt-4"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 5. CTA TRANSFORMATION BANNER (JUST ABOVE FOOTER)          */}
      {/* ========================================================= */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Main Blue Rounded Card */}
          <div className="relative w-full rounded-[24px] sm:rounded-[32px] bg-gradient-to-r from-[#1150C9] via-[#1557D6] to-[#0E46B4] p-6 sm:p-8 lg:py-10 lg:px-10 shadow-[0_20px_50px_rgba(21,87,214,0.28)] overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            
            {/* Ambient Lighting Overlay */}
            <div
              className="absolute inset-0 pointer-events-none select-none opacity-40"
              style={{
                backgroundImage: 'radial-gradient(circle at 10% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 40%), radial-gradient(circle at 90% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 40%)'
              }}
            />

            {/* Left AI Robot */}
            <div className="relative z-10 flex-shrink-0 flex items-center justify-center">
              <img
                src="/assets/cta_banner_robot.jpg"
                alt="AI Campus Assistant"
                className="w-[160px] sm:w-[190px] lg:w-[220px] xl:w-[240px] max-h-[220px] object-contain rounded-2xl drop-shadow-[0_12px_24px_rgba(0,0,0,0.2)]"
              />
            </div>

            {/* Center Content: Title, Subtitle, CTA Buttons */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl px-2">
              <h2 className="text-[24px] sm:text-[28px] lg:text-[33px] xl:text-[36px] font-extrabold text-white tracking-tight leading-[1.2]">
                Ready to Transform Your Academic Information Services?
              </h2>
              
              <p className="mt-3 text-[#E3EFFF] text-[14px] sm:text-[15.5px] leading-relaxed font-normal max-w-xl">
                Empower your students and staff with instant, accurate, and AI-powered support.
              </p>

              {/* Action Buttons */}
              <div className="mt-7 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-5 w-full">
                {/* 1. Book a Demo */}
                <button
                  onClick={() => navigate('/chat', { state: { query: 'I would like to book a demo of College InfoBot for my institution.' } })}
                  className="w-full sm:w-auto bg-white hover:bg-[#F3F7FF] text-[#1557D6] font-bold text-[15px] px-6 sm:px-8 py-3.5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.14)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <svg className="w-5 h-5 text-[#1557D6]" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="18" rx="3" stroke="#1557D6" strokeWidth="2" />
                    <line x1="3" y1="9" x2="21" y2="9" stroke="#1557D6" strokeWidth="2" />
                    <line x1="8" y1="2" x2="8" y2="5" stroke="#1557D6" strokeWidth="2" strokeLinecap="round" />
                    <line x1="16" y1="2" x2="16" y2="5" stroke="#1557D6" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="8" cy="13" r="1.1" fill="#1557D6" />
                    <circle cx="12" cy="13" r="1.1" fill="#1557D6" />
                    <circle cx="16" cy="13" r="1.1" fill="#1557D6" />
                    <circle cx="8" cy="17" r="1.1" fill="#1557D6" />
                    <circle cx="12" cy="17" r="1.1" fill="#1557D6" />
                    <circle cx="16" cy="17" r="1.1" fill="#1557D6" />
                  </svg>
                  <span>Book a Demo</span>
                </button>

                {/* 2. Request Access */}
                <button
                  onClick={() => navigate('/chat')}
                  className="w-full sm:w-auto bg-white hover:bg-[#F3F7FF] text-[#1557D6] font-bold text-[15px] px-6 sm:px-8 py-3.5 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.14)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <svg className="w-5 h-5 text-[#1557D6]" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H9M17 7V15" stroke="#1557D6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Request Access</span>
                </button>
              </div>
            </div>

            {/* Right Books Stack & Graduation Cap */}
            <div className="relative z-10 flex-shrink-0 flex items-center justify-center">
              <img
                src="/assets/cta_banner_books.jpg"
                alt="Academic Cap and Books"
                className="w-[160px] sm:w-[190px] lg:w-[220px] xl:w-[240px] max-h-[220px] object-contain rounded-2xl drop-shadow-[0_12px_24px_rgba(0,0,0,0.2)]"
              />
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================= */}
      {/* 6. FOOTER (EXACT REFERENCE DESIGN)                        */}
      {/* ========================================================= */}
      <footer className="bg-[#051329] text-[#8EA2C6] pt-16 pb-8 border-t border-[#13284C] relative overflow-hidden">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(21, 87, 214, 0.08) 0%, transparent 80%)',
          }}
        />

        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          
          {/* Main 5-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#13284C]">

            {/* Column 1: Brand & Bio & Socials */}
            <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-4">
              {/* Logo & Brand Name */}
              <div
                onClick={() => navigate('/')}
                className="flex items-center gap-3 cursor-pointer select-none group"
              >
                {/* White Rounded Squircle with Blue Open Book */}
                <div className="w-11 h-11 rounded-[12px] bg-white flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex-shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M6 8.5C9.5 7.8 13 8.2 16 10C19 8.2 22.5 7.8 26 8.5V23.5C22.5 22.5 19 22.5 16 24.5C13 22.5 9.5 22.5 6 23.5V8.5Z"
                      fill="#1557D6"
                    />
                    <path
                      d="M16 10V24.5"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path d="M9 13H13M9 17H13" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M19 13H23M19 17H23" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="flex flex-col text-left">
                  <span className="font-extrabold text-[20px] tracking-tight text-white leading-tight">
                    College InfoBot
                  </span>
                  <span className="text-[12px] font-normal text-[#8EA2C6] leading-tight mt-0.5">
                    Your AI Academic Assistant
                  </span>
                </div>
              </div>

              {/* Bio description */}
              <p className="mt-4 text-[13.5px] leading-[1.65] text-[#8EA2C6] max-w-[300px]">
                Delivering smart, reliable, and instant academic information services through AI-powered conversations.
              </p>

              {/* Social Media Circular Buttons */}
              <div className="mt-6 flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full border border-[#234273] hover:border-white/60 flex items-center justify-center text-[#8EA2C6] hover:text-white hover:bg-[#153468] transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Twitter / X */}
                <a
                  href="#"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-full border border-[#234273] hover:border-white/60 flex items-center justify-center text-[#8EA2C6] hover:text-white hover:bg-[#153468] transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full border border-[#234273] hover:border-white/60 flex items-center justify-center text-[#8EA2C6] hover:text-white hover:bg-[#153468] transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63-.73-1.63-1.63-1.63Z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-[#234273] hover:border-white/60 flex items-center justify-center text-[#8EA2C6] hover:text-white hover:bg-[#153468] transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-white text-[15.5px] mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-[14px]">
                <li><a href="#hero" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Column 3: Services */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-white text-[15.5px] mb-4">
                Services
              </h4>
              <ul className="space-y-2.5 text-[14px]">
                <li><a href="#services" className="hover:text-white transition-colors">Academic Information</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Admission Assistance</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Exam & Results</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Campus Facilities</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Announcements</a></li>
              </ul>
            </div>

            {/* Column 4: Support */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-white text-[15.5px] mb-4">
                Support
              </h4>
              <ul className="space-y-2.5 text-[14px]">
                <li><a href="#help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            {/* Column 5: Contact Us */}
            <div className="lg:col-span-2">
              <h4 className="font-bold text-white text-[15.5px] mb-4">
                Contact Us
              </h4>
              <ul className="space-y-3.5 text-[14px]">
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#8EA2C6] flex-shrink-0" />
                  <a href="mailto:info@collegeinfobot.com" className="hover:text-white transition-colors break-all">
                    info@collegeinfobot.com
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#8EA2C6] flex-shrink-0" />
                  <a href="tel:+911234567890" className="hover:text-white transition-colors">
                    +91 12345 67890
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#8EA2C6] flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    123 Education Street,<br />Knowledge City, India - 560001
                  </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Notice */}
          <div className="pt-7 pb-2 text-center text-[13.5px] text-[#8EA2C6]">
            <p>© 2024 College InfoBot. All rights reserved.</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
