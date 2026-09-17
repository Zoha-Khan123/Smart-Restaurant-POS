import React, { useState, useMemo } from "react";
import { ChevronDown, HelpCircle, ThumbsUp, Check, ExternalLink } from "lucide-react";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";
import EmptyState from "../../../components/ui/EmptyState";
import { INITIAL_FAQS_DATA } from "../../../data/faqs";

export default function FAQList({ searchQuery = "", selectedCategory = "all", selectedTag = "all" }) {
  const [expandedIds, setExpandedIds] = useState(["FAQ-01"]);
  const [helpfulFeedback, setHelpfulFeedback] = useState({});

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleHelpful = (id) => {
    setHelpfulFeedback((prev) => ({ ...prev, [id]: true }));
  };

  const filteredFaqs = useMemo(() => {
    return INITIAL_FAQS_DATA.filter((faq) => {
      // 1. Category Filter
      if (selectedCategory !== "all" && faq.category !== selectedCategory) {
        return false;
      }

      // 2. Tag Filter
      if (selectedTag !== "all") {
        const matchesTag = faq.tags.some((t) =>
          t.toLowerCase().includes(selectedTag.toLowerCase())
        );
        if (!matchesTag) return false;
      }

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inQuestion = faq.question.toLowerCase().includes(q);
        const inAnswer = faq.answer.toLowerCase().includes(q);
        const inTags = faq.tags.some((t) => t.toLowerCase().includes(q));
        if (!inQuestion && !inAnswer && !inTags) return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedTag]);

  return (
    <Card
      title="Frequently Asked Questions & Runbooks"
      subtitle={`Showing ${filteredFaqs.length} relevant guides for platform operations.`}
      actions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setExpandedIds(
                expandedIds.length === filteredFaqs.length
                  ? []
                  : filteredFaqs.map((f) => f.id)
              )
            }
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            {expandedIds.length === filteredFaqs.length
              ? "Collapse All"
              : "Expand All"}
          </button>
        </div>
      }
    >
      {filteredFaqs.length === 0 ? (
        <EmptyState
          title="No FAQs Matched"
          message="No documentation articles match your current search query. Try broadening your keywords or create a new support ticket."
        />
      ) : (
        <div className="divide-y divide-border">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedIds.includes(faq.id);
            const isHelpful = Boolean(helpfulFeedback[faq.id]);

            return (
              <div key={faq.id} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full flex items-start justify-between gap-4 text-left cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-bg-main text-text-muted group-hover:text-primary group-hover:bg-primary-light transition-colors mt-0.5 shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                        {faq.question}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {faq.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-bg-main text-text-muted border border-border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-text-muted group-hover:text-text-primary transition-transform duration-200 shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isExpanded && (
                  <div className="mt-3.5 pl-9 pr-2 space-y-3 animate-in fade-in-50 duration-150">
                    <div className="text-xs text-text-secondary leading-relaxed whitespace-pre-line bg-bg-main/50 p-4 rounded-xl border border-border">
                      {faq.answer}
                    </div>

                    <div className="flex items-center justify-between text-xs text-text-muted pt-1">
                      <span className="text-[11px]">Was this answer helpful?</span>
                      <button
                        type="button"
                        onClick={() => handleHelpful(faq.id)}
                        disabled={isHelpful}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                          isHelpful
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-bg-card hover:bg-bg-hover text-text-secondary border-border"
                        }`}
                      >
                        {isHelpful ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Thanks for the feedback!</span>
                          </>
                        ) : (
                          <>
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>Helpful</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
