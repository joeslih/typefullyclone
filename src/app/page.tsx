import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold mb-2">
            Typefully Clone
          </CardTitle>
          <CardDescription className="text-lg">
            Create and schedule Twitter/X threads with ease
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="font-semibold">Compose threads</h3>
                <p className="text-sm text-muted-foreground">
                  Create engaging Twitter threads with up to 25 tweets
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="font-semibold">Live preview</h3>
                <p className="text-sm text-muted-foreground">
                  See exactly how your thread will look on Twitter
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="font-semibold">Schedule posts</h3>
                <p className="text-sm text-muted-foreground">
                  Schedule your threads for optimal engagement
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Link href="/compose">
              <Button size="lg" className="w-full">
                Start Composing
              </Button>
            </Link>
            <div className="text-center text-sm text-muted-foreground">
              A minimal clone of Typefully for learning purposes
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
