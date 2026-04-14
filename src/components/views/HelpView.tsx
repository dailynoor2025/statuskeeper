"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Zap, ShieldAlert } from "lucide-react";

export function HelpView() {
  const faqs = [
    {
      question: "Why is the status list empty?",
      answer: "Statuses only appear here after you view them in the official WhatsApp app. If you haven't watched a status yet, our app cannot locate it in your device storage."
    },
    {
      question: "Statuses missing after watching?",
      answer: "Ensure you have granted storage permission in settings. Also, check that you are using the official WhatsApp or WhatsApp Business app. Custom versions may store media in different folders."
    },
    {
      question: "Why did my premium status disappear?",
      answer: "If you clear the app cache or data in your Android settings, your earned premium time will be lost. Premium data is stored locally for privacy, so please avoid clearing data while active."
    },
    {
      question: "Why can't I save certain videos?",
      answer: "If your device storage is full, the save operation will fail. Please check available space. Also, ensure a stable connection if the status is still loading from WhatsApp's servers."
    },
    {
      question: "Ads not loading for rewards?",
      answer: "Check your internet connection. If you use ad-blockers, VPNs, or custom DNS services, reward videos may fail to load. Disable these services to activate premium access."
    }
  ];

  return (
    <div className="px-4 py-6 space-y-6 w-full h-full overflow-y-auto no-scrollbar bg-gray-50/10 animate-in fade-in duration-500">
      <div className="text-center space-y-1">
        <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm border border-primary/5">
          <HelpCircle className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-[clamp(14px,4vw,18px)] font-black text-gray-900 tracking-tight leading-tight">Help & support</h2>
        <p className="text-[clamp(10px,2.5vw,12px)] text-gray-400 font-bold tracking-tight">Troubleshooting and solutions</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden p-2">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-none px-4">
              <AccordionTrigger className="text-[clamp(11px,3vw,13px)] font-black text-left hover:no-underline py-4 text-gray-800 tracking-tight">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-[clamp(10px,2.5vw,12px)] text-gray-500 font-medium leading-relaxed pb-4 tracking-tight">
                {faq.answer}
              </AccordionContent>
              {index < faqs.length - 1 && <div className="h-px bg-gray-50 w-full" />}
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="bg-destructive/5 border border-destructive/10 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
        <p className="text-[9px] font-bold text-destructive/80 leading-tight uppercase tracking-wider">
          Warning: clearing app data will reset your premium timer.
        </p>
      </div>

      <div className="pt-4 text-center space-y-1 opacity-20 pb-20">
        <div className="flex items-center justify-center gap-1.5 text-gray-400 font-black tracking-tight text-[8px]">
          <Zap className="w-3 h-3" />
          <span>Status keeper stable architecture</span>
        </div>
      </div>
    </div>
  );
}