import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Search, MessageCircle, Book, Mail } from 'lucide-react'

export default function Help() {
  const faqs = [
    {
      question: 'How does the AI analyze contracts?',
      answer: 'Our AI-powered platform uses advanced natural language processing to identify legal, financial, compliance, and operational risks in your contracts. It compares clauses against industry standards and flags potential issues.'
    },
    {
      question: 'What file formats are supported?',
      answer: 'We currently support PDF, DOCX, and TXT file formats. Simply upload your contract and our system will process it automatically.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use enterprise-grade encryption and follow strict data privacy protocols. Your contracts are processed securely and are never shared with third parties.'
    },
    {
      question: 'How accurate is the risk analysis?',
      answer: 'Our AI model has been trained on millions of contracts and achieves high accuracy in risk identification. However, we recommend reviewing all findings with legal counsel for critical decisions.'
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">How can we help?</h1>
          <p className="text-lg text-slate-600 mb-8">Find answers to common questions or reach out to our team</p>
          
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input 
              placeholder="Search for help..." 
              className="pl-10 py-6 text-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Book className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Browse our comprehensive guides and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="px-0">View Documentation →</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <MessageCircle className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>
                Chat with our support team in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="px-0">Start Chat →</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Mail className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Email Support</CardTitle>
              <CardDescription>
                Send us an email and we'll respond within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="px-0">support@contractrisk.ai →</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

