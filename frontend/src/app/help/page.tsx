"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  HelpCircle,
  BookOpen,
  Search,
  Bot,
  Sparkles,
  ChevronDown,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Building2,
  Layers,
  ArrowRight,
  Info,
} from "lucide-react";
import Footer from "../components/Footer";

type HelpTab = "quickstart" | "decoder" | "prompts" | "faq";

interface FaqItem {
  id: string;
  category: "Search & Navigation" | "AI Assistant" | "BIS Standards & Compliance";
  question: string;
  answer: string;
  tags: string[];
}

const FAQS: FaqItem[] = [
  {
    id: "faq-1",
    category: "Search & Navigation",
    question: "How do I search for a specific Indian Standard by number or keyword?",
    answer:
      "You can search using official IS numbers (such as 'IS 456', 'IS 1786', 'IS 4984') or natural engineering terms (like 'reinforcement steel bars', 'structural concrete', 'HDPE water pipes'). The engine searches across titles, categories, and full text descriptions.",
    tags: ["search", "is number", "keywords"],
  },
  {
    id: "faq-2",
    category: "Search & Navigation",
    question: "What is the difference between Active Standards and Old/Archived Standards?",
    answer:
      "Active standards represent currently valid, gazette-notified Bureau of Indian Standards specifications. Old Standards represent superseded or historical editions retained for reference in legacy building audits, existing installations, or insurance claims.",
    tags: ["old standards", "archived", "revisions"],
  },
  {
    id: "faq-3",
    category: "AI Assistant",
    question: "How does the Maanak AI Assistant generate clause answers?",
    answer:
      "Maanak utilizes a Retrieval-Augmented Generation (RAG) system indexing BIS standard documents. When you ask a question, the assistant retrieves verified standard text and provides answers with exact clause citations and amendment references.",
    tags: ["ai assistant", "rag", "citations"],
  },
  {
    id: "faq-4",
    category: "BIS Standards & Compliance",
    question: "What is the difference between Scheme I (ISI Mark) and Scheme II (CRS)?",
    answer:
      "Scheme I is the traditional ISI Mark Certification Scheme requiring factory audits, sample testing, and ongoing surveillance. Scheme II is the Compulsory Registration Scheme (CRS), applied mainly to electronics, solar equipment, and IT goods based on self-declaration and test reports from BIS-recognized labs.",
    tags: ["isi mark", "crs", "schemes", "mandatory"],
  },
  {
    id: "faq-5",
    category: "BIS Standards & Compliance",
    question: "What does 'Reaffirmed' mean in standard numbers?",
    answer:
      "Under BIS statutory rules, all published standards undergo a mandatory 5-year technical review. If the committee finds the specification remains valid without changes, it is 'Reaffirmed' for another 5-year cycle.",
    tags: ["reaffirmation", "validity", "5-year review"],
  },
  {
    id: "faq-6",
    category: "Search & Navigation",
    question: "How do I filter standards by specific industrial sectors?",
    answer:
      "You can visit the 'All Categories' page or use the category dropdown in the Standards Search page to browse divisions such as Civil Engineering (CED), Electrotechnical (ETD), Chemicals (CHD), and Textiles (TXD).",
    tags: ["categories", "divisions", "filters"],
  },
];

const PROMPTS_LIBRARY = [
  {
    title: "Mandatory Certification & QCO Check",
    category: "Compliance",
    prompt: "Is BIS certification mandatory under Quality Control Orders (QCO) for HDPE pipes used in drinking water supply?",
  },
  {
    title: "Steel Grade Property Comparison",
    category: "Structural",
    prompt: "Compare the minimum yield strength and elongation requirements between IS 1786 Fe 500D and Fe 550D rebar.",
  },
  {
    title: "Concrete Mix Testing Clauses",
    category: "Civil Engineering",
    prompt: "List the mandatory sampling frequency and 28-day compressive strength criteria specified in IS 456:2000.",
  },
  {
    title: "Electronics Safety & CRS Requirements",
    category: "Electronics / IT",
    prompt: "What safety testing parameters are mandated under IS 13252 for power adapters under Compulsory Registration (CRS)?",
  },
  {
    title: "Fire Extinguisher Testing Standards",
    category: "Safety",
    prompt: "Summarize the maintenance and hydraulic testing intervals for ABC powder fire extinguishers under IS 15683.",
  },
  {
    title: "Amendment History & Changes",
    category: "Standards Tracking",
    prompt: "What major changes and revised test clauses were introduced in Amendment 1 and 2 of IS 10262 for Concrete Mix Proportioning?",
  },
];

