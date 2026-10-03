import { SEO } from "@/components/shared/SEO";
import { Header } from "@/components/shared/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MapPin,
  Linkedin,
  Github,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with our team for support, feedback, or inquiries about our food analysis service. We're here to help with all your food analysis needs."
        keywords="contact us, customer support, food analysis help, feedback, customer service, technical support, food analysis contact"
        type="website"
        section="Contact"
      />
      <Header showNavigation={false} />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our food analysis service? We're here to help!
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Email Contact */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Email Us</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Send us an email for support, feedback, or general inquiries
              </p>
              <Button asChild className="w-full">
                <a
                  href="mailto:info.wellnessailens@gmail.com"
                  className="flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  info.wellnessailens@gmail.com
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* LinkedIn */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                <Linkedin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-xl">Connect on LinkedIn</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-4">
                Follow our journey and stay updated with the latest developments
              </p>
              <Button asChild variant="outline" className="w-full">
                <a
                  href="https://www.linkedin.com/in/jayesh--jain/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  Jayesh Jain
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800 mb-12">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Important Notes</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>
                All system notifications and schedules are based on Indian
                Standard Time (IST, UTC+5:30).
              </li>
              <li>
                Free plan includes 20 image scans and 20 chat messages per day.
                Resets daily at 12:00 AM IST.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Response Time Info */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageCircle className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Response Time</h3>
            </div>
            <p className="text-center text-muted-foreground">
              We typically respond to all inquiries within{" "}
              <Badge variant="secondary">24 hours</Badge> during business days.
            </p>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">
                  How quickly do you respond to inquiries?
                </h3>
                <p className="text-muted-foreground">
                  We typically respond to all inquiries within 24 hours during
                  business days.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">
                  What type of support do you offer?
                </h3>
                <p className="text-muted-foreground">
                  We provide technical support, account assistance, and help
                  with food analysis features.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">
                  Do you offer emergency support?
                </h3>
                <p className="text-muted-foreground">
                  We currently do not offer paid plans. Support is best-effort
                  for all users on the free plan; no guaranteed SLAs or
                  emergency support.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">
                  What are the current usage limits?
                </h3>
                <p className="text-muted-foreground">
                  The free plan includes 20 image scans per day and 20 chat
                  messages per day per account. Limits reset at 12:00 AM IST
                  (UTC+5:30).
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Can I request a feature?</h3>
                <p className="text-muted-foreground">
                  We welcome feature requests and regularly review user feedback
                  for future updates.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-16">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-lg font-semibold">
              <span className="text-primary">Wellness</span> AI Lens
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              © 2025 All rights reserved
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link
              to="/contact"
              className="hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
