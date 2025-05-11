import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignInLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
