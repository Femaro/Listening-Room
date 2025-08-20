export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Global Regions</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>🌍 Africa (10 countries)</li>
              <li>🇪🇺 Europe (12 countries)</li>
              <li>🇺🇸 North America (3 countries)</li>
              <li>🌏 Asia Pacific (15+ countries)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/how-it-works" className="hover:text-white">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/safety" className="hover:text-white">
                  Safety & Privacy
                </a>
              </li>
              <li>
                <a href="/crisis-resources" className="hover:text-white">
                  Crisis Resources
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Get Involved</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/volunteer" className="hover:text-white">
                  Become a Volunteer
                </a>
              </li>
              <li>
                <a href="/donate" className="hover:text-white">
                  Make a Donation
                </a>
              </li>
              <li>
                <a href="/training" className="hover:text-white">
                  Training Program
                </a>
              </li>
              <li>
                <a href="/volunteer-guide" className="hover:text-white">
                  Volunteer Guide
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="/privacy" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; 2025 CLAEVA INTERNATIONAL LLC. Making mental health support
            accessible worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
