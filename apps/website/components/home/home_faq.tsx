// Home FAQ (Paper "10 FAQ"): heading in a 4/8 split with the question list. Server-safe; FaqList is the client piece.
// Answers: only question 1 has an answer in Paper, and it is used verbatim. Paper shows questions 2 to 9 collapsed
// with no answer text, so their answers are visible owner placeholders until the owner supplies the wording.
import { PageSection } from '@testify/style-guide/components/PageSection'
import { SectionHeader } from '@/components/site/section_header'
import { FaqList } from '@/components/site/faq_list'

const TO_SUPPLY = '[ANSWER: owner to supply]'

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'What do you do?',
    answer:
      'We run your social media. We plan the month, make the posts and videos, post them, and send replies for your OK. Nothing goes out until you say yes.',
  },
  { question: 'Will it sound like me?', answer: TO_SUPPLY },
  { question: 'Do I have to be on camera?', answer: TO_SUPPLY },
  { question: 'How much time does it take?', answer: TO_SUPPLY },
  {
    question: 'I paid an agency before and got nothing. Why is this different?',
    answer: TO_SUPPLY,
  },
  { question: 'How do I know it will work for me?', answer: TO_SUPPLY },
  { question: 'What does it cost?', answer: TO_SUPPLY },
  { question: "What if I don't like a post?", answer: TO_SUPPLY },
  { question: 'Word of mouth already keeps me busy. Why bother?', answer: TO_SUPPLY },
]

export function HomeFaq() {
  return (
    <PageSection
      flush
      width="grid"
      aria-labelledby="home-faq-heading"
      className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-x-12"
    >
      <div className="lg:col-span-4">
        <SectionHeader
          id="home-faq-heading"
          kicker="Questions"
          heading="Straight answers."
          size="h2"
          align="left"
        />
      </div>
      <div className="min-w-0 lg:col-span-8">
        <FaqList items={FAQ_ITEMS} ariaLabel="Frequently asked questions" />
      </div>
    </PageSection>
  )
}
