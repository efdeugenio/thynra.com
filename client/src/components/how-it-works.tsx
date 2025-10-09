import { Database, Bot, BookOpen, BarChart3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
  const focusAreas = [
    {
      icon: Database,
      title: "Data Integration & Automation",
      description: "We connect your scattered data — from tools, spreadsheets, or apps — into a single flow that keeps everything updated automatically.",
      highlight: "No more manual exports or copy-paste chaos.",
      color: "bg-blue-500"
    },
    {
      icon: Bot,
      title: "AI Assistants & Agents",
      description: "We design custom AI agents that understand your operations and act on your data.",
      highlight: "From answering team questions to triggering workflows and generating reports — all automatically.",
      color: "bg-purple-500"
    },
    {
      icon: BookOpen,
      title: "Knowledge Systems",
      description: "We build secure, private knowledge bases where your data becomes searchable, conversational, and useful.",
      highlight: "Empower your team to get instant answers from internal documents, chats, or client data.",
      color: "bg-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights Layer",
      description: "We turn your unified data into clear insights and dashboards your team can actually use.",
      highlight: "Track performance, monitor trends, and make informed decisions without the technical overhead.",
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* What We Do Section */}
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            data-testid="text-how-it-works-title"
          >
            💡 What We Do
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            data-testid="text-what-we-do-description"
          >
            Thynra helps businesses apply AI in practical ways — connecting information, automating processes, and turning data into intelligent action.
            <br />
            We focus on building reliable systems that grow with you, not just quick demos or experiments.
          </motion.p>
        </div>
        
        {/* Focus Areas Section */}
        <div className="mb-20">
          <motion.h3 
            className="text-3xl font-bold text-foreground text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            data-testid="text-focus-areas-title"
          >
            ⚙️ Our Focus Areas
          </motion.h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {focusAreas.map((area, index) => {
              const IconComponent = area.icon;
              return (
                <motion.div 
                  key={area.title}
                  className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-all"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-testid={`card-focus-area-${index}`}
                >
                  <div className={`w-14 h-14 ${area.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="text-white w-7 h-7" />
                  </div>
                  <h4 className="text-xl font-bold mb-3" data-testid={`text-focus-area-title-${index}`}>
                    {index + 1}. {area.title}
                  </h4>
                  <p className="text-muted-foreground mb-3 leading-relaxed" data-testid={`text-focus-area-description-${index}`}>
                    {area.description}
                  </p>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="text-primary mt-1 flex-shrink-0" />
                    <p className="text-primary font-medium" data-testid={`text-focus-area-highlight-${index}`}>
                      {area.highlight}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
