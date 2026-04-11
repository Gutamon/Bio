"use client"

import { motion } from 'framer-motion';

const tabs = [
  { id: 'code', label: '程式 Code' },
  { id: 'fashion', label: '服裝 Fashion' },
  { id: 'music', label: '音樂 Music' }
];

export default function StickyTabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  return (
    <div className="sticky top-0 z-50 bg-[#F9F9F8]/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800/50">
      <div className="max-w-4xl mx-auto px-4 flex justify-center gap-8 md:gap-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative py-5 px-2 text-sm md:text-base font-medium transition-colors ${
              activeTab === tab.id ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400 dark:text-stone-600 hover:text-stone-600 dark:hover:text-stone-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-stone-900 dark:bg-stone-100"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
