import React from "react";

export default function EmotionSupportHomepage() {
  const services = [
    {
      title: 'Emotional Support',
      text: 'Talk to someone who understands and cares about your feelings.',
      icon: '💜',
    },
    {
      title: 'Self Care Tools',
      text: 'Helpful daily habits and wellness activities for your mind.',
      icon: '🌱',
    },
    {
      title: 'Resources',
      text: 'Articles, guides, and advice to help you feel stronger.',
      icon: '📚',
    },
    {
      title: 'Community',
      text: 'Connect with people who support and encourage each other.',
      icon: '🤝',
    },
  ];

  const blogs = [
    {
      title: '5 Self Care Habits To Try',
      text: 'Simple habits that can improve your mental well-being every day.',
      image:
        'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'Managing Anxiety',
      text: 'Practical tips that can help you feel more calm and focused.',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
    },
    {
      title: 'The Power Of Talking',
      text: 'Opening up to someone can make a big difference in your life.',
      image:
        'https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1200&auto=format&fit=crop',
    },
  ];

  return (// Keyboard Navigation Shortcuts
    React.useEffect(() => {

      const handleKeyPress = (event) => {

        // Ignore typing inside inputs
        const tag = document.activeElement.tagName;

        if (
          tag === "INPUT" ||
          tag === "TEXTAREA"
        ) {
          return;
        }

        const key = event.key.toLowerCase();

        // Sections
        if (key === "h") {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }

        if (key === "a") {
          document
            .querySelector("section:nth-of-type(4)")
            ?.scrollIntoView({
              behavior: "smooth",
            });
        }

        if (key === "s") {
          document
            .querySelector("section:nth-of-type(2)")
            ?.scrollIntoView({
              behavior: "smooth",
            });
        }

        if (key === "r") {
          document
            .querySelector("section:nth-of-type(5)")
            ?.scrollIntoView({
              behavior: "smooth",
            });
        }

        if (key === "c") {
          document
            .querySelector("footer")
            ?.scrollIntoView({
              behavior: "smooth",
            });
        }
      };

      document.addEventListener("keydown", handleKeyPress);

      return () => {
        document.removeEventListener("keydown", handleKeyPress);
      };

    }, []),
    <div className="bg-[#f7f6fb] text-gray-900 min-h-screen font-sans">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Mindful</h1>
            <p className="text-xs text-gray-300">You matter.</p>
          </div>

          <ul className="hidden md:flex gap-8 text-white font-medium">
            <li className="hover:text-purple-300 cursor-pointer">Home</li>
            <li className="hover:text-purple-300 cursor-pointer">About</li>
            <li className="hover:text-purple-300 cursor-pointer">Services</li>
            <li className="hover:text-purple-300 cursor-pointer">Resources</li>
            <li className="hover:text-purple-300 cursor-pointer">Contact</li>
          </ul>

          <button className="bg-purple-500 hover:bg-purple-600 transition text-white px-5 py-2 rounded-full font-semibold shadow-lg">
            Get Support
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-5">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight max-w-4xl">
            Every Emotion <span className="text-purple-300">Matters</span>
          </h1>

          <p className="mt-6 text-lg md:text-2xl text-gray-200 max-w-2xl">
            A safe digital space to feel, heal, and grow. You are never alone.
          </p>

          <div className="flex flex-wrap gap-4 mt-10 justify-center">
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl transition">
              Get Support
            </button>

            <button className="border border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-full text-lg font-semibold transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[4px] text-purple-500 font-semibold text-sm">
            We Are Here For You
          </p>
          <h2 className="text-5xl font-bold mt-4">How We Can Help</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-2xl transition duration-300"
            >
              <div className="text-5xl">{service.icon}</div>
              <h3 className="text-2xl font-bold mt-6">{service.title}</h3>
              <p className="text-gray-600 mt-4 leading-relaxed">{service.text}</p>
              <button className="mt-6 text-purple-500 font-semibold hover:underline">
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-10 items-center bg-white rounded-[40px] overflow-hidden shadow-xl">
          <div className="p-12">
            <p className="uppercase tracking-[4px] text-purple-500 font-semibold text-sm">
              About Us
            </p>

            <h2 className="text-5xl font-bold mt-4 leading-tight">
              Compassion. <br /> Support. Hope.
            </h2>

            <p className="mt-6 text-gray-600 text-lg leading-relaxed">
              We believe everyone deserves emotional support and a place where
              their feelings are respected. Our mission is to inspire healing,
              growth, and positivity.
            </p>

            <button className="mt-8 bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full font-semibold transition shadow-lg">
              Learn More
            </button>
          </div>

          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-5xl font-bold text-purple-500">10K+</h3>
            <p className="mt-3 text-gray-600">People Helped</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-5xl font-bold text-purple-500">50+</h3>
            <p className="mt-3 text-gray-600">Support Groups</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-5xl font-bold text-purple-500">100+</h3>
            <p className="mt-3 text-gray-600">Helpful Resources</p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-5xl font-bold text-purple-500">24/7</h3>
            <p className="mt-3 text-gray-600">Always Available</p>
          </div>
        </div>
      </section>

      {/* BLOGS */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[4px] text-purple-500 font-semibold text-sm">
            From Our Blog
          </p>
          <h2 className="text-5xl font-bold mt-4">Tips & Insights</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition"
            >
              <img
                src={blog.image}
                className="h-64 w-full object-cover"
              />

              <div className="p-8">
                <h3 className="text-2xl font-bold">{blog.title}</h3>
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {blog.text}
                </p>

                <button className="mt-6 text-purple-500 font-semibold hover:underline">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-gradient-to-r from-purple-200 to-purple-100 rounded-[40px] p-12 text-center shadow-xl">
          <h2 className="text-4xl font-bold">Stay Connected</h2>

          <p className="mt-4 text-gray-700 text-lg max-w-2xl mx-auto">
            Subscribe to receive helpful mental wellness tips and support
            resources.
          </p>

          <div className="flex flex-col md:flex-row gap-4 mt-10 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full outline-none text-lg"
            />

            <button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-full font-semibold transition shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#070b1c] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div>
            <h2 className="text-3xl font-bold">Mindful</h2>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Supporting your emotional journey with compassion and care.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-3 text-gray-400">
              <li>Home</li>
              <li>About</li>
              <li>Services</li>
              <li>Resources</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5">Support</h3>
            <ul className="space-y-3 text-gray-400">
              <li>Community</li>
              <li>Articles</li>
              <li>Guides</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5">Need Help?</h3>
            <p className="text-gray-400 leading-relaxed">
              Reach out whenever you need emotional support.
            </p>

            <button className="mt-6 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-full font-semibold transition">
              Get Help Now
            </button>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 text-center text-gray-500">
          © 2026 Mindful. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
