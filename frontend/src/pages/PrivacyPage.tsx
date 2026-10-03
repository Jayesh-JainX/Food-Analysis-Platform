import { SEO } from "@/components/shared/SEO";
import { Header } from "@/components/shared/Header";
import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Our commitment to protecting your privacy and personal information"
        keywords="privacy policy, data protection, user privacy, personal information, data security, food analysis privacy"
      />
      <Header showNavigation={false} />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card rounded-lg shadow-lg p-8 dark:bg-card/50 backdrop-blur-sm">
          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Information We Collect
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                We collect information that you provide directly to us,
                including when you create an account, use our food scanning
                features, or contact us for support. This may include:
              </p>
              <ul className="list-disc list-inside mt-2 ml-4 text-gray-700 dark:text-gray-300">
                <li>Name and contact information</li>
                <li>Account credentials</li>
                <li>Food scanning history and preferences</li>
                <li>Device and usage information</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                How We Use Your Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                We use the collected information to:
              </p>
              <ul className="list-disc list-inside mt-2 ml-4 text-gray-700 dark:text-gray-300">
                <li>Provide and improve our food analysis services</li>
                <li>Personalize your experience</li>
                <li>Send important updates and notifications</li>
                <li>Ensure the security of our services</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-gray-700 dark:text-gray-300">
                You have the right to:
              </p>
              <ul className="list-disc list-inside mt-2 ml-4 text-gray-700 dark:text-gray-300">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Service Plan and Usage Limits
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                We currently offer a free plan with daily limits of 20 image
                scans and 20 chat messages per account. To enforce these limits,
                we process usage metadata (such as counts and timestamps). These
                limits reset at 12:00 AM Indian Standard Time (IST, UTC+5:30).
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Time Zone and Notifications
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                All system schedules, timestamps, and notifications are based on
                Indian Standard Time (IST, UTC+5:30). Usage logs used for limit
                calculations and notifications may therefore reflect IST.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300">
                If you have any questions about this Privacy Policy, please
                contact us at:
                <br />
                <a
                  href="mailto:info.wellnessailens@gmail.com"
                  className="text-primary hover:underline"
                >
                  info.wellnessailens@gmail.com
                </a>
              </p>
            </div>
          </section>

          <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/10">
            <h2 className="text-2xl font-semibold mb-4">
              Privacy Policy Updates
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We reserve the right to update this privacy policy at any time. We
              will notify you of any changes by posting the new privacy policy
              on this page and updating the "Last Modified" date below.
            </p>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Last Modified: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="border-t py-8">
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
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
