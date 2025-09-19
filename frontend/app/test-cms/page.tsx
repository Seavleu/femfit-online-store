import CMSIntegrationTest from '@/components/CMSIntegrationTest'

export default function TestCMSPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">CMS Integration Test</h1>
        <p className="text-muted-foreground mt-2">
          Testing Strapi CMS integration with your Next.js app
        </p>
      </div>
      
      <CMSIntegrationTest />
    </div>
  )
}
