import { SEO } from "@/components/shared/SEO";
import { Header } from "@/components/shared/Header";
import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service"
        description="Terms and conditions for using our food analysis service"
        keywords="terms of service, terms and conditions, user agreement, legal terms, food analysis terms"
      />
      <Header showNavigation={false} />
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card rounded-lg shadow-lg p-8 dark:bg-card/50 backdrop-blur-sm">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                By accessing or using our food analysis service, you agree to be
                bound by these Terms of Service and all applicable laws and
                regulations. If you do not agree with any of these terms, you
                are prohibited from using or accessing this service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Use License</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We grant you a limited, non-exclusive, non-transferable license
                to use our service for personal, non-commercial purposes. This
                license is subject to these Terms of Service.
              </p>
              <ul className="list-disc list-inside mt-2 ml-4 text-gray-700 dark:text-gray-300">
                <li>You must not modify or copy our service's materials</li>
                <li>You must not use the service for commercial purposes</li>
                <li>
                  You must not attempt to decompile or reverse engineer any
                  software
                </li>
                <li>
                  You must not remove any copyright or proprietary notations
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                User Responsibilities
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                As a user of our service, you are responsible for:
              </p>
              <ul className="list-disc list-inside mt-2 ml-4 text-gray-700 dark:text-gray-300">
                <li>Maintaining the confidentiality of your account</li>
                <li>All activities that occur under your account</li>
                <li>Ensuring your use complies with applicable laws</li>
                <li>Providing accurate information</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Service Plan and Usage Limits
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                We currently offer a free plan only. To ensure fair usage, each
                account is limited to 20 image scans per day and 20 chat
                messages per day. These limits reset at 12:00 AM Indian Standard
                Time (IST, UTC+5:30). We may adjust limits or introduce paid
                plans in the future with prior notice.
              </p>
              <ul className="list-disc list-inside mt-2 ml-4 text-gray-700 dark:text-gray-300">
                <li>
                  Usage limits are enforced per account and per calendar day in
                  IST
                </li>
                <li>Automated or abusive usage may lead to suspension</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Time Zone and Notifications
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                All service schedules, timestamps, and notifications are based
                on Indian Standard Time (IST, UTC+5:30). If you are located
                outside India, you may receive notifications according to IST.
                Where possible, we label times as IST within the product.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Contact and Support
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                For questions about these Terms, contact us at{" "}
                <a
                  href="mailto:info.wellnessailens@gmail.com"
                  className="text-primary hover:underline"
                >
                  info.wellnessailens@gmail.com
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Our service is provided "as is" without any warranties,
                expressed or implied. We do not warrant that the service will be
                uninterrupted, timely, secure, or error-free. The food analysis
                results should not be considered as professional medical or
                nutritional advice.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
              <p className="text-gray-700 dark:text-gray-300">
                In no event shall we be liable for any damages arising out of
                the use or inability to use our service, even if we have been
                notified of the possibility of such damages.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="text-gray-700 dark:text-gray-300">
                We reserve the right to modify these terms at any time. We will
                notify users of any material changes by posting the new Terms of
                Service on this page.
              </p>
            </div>
          </section>

          <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/10">
            <h2 className="text-2xl font-semibold mb-4">Terms Updates</h2>
            <p className="text-gray-700 dark:text-gray-300">
              These terms are effective as of the date below and will remain in
              effect except with respect to any changes in its provisions in the
              future. By continuing to access or use our Service after any
              revisions become effective, you agree to be bound by the revised
              terms.
            </p>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Last Updated: {new Date().toLocaleDateString()}
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
