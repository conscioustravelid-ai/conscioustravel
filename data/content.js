const CONTENT = {
  id: {
    nav: {
      links: [
        { label: "Experiences", href: "#experiences" },
        { label: "Corporate", href: "#packages" },
        { label: "Impact", href: "#impact" },
        { label: "Reviews", href: "#clients" },
        { label: "Inquiry", href: "#inquiry" },
      ],
      cta: "Diskusi via WhatsApp",
    },
    hero: {
      eyebrow: "Sustainable journeys. Meaningful impact.",
      headline: "Company Outing & Meaningful Trip in Bali",
      subheadline:
        "Conscioustravel membantu perusahaan, komunitas, dan small group merancang perjalanan di Bali yang fun, rapi, dan punya nilai positif untuk tim maupun tempat yang dikunjungi.",
      primaryCta: "Diskusi via WhatsApp",
      secondaryCta: "Lihat Paket",
      trustNotes: [
        "Curated outing & private trip",
        "Team building facilitator",
        "Responsible travel element",
        "Dokumentasi tersedia",
        "Custom itinerary",
      ],
    },
    audience: {
      title: "Dirancang untuk Kebutuhan Trip yang Berbeda",
      description:
        "Baik untuk outing perusahaan maupun daily trip bersama group kecil, setiap perjalanan bisa disesuaikan dengan tujuan, jumlah peserta, dan gaya pengalaman yang kamu inginkan.",
      cards: [
        {
          icon: "🏢",
          title: "Untuk Perusahaan",
          description:
            "Outing kantor, team building, CSR activity, dan company gathering yang dirancang lebih rapi, fun, dan bermakna.",
          cta: "Tanya Paket Outing",
          waMsg:
            "Halo Conscioustravel, saya ingin tanya paket trip / outing di Bali. Bisa dibantu rekomendasinya?",
        },
        {
          icon: "🌿",
          title: "Untuk Daily Trip & Small Group",
          description:
            "Private daily trip dan itinerary custom untuk keluarga, teman, pasangan, atau group kecil yang ingin explore Bali dengan cara yang lebih personal.",
          cta: "Buat Trip Custom",
          waMsg:
            "Halo Conscioustravel, saya ingin tanya paket daily trip custom di Bali. Bisa dibantu rekomendasi itinerary?",
        },
      ],
    },
    packages: {
      title: "Paket Outing Kantor di Bali",
      description:
        "Pilih format outing yang paling cocok untuk tim kamu — dari nature escape di Ubud atau Kintamani, sampai beach club party yang tetap punya cerita dan nilai positif.",
      items: [
        {
          id: "nature-escape",
          title: "Bali Starter",
          subtitle: "Nature Escape + Impact Light",
          location: "Ubud / Kintamani",
          price: "Mulai Rp750.000/pax",
          minPax: "Min. 50 pax",
          image: "assets/images/kintamani-outing-cover.png",
          imageAlt: "Team building activity in Kintamani Bali with Conscioustravel",
          description:
            "Paket outing untuk perusahaan yang ingin membawa tim keluar dari rutinitas, menikmati suasana alam Bali, dan menambahkan aktivitas ringan yang punya nilai positif.",
          includes: [
            "Team building facilitator",
            "Outdoor games",
            "Local lunch / refreshment",
            "Sustainable goodie bag",
            "CSR / donation",
            "Dokumentasi",
            "Responsible travel briefing",
            "Eco challenge ringan",
          ],
          addons: [
            "Jeep / ATV",
            "Waste sorting challenge",
            "Tree / plant support",
            "Impact report",
            "Drone / video recap",
          ],
          cta: "Tanya Paket Nature Escape",
          waMsg:
            "Halo Conscioustravel, saya tertarik dengan paket Bali Starter — Nature Escape + Impact Light untuk outing kantor. Bisa dibantu info paket dan availability?",
        },
        {
          id: "beach-club",
          title: "Bali Starter",
          subtitle: "Beach Club Party with Purpose",
          location: "Nuanu / Atlas",
          price: "Mulai Rp750.000/pax",
          minPax: "Min. 50 pax",
          image: "assets/images/beach-team-building.png",
          imageAlt: "Beach team building activity for company outing in Bali",
          description:
            "Paket outing untuk perusahaan yang ingin menggabungkan team building, beach club party, dan short impact moment agar acara tetap fun namun punya cerita.",
          includes: [
            "Beach team building",
            "Dinner / party event",
            "Event coordination",
            "Sustainable goodie bag",
            "CSR / donation",
            "Dokumentasi",
            "Low-waste event guideline",
            "Short impact moment before party",
          ],
          addons: [
            "MC",
            "Live music",
            "DJ / entertainment",
            "Insta360 / video recap",
            "Beach clean-up challenge",
            "Custom company banner",
            "Impact report",
          ],
          cta: "Tanya Paket Beach Club Party",
          waMsg:
            "Halo Conscioustravel, saya tertarik dengan paket Bali Starter — Beach Club Party with Purpose untuk outing kantor. Bisa dibantu info paket dan availability?",
        },
      ],
    },
    dailyTrip: {
      title: "Daily Trip & Small Group Custom",
      description:
        "Untuk kamu yang ingin explore Bali dengan itinerary yang lebih fleksibel, Conscioustravel bisa membantu merancang daily trip sesuai gaya perjalananmu — mulai dari nature escape, cultural trip, beach hopping, hidden gem, hingga local food experience.",
      tripTypes: [
        "Uluwatu sunset trip",
        "Kintamani jeep / nature trip",
        "Ubud culture & local experience",
        "Beach hopping",
        "Family trip",
        "Couple trip",
        "Small group custom itinerary",
      ],
      cta: "Buat Daily Trip Custom",
      waMsg:
        "Halo Conscioustravel, saya ingin tanya paket daily trip custom di Bali. Bisa dibantu rekomendasi itinerary?",
    },
    why: {
      title: "Kenapa Conscioustravel?",
      benefits: [
        {
          icon: "✦",
          title: "Curated, Not Random",
          description:
            "Setiap itinerary dirancang sesuai kebutuhan group, bukan sekadar menyusun tempat wisata.",
        },
        {
          icon: "◎",
          title: "Fun, Organized, and Human",
          description:
            "Kami menggabungkan event flow yang rapi dengan pengalaman yang tetap hangat dan menyenangkan.",
        },
        {
          icon: "🌱",
          title: "Local & Responsible",
          description:
            "Kami mendorong perjalanan yang lebih sadar melalui local partner, responsible travel briefing, dan aktivitas berdampak ringan.",
        },
        {
          icon: "💼",
          title: "Ready for Corporate Needs",
          description:
            "Mulai dari facilitator, documentation, event coordination, hingga optional impact report.",
        },
      ],
    },
    impact: {
      title: "Small Impact, Better Story",
      description:
        "Tidak semua outing harus menjadi program CSR besar. Dengan konsep Impact Light, perusahaan bisa menambahkan aktivitas sederhana seperti donation, responsible travel briefing, waste sorting challenge, local support, atau tree / plant support agar perjalanan terasa lebih bermakna.",
      cta: "Pelajari Format Impact Light",
      waMsg:
        "Halo Conscioustravel, saya ingin tahu lebih lanjut tentang konsep Impact Light untuk outing kantor kami.",
      items: [
        { icon: "💚", label: "Responsible Travel Briefing" },
        { icon: "🍽️", label: "Local Lunch & Support" },
        { icon: "🌳", label: "Tree / Plant Support" },
        { icon: "♻️", label: "Waste Sorting Challenge" },
        { icon: "🤝", label: "CSR / Donation" },
        { icon: "📋", label: "Impact Report" },
      ],
    },
    gallery: {
      title: "Experience Preview",
      description:
        "Beberapa gambaran aktivitas yang bisa dirancang bersama Conscioustravel — dari nature outing, jeep adventure, local lunch, beach team building, hingga group dinner.",
      images: [
        { src: "assets/images/kintamani-outing-cover.png", alt: "Team building activity in Kintamani Bali", label: "Nature Outing" },
        { src: "assets/images/jeep-adventure.png", alt: "Jeep adventure experience in Kintamani Bali", label: "Jeep Adventure" },
        { src: "assets/images/games-in-nature.png", alt: "Outdoor team building games in nature in Bali", label: "Team Building" },
        { src: "assets/images/group-local-lunch.png", alt: "Company group enjoying lunch at a local restaurant in Bali", label: "Local Lunch" },
        { src: "assets/images/beach-team-building.png", alt: "Beach team building activity for company outing in Bali", label: "Beach Activity" },
        { src: "assets/images/group-dinner-party.png", alt: "Corporate group dinner and party event in Bali", label: "Group Dinner" },
        { src: "assets/images/local-restaurant-cover.png", alt: "Travelers enjoying local restaurant experience in Bali", label: "Local Experience" },
        { src: "assets/images/local-restaurant-simple.png", alt: "Local food experience in Bali", label: "Food Experience" },
      ],
    },
    clients: {
      title: "Dipercaya oleh Company, Community, dan Private Group",
      description:
        "Conscioustravel telah mendukung berbagai kebutuhan perjalanan dan pengalaman group dari perusahaan, komunitas, hingga private trip.",
      names: ["DBS", "Astra FSCM", "Lumbung Architecture Bali", "BFB", "Lazada", "PT Gesit"],
      reviewCta: "Lihat Google Review",
    },
    inquiry: {
      title: "Butuh Paket yang Lebih Custom?",
      description:
        "Ceritakan kebutuhan outing atau trip kamu. Tim Conscioustravel akan membantu merekomendasikan format perjalanan yang paling sesuai.",
      cta: "Kirim Inquiry",
      successTitle: "Inquiry kamu sudah terkirim!",
      successMsg:
        "Tim Conscioustravel akan menghubungi kamu melalui WhatsApp untuk membantu merekomendasikan paket yang paling sesuai.",
      successCta: "Lanjut Chat via WhatsApp",
      errorMsg: "Mohon cek kembali data yang wajib diisi.",
      privacyNote:
        "Dengan mengirim form ini, kamu setuju untuk dihubungi oleh tim Conscioustravel melalui WhatsApp atau email terkait kebutuhan trip kamu.",
      fields: {
        name: "Nama Lengkap",
        whatsapp: "Nomor WhatsApp",
        email: "Email (opsional)",
        inquiryType: "Jenis Kebutuhan",
        customerType: "Tipe Customer",
        companyName: "Nama Perusahaan / Instansi (opsional)",
        preferredPackage: "Paket yang Diminati",
        destination: "Area Tujuan",
        participants: "Perkiraan Jumlah Peserta",
        tripDate: "Tanggal Rencana Trip (opsional)",
        budget: "Estimasi Budget per Pax (opsional)",
        message: "Ceritakan Kebutuhan Kamu",
        messagePlaceholder:
          "Contoh: Kami ingin outing 1 hari untuk 60 orang di area Kintamani dengan team building, lunch, dokumentasi, dan aktivitas CSR ringan.",
        submit: "Kirim Inquiry",
      },
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "Apakah paket bisa dicustom?",
          a: "Bisa. Paket bisa disesuaikan berdasarkan jumlah peserta, tujuan acara, venue, durasi, dan kebutuhan perusahaan.",
        },
        {
          q: "Apakah bisa untuk group di bawah 50 pax?",
          a: "Bisa untuk custom request, namun harga dan format acara akan disesuaikan.",
        },
        {
          q: "Apakah sudah termasuk transport?",
          a: "Tergantung kebutuhan paket. Tim kami bisa membantu menyiapkan opsi transport, venue, aktivitas, dan dokumentasi.",
        },
        {
          q: "Apakah bisa dibuatkan proposal untuk perusahaan?",
          a: "Bisa. Silakan hubungi kami via WhatsApp atau isi inquiry form untuk diskusi kebutuhan awal.",
        },
        {
          q: "Apakah tersedia itinerary untuk daily trip?",
          a: "Ya. Daily trip bisa dibuat custom sesuai preferensi destinasi, waktu, dan gaya perjalanan.",
        },
      ],
    },
    finalCta: {
      title: "Siap Merancang Outing atau Trip yang Lebih Bermakna?",
      description:
        "Ceritakan kebutuhan tim atau group kamu. Tim Conscioustravel akan membantu merekomendasikan format perjalanan yang paling cocok.",
      cta: "Diskusi Sekarang via WhatsApp",
    },
    footer: {
      description:
        "Conscioustravel.id adalah travel partner untuk company outing, daily trip, dan pengalaman perjalanan yang lebih bermakna di Bali.",
      legal: "PT Wisata Perjalanan Bermakna",
      address: "GG Mangga no.16 Pemecutan Klod, Denpasar Barat, Denpasar, Bali",
      whatsapp: "085195559749",
      copyright: "© 2025 Conscioustravel.id — PT Wisata Perjalanan Bermakna",
    },
  },

  en: {
    nav: {
      links: [
        { label: "Experiences", href: "#experiences" },
        { label: "Corporate", href: "#packages" },
        { label: "Impact", href: "#impact" },
        { label: "Reviews", href: "#clients" },
        { label: "Inquiry", href: "#inquiry" },
      ],
      cta: "Discuss via WhatsApp",
    },
    hero: {
      eyebrow: "Sustainable journeys. Meaningful impact.",
      headline: "Company Outing & Meaningful Trips in Bali",
      subheadline:
        "Conscioustravel helps companies, communities, and small groups design Bali trips that are fun, well-organized, and thoughtfully connected to local experiences and positive impact.",
      primaryCta: "Discuss via WhatsApp",
      secondaryCta: "View Packages",
      trustNotes: [
        "Curated outing & private trip",
        "Team building facilitator",
        "Responsible travel elements",
        "Documentation available",
        "Custom itinerary",
      ],
    },
    audience: {
      title: "Designed for Different Trip Needs",
      description:
        "Whether it is a company outing or a private daily trip for a small group, each journey can be customized based on your goals, group size, and preferred travel style.",
      cards: [
        {
          icon: "🏢",
          title: "For Companies",
          description:
            "Company outings, team building, CSR activities, and corporate gatherings designed to be organized, fun, and meaningful.",
          cta: "Ask About Outing Packages",
          waMsg:
            "Hi Conscioustravel, I'd like to ask about trip / outing packages in Bali. Could you help recommend the best option?",
        },
        {
          icon: "🌿",
          title: "For Daily Trips & Small Groups",
          description:
            "Private daily trips and custom itineraries for families, friends, couples, or small groups who want to explore Bali in a more personal way.",
          cta: "Create a Custom Trip",
          waMsg:
            "Hi Conscioustravel, I'd like to ask about a custom daily trip in Bali. Could you help recommend an itinerary?",
        },
      ],
    },
    packages: {
      title: "Company Outing Packages in Bali",
      description:
        "Choose the outing format that fits your team — from a nature escape in Ubud or Kintamani to a beach club party with a purposeful story.",
      items: [
        {
          id: "nature-escape",
          title: "Bali Starter",
          subtitle: "Nature Escape + Impact Light",
          location: "Ubud / Kintamani",
          price: "Starting from Rp750,000/pax",
          minPax: "Min. 50 pax",
          image: "assets/images/kintamani-outing-cover.png",
          imageAlt: "Team building activity in Kintamani Bali with Conscioustravel",
          description:
            "A company outing package for teams who want to step away from routine, reconnect in Bali's natural setting, and add a light positive-impact element to the experience.",
          includes: [
            "Team building facilitator",
            "Outdoor games",
            "Local lunch / refreshment",
            "Sustainable goodie bag",
            "CSR / donation",
            "Documentation",
            "Responsible travel briefing",
            "Light eco challenge",
          ],
          addons: [
            "Jeep / ATV",
            "Waste sorting challenge",
            "Tree / plant support",
            "Impact report",
            "Drone / video recap",
          ],
          cta: "Ask About Nature Escape",
          waMsg:
            "Hi Conscioustravel, I'm interested in the Bali Starter — Nature Escape + Impact Light package for a company outing. Could you help with package details and availability?",
        },
        {
          id: "beach-club",
          title: "Bali Starter",
          subtitle: "Beach Club Party with Purpose",
          location: "Nuanu / Atlas",
          price: "Starting from Rp750,000/pax",
          minPax: "Min. 50 pax",
          image: "assets/images/beach-team-building.png",
          imageAlt: "Beach team building activity for company outing in Bali",
          description:
            "A company outing package that combines beach team building, dinner or party experience, and a short impact moment so the event feels fun and meaningful.",
          includes: [
            "Beach team building",
            "Dinner / party event",
            "Event coordination",
            "Sustainable goodie bag",
            "CSR / donation",
            "Documentation",
            "Low-waste event guideline",
            "Short impact moment before party",
          ],
          addons: [
            "MC",
            "Live music",
            "DJ / entertainment",
            "Insta360 / video recap",
            "Beach clean-up challenge",
            "Custom company banner",
            "Impact report",
          ],
          cta: "Ask About Beach Club Party",
          waMsg:
            "Hi Conscioustravel, I'm interested in the Bali Starter — Beach Club Party with Purpose package for a company outing. Could you help with package details and availability?",
        },
      ],
    },
    dailyTrip: {
      title: "Daily Trip & Small Group Custom",
      description:
        "For travelers who want to explore Bali with a more flexible itinerary, Conscioustravel can help design custom daily trips based on your travel style — from nature escapes and cultural trips to beach hopping, hidden gems, and local food experiences.",
      tripTypes: [
        "Uluwatu sunset trip",
        "Kintamani jeep / nature trip",
        "Ubud culture & local experience",
        "Beach hopping",
        "Family trip",
        "Couple trip",
        "Small group custom itinerary",
      ],
      cta: "Create a Custom Daily Trip",
      waMsg:
        "Hi Conscioustravel, I'd like to ask about a custom daily trip in Bali. Could you help recommend an itinerary?",
    },
    why: {
      title: "Why Conscioustravel?",
      benefits: [
        {
          icon: "✦",
          title: "Curated, Not Random",
          description:
            "Every itinerary is designed based on your group's needs, not simply a list of tourist spots.",
        },
        {
          icon: "◎",
          title: "Fun, Organized, and Human",
          description:
            "We combine a well-organized event flow with a warm and enjoyable travel experience.",
        },
        {
          icon: "🌱",
          title: "Local & Responsible",
          description:
            "We encourage more mindful travel through local partners, responsible travel briefings, and light impact activities.",
        },
        {
          icon: "💼",
          title: "Ready for Corporate Needs",
          description:
            "From facilitators and documentation to event coordination and optional impact reports.",
        },
      ],
    },
    impact: {
      title: "Small Impact, Better Story",
      description:
        "Not every outing needs to become a large CSR program. With the Impact Light concept, companies can add simple activities such as donations, responsible travel briefings, waste sorting challenges, local support, or tree / plant support to make the journey feel more meaningful.",
      cta: "Learn About Impact Light",
      waMsg:
        "Hi Conscioustravel, I'd like to learn more about the Impact Light concept for our company outing.",
      items: [
        { icon: "💚", label: "Responsible Travel Briefing" },
        { icon: "🍽️", label: "Local Lunch & Support" },
        { icon: "🌳", label: "Tree / Plant Support" },
        { icon: "♻️", label: "Waste Sorting Challenge" },
        { icon: "🤝", label: "CSR / Donation" },
        { icon: "📋", label: "Impact Report" },
      ],
    },
    gallery: {
      title: "Experience Preview",
      description:
        "A glimpse of activities that can be designed with Conscioustravel — from nature outings and jeep adventures to local lunch, beach team building, and group dinner moments.",
      images: [
        { src: "assets/images/kintamani-outing-cover.png", alt: "Team building activity in Kintamani Bali", label: "Nature Outing" },
        { src: "assets/images/jeep-adventure.png", alt: "Jeep adventure experience in Kintamani Bali", label: "Jeep Adventure" },
        { src: "assets/images/games-in-nature.png", alt: "Outdoor team building games in nature in Bali", label: "Team Building" },
        { src: "assets/images/group-local-lunch.png", alt: "Company group enjoying lunch at a local restaurant in Bali", label: "Local Lunch" },
        { src: "assets/images/beach-team-building.png", alt: "Beach team building activity for company outing in Bali", label: "Beach Activity" },
        { src: "assets/images/group-dinner-party.png", alt: "Corporate group dinner and party event in Bali", label: "Group Dinner" },
        { src: "assets/images/local-restaurant-cover.png", alt: "Travelers enjoying local restaurant experience in Bali", label: "Local Experience" },
        { src: "assets/images/local-restaurant-simple.png", alt: "Local food experience in Bali", label: "Food Experience" },
      ],
    },
    clients: {
      title: "Trusted by Companies, Communities, and Private Groups",
      description:
        "Conscioustravel has supported various group travel and experience needs for companies, communities, and private trips.",
      names: ["DBS", "Astra FSCM", "Lumbung Architecture Bali", "BFB", "Lazada", "PT Gesit"],
      reviewCta: "See Google Reviews",
    },
    inquiry: {
      title: "Need a More Customized Trip?",
      description:
        "Tell us what you need. The Conscioustravel team will help recommend the most suitable travel or outing format for your group.",
      cta: "Submit Inquiry",
      successTitle: "Your inquiry has been submitted!",
      successMsg:
        "The Conscioustravel team will contact you via WhatsApp to help recommend the most suitable package.",
      successCta: "Continue Chat via WhatsApp",
      errorMsg: "Please check the required fields before submitting.",
      privacyNote:
        "By submitting this form, you agree to be contacted by the Conscioustravel team via WhatsApp or email regarding your trip inquiry.",
      fields: {
        name: "Full Name",
        whatsapp: "WhatsApp Number",
        email: "Email (optional)",
        inquiryType: "Inquiry Type",
        customerType: "Customer Type",
        companyName: "Company / Institution Name (optional)",
        preferredPackage: "Preferred Package",
        destination: "Destination / Area",
        participants: "Estimated Number of Participants",
        tripDate: "Preferred Trip Date (optional)",
        budget: "Estimated Budget per Pax (optional)",
        message: "Tell Us What You Need",
        messagePlaceholder:
          "Example: We need a 1-day outing for 60 people in Kintamani with team building, lunch, documentation, and a light CSR activity.",
        submit: "Submit Inquiry",
      },
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "Can the package be customized?",
          a: "Yes. Packages can be customized based on group size, event goals, venue, duration, and company needs.",
        },
        {
          q: "Can you handle groups under 50 pax?",
          a: "Yes, custom requests are possible. Pricing and event format will be adjusted based on the group size and needs.",
        },
        {
          q: "Is transportation included?",
          a: "It depends on the package requirements. Our team can help arrange transportation, venue, activities, and documentation.",
        },
        {
          q: "Can you prepare a proposal for companies?",
          a: "Yes. Please contact us via WhatsApp or submit the inquiry form to discuss your initial requirements.",
        },
        {
          q: "Do you provide daily trip itineraries?",
          a: "Yes. Daily trips can be customized based on your preferred destination, timing, and travel style.",
        },
      ],
    },
    finalCta: {
      title: "Ready to Design a More Meaningful Outing or Trip?",
      description:
        "Tell us what your team or group needs. The Conscioustravel team will help recommend the most suitable travel format.",
      cta: "Discuss Now via WhatsApp",
    },
    footer: {
      description:
        "Conscioustravel.id is a travel partner for company outings, daily trips, and more meaningful travel experiences in Bali.",
      legal: "PT Wisata Perjalanan Bermakna",
      address: "GG Mangga no.16 Pemecutan Klod, Denpasar Barat, Denpasar, Bali",
      whatsapp: "085195559749",
      copyright: "© 2025 Conscioustravel.id — PT Wisata Perjalanan Bermakna",
    },
  },
};

const CONFIG = {
  whatsappUrl: "https://wa.me/6285195559749",
  googleReviewUrl: "https://g.page/r/CaDYluc5v2nQEAE/review",
  instagramUrl: "https://www.instagram.com/conscioustravel.id/",
  instagramHandle: "@conscioustravel.id",
  defaultLang: "id",
};
