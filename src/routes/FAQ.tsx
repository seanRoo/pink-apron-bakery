import { motion } from "framer-motion";

import FadeInSection from "@/components/FadeInSection";

export default function FAQ() {
  const faqs = [
    {
      question: "When should I order?",
      answer: [
        "You can never be too early booking your cake.",
        "Ideally we like to have at least 2 weeks notice but get in touch as we may be able to fit in a cake last minute.",
      ],
    },
    {
      question: "Do I have to pick an existing design?",
      answer: [
        "No. You can use some of our previous cakes as inspiration but we love doing something new and different so let us know your ideas.",
      ],
    },
    {
      question: "Do you do gluten-free or dairy-free?",
      answer: [
        "Unfortunately we do not offer gluten free or dairy free as all our recipes require gluten and dairy.",
      ],
    },
    {
      question: "Do you deliver?",
      answer: [
        "It is collection only for celebration cakes.",
        "We offer delivery of all wedding cakes for a small fee.",
      ],
    },
    {
      question: "Can I make changes?",
      answer: [
        "Yes get in touch as soon as you know what changes need to be made.",
        "Changes can be made up to 48 hours before collection.",
      ],
    },
    {
      question: "How long will my cake last?",
      answer: [
        "If you have leftovers they will last up to a week once kept in the correct conditions.",
        "Either cover in tin foil so no air can get into the exposed cake or cut up and store in a sealed container.",
      ],
    },
    {
      question: "Do you require a deposit?",
      answer: [
        "We require a 50% deposit on celebration cakes and a 25% deposit on wedding cakes.",
        "The remaining balance must be paid before collection/delivery.",
      ],
    },
  ];

  return (
    <motion.section
      className="mx-auto max-w-4xl px-4 py-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-2xl bg-white p-6 shadow-lg md:p-10">
        <motion.h1
          className="text-rose font-script mb-2 text-4xl tracking-wide drop-shadow-sm md:text-5xl"
          style={{ textShadow: "0 2px 8px rgba(255, 192, 203, 0.15)" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
        >
          Frequently Asked Questions
        </motion.h1>
        <motion.div
          className="bg-rose/30 mb-8 h-1 w-16 rounded-full"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        />

        <div className="space-y-8">
          {faqs.map((faq, i) => (
            <FadeInSection key={i} delay={i * 0.05}>
              <div className="border-rose/10 border-b pb-6 last:border-b-0">
                <h2 className="text-apron mb-3 font-body text-xl font-semibold">{faq.question}</h2>
                <div className="text-warmgray space-y-2">
                  {faq.answer.map((paragraph, j) => (
                    <p key={j} className="text-base font-medium leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

