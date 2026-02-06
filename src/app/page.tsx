import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Zap,
  Eye,
  Lock,
  Code,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Hallucination Detection",
    description:
      "Detect AI-generated code that references non-existent APIs, methods, or packages.",
  },
  {
    icon: Shield,
    title: "Security Analysis",
    description:
      "Identify security vulnerabilities like XSS, SQL injection, and hardcoded secrets.",
  },
  {
    icon: Code,
    title: "Deprecated Method Detection",
    description:
      "Find outdated APIs and get suggestions for modern alternatives.",
  },
  {
    icon: TrendingUp,
    title: "Trust Score",
    description:
      "Get a comprehensive trust score based on multiple quality factors.",
  },
  {
    icon: Zap,
    title: "Instant Analysis",
    description:
      "Analyze code in seconds with our powerful analysis engine.",
  },
  {
    icon: Lock,
    title: "Private & Secure",
    description:
      "Your code is never stored permanently and analyzed in isolation.",
  },
];

const exampleIssues = [
  {
    type: "Hallucinated API",
    severity: "error",
    message: 'Array.flatten() does not exist. Use Array.flat() instead.',
  },
  {
    type: "Security",
    severity: "error",
    message: "Hardcoded credentials detected in source code.",
  },
  {
    type: "Deprecated",
    severity: "warning",
    message: "componentWillMount is deprecated since React 16.3.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Now supporting TypeScript, JavaScript & Python
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Trust Your{" "}
              <span className="text-primary">AI-Generated</span> Code
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Code Trust Scorer analyzes AI-generated code for hallucinated APIs,
              deprecated methods, and security vulnerabilities. Get a trust score
              before you ship.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/scanner">
                  Try Scanner Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Example Output Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Here&apos;s what Code Trust Scorer finds in AI-generated code
              </p>
            </div>
            <div className="max-w-2xl mx-auto space-y-4">
              {exampleIssues.map((issue, index) => (
                <Card key={index} className={`border-l-4 ${
                  issue.severity === "error" 
                    ? "border-l-red-500" 
                    : "border-l-yellow-500"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        issue.severity === "error"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-yellow-100 dark:bg-yellow-900/30"
                      }`}>
                        <CheckCircle className={`h-4 w-4 ${
                          issue.severity === "error"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={issue.severity === "error" ? "error" : "warning"}>
                            {issue.severity}
                          </Badge>
                          <span className="text-sm font-medium">{issue.type}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {issue.message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Comprehensive Code Analysis
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Code Trust Scorer provides deep analysis to ensure your
                AI-assisted code is production-ready.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Trust Your Code?
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Start analyzing your AI-generated code today. No credit card
              required.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Code Trust Scorer</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Code Trust Scorer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