const BIS_DIVISIONS_GUIDE = [
  { code: "CED", name: "Civil Engineering", desc: "Building materials, structural concrete, foundations & safety codes." },
  { code: "ETD", name: "Electrotechnical", desc: "Transformers, switchgear, electrical cables & renewable power." },
  { code: "LITD", name: "Electronics & IT", desc: "IT equipment, telecom devices, solar invertors & cybersecurity." },
  { code: "CHD", name: "Chemical", desc: "Industrial chemicals, paints, fertilizers, polymers & water treatment." },
  { code: "FAD", name: "Food & Agriculture", desc: "Agricultural equipment, packaged food, dairy & irrigation." },
  { code: "MED", name: "Mechanical Engineering", desc: "Pumps, compressors, automotive components & pressure vessels." },
  { code: "TXD", name: "Textiles", desc: "Technical textiles, yarn, geo-textiles & protective garments." },
  { code: "MTD", name: "Metallurgical Engineering", desc: "Structural steel, rebar, alloys, welding consumables & casting." },
];

export default function HelpDocsPage() {
  const [activeTab, setActiveTab] = useState<HelpTab>("quickstart");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Filter FAQs
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;
    const q = searchQuery.toLowerCase();
    return FAQS.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const tabs: { id: HelpTab; label: string; icon: React.ElementType }[] = [
    { id: "quickstart", label: "Quick Start Guide", icon: BookOpen },
    { id: "decoder", label: "BIS Standards Decoder", icon: Layers },
    { id: "prompts", label: "AI Prompt Library", icon: Sparkles },
    { id: "faq", label: "Frequently Asked Questions", icon: HelpCircle },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Maanak Documentation &amp; Help Center</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            How can we help you navigate Indian Standards?
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Learn how to search BIS standards, decode standard numbering, leverage the AI Assistant with ready-to-use prompt templates, and find answers to common questions.
          </p>

          {/* Search bar */}
          <div className="pt-2 relative max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim() && activeTab !== "faq") {
                  setActiveTab("faq");
                }
              }}
              placeholder="Search help topics, clauses, or FAQs..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-xs sm:text-sm text-foreground shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-muted/60 rounded-2xl border border-border/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-card text-primary shadow-xs border border-border/70"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="space-y-6">
        {/* ======================================================== */}
        {/* TAB 1: QUICK START */}
        {/* ======================================================== */}
        {activeTab === "quickstart" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* 4 Steps */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Getting Started with Maanak</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Discover, verify, and audit Bureau of Indian Standards (BIS) specifications in 4 simple steps.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {[
                  {
                    step: "01",
                    title: "Search Standards",
                    desc: "Find specifications by IS number (e.g. IS 1786) or natural engineering terms.",
                    link: "/standard-search",
                    linkText: "Search Standards",
                  },
                  {
                    step: "02",
                    title: "Explore Sectors",
                    desc: "Browse through 12+ specialized BIS engineering and industrial divisions.",
                    link: "/all-categories",
                    linkText: "View Sectors",
                  },
                  {
                    step: "03",
                    title: "Ask AI Assistant",
                    desc: "Get instant clause explanations, testing parameters, and compliance guidance.",
                    link: "/ai",
                    linkText: "Open AI Chat",
                  },
                  {
                    step: "04",
                    title: "Archived Standards",
                    desc: "Access historical and superseded specifications for legacy structural audits.",
                    link: "/old-standards",
                    linkText: "View Old Standards",
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="relative flex flex-col justify-between rounded-xl border border-border bg-muted/20 p-5 hover:border-primary/40 transition-all group"
                  >
                    <div>
                      <span className="text-2xl font-black text-primary/30 group-hover:text-primary transition-colors">
                        {item.step}
                      </span>
                      <h3 className="text-sm font-bold text-foreground mt-2">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                    </div>
                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mt-4 hover:underline"
                    >
                      <span>{item.linkText}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Official BIS Links */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-foreground">Official Government BIS Resources</h3>
              <p className="text-xs text-muted-foreground">
                Direct access to national portals for official Gazette notifications and e-BIS certification.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <a
                  href="https://www.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 text-xs font-semibold text-foreground transition-all group"
                >
                  <span>BIS Official Portal</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                </a>

                <a
                  href="https://www.manakonline.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 text-xs font-semibold text-foreground transition-all group"
                >
                  <span>Manakonline (e-BIS)</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                </a>

                <a
                  href="https://www.services.bis.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/30 text-xs font-semibold text-foreground transition-all group"
                >
                  <span>Standards Conformance</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: STANDARDS 101 & DECODER */}
        {/* ======================================================== */}
        {activeTab === "decoder" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            {/* Visual Code Breakdown */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">Decoding Indian Standard (IS) Numbers</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Understand what each component in a standard identification code signifies.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 p-6 space-y-6">
                <div className="text-center">
                  <div className="inline-flex flex-wrap items-center justify-center gap-2 p-3 bg-card rounded-2xl border border-border/80 shadow-xs font-mono text-base sm:text-xl font-bold">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      IS 1786
                    </span>
                    <span className="text-muted-foreground">:</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      2008
                    </span>
                    <span className="text-muted-foreground">(</span>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 border border-purple-500/20 text-xs sm:text-sm font-sans font-semibold">
                      Reaffirmed 2018
                    </span>
                    <span className="text-muted-foreground">)</span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 border border-amber-500/20 text-xs sm:text-sm font-sans font-semibold">
                      + Amd 1
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-card border border-blue-500/20 space-y-1">
                    <span className="font-bold text-blue-600">1. Standard &amp; Number</span>
                    <p className="text-muted-foreground">
                      <strong>IS 1786:</strong> Indian Standard prefix followed by its unique registration number.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-emerald-500/20 space-y-1">
                    <span className="font-bold text-emerald-600">2. Formulation Year</span>
                    <p className="text-muted-foreground">
                      <strong>:2008:</strong> Year of official Gazette approval and publication.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-purple-500/20 space-y-1">
                    <span className="font-bold text-purple-600">3. Reaffirmation</span>
                    <p className="text-muted-foreground">
                      <strong>Reaffirmed 2018:</strong> Standard reviewed at 5-year statutory cycle and confirmed valid.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-amber-500/20 space-y-1">
                    <span className="font-bold text-amber-600">4. Amendments</span>
                    <p className="text-muted-foreground">
                      <strong>+ Amd 1:</strong> Official technical revisions published in the Gazette of India.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BIS Divisions Guide */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-foreground">BIS Technical Divisions</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  The Bureau of Indian Standards organizes standard formulation across specialized Technical Committees.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {BIS_DIVISIONS_GUIDE.map((div) => (
                  <div key={div.code} className="p-4 rounded-xl border border-border bg-muted/20 space-y-1">
                    <span className="text-xs font-bold text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                      {div.code}
                    </span>
                    <h4 className="text-xs font-bold text-foreground pt-1">{div.name}</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{div.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PROMPTS LIBRARY (100% FUNCTIONAL) */}
        {/* ======================================================== */}
        {activeTab === "prompts" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Assistant Prompt Library
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Ready-to-use prompt templates. Click &apos;Launch in AI&apos; to instantly pre-fill and run in the AI Assistant.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PROMPTS_LIBRARY.map((item, index) => {
                const isCopied = copiedIndex === index;
                return (
                  <div
                    key={item.title}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4 hover:border-primary/40 transition-all"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                      <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-xl border border-border/60 italic leading-relaxed">
                        &quot;{item.prompt}&quot;
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(item.prompt, index)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all"
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Prompt</span>
                          </>
                        )}
                      </button>

                      <Link
                        href={`/ai?prompt=${encodeURIComponent(item.prompt)}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all shadow-2xs"
                      >
                        <Bot className="h-3.5 w-3.5" />
                        <span>Launch in AI</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: FAQS */}
        {/* ======================================================== */}
        {activeTab === "faq" && (
          <div className="space-y-6 animate-in fade-in-50 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-foreground">Frequently Asked Questions</h2>
                <p className="text-xs text-muted-foreground">
                  Answers to standard search, compliance requirements, and AI citations.
                </p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Showing {filteredFaqs.length} of {FAQS.length} FAQs
              </span>
            </div>

            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card p-12 text-center text-sm text-muted-foreground">
                No FAQs matched &quot;{searchQuery}&quot;. Try a different search term or browse the Quick Start guide.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-muted/40 transition-colors"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            {faq.category}
                          </span>
                          <h3 className="text-sm font-semibold text-foreground pt-1">{faq.question}</h3>
                        </div>
                        <div
                          className={`p-1.5 rounded-lg bg-muted text-muted-foreground shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-primary bg-primary/10" : ""
                          }`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 space-y-3 animate-in fade-in-50">
                          <p>{faq.answer}</p>
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {faq.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground/80"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}