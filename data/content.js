const CONTENT = {
  id: {
    nav: {
      links: [
        { label: "Company Outing", href: "company-outing/" },
        { label: "Experiences", href: "experiences/" },
        { label: "Impact", href: "impact/" },
        { label: "About", href: "about/" },
        { label: "Contact", href: "contact/" },
      ],
      cta: "Travel Better. Start Here.",
    },
    hero: {
      eyebrow: "Sustainable journeys. Meaningful impact.",
      headline: "Company Outing & Meaningful Trip in Bali",
      subheadline:
        "Conscioustravel membantu perusahaan, komunitas, dan grup kecil merancang perjalanan di Bali yang menyenangkan, tertata, dan memiliki nilai positif bagi tim maupun tempat yang dikunjungi.",
      primaryCta: "Travel Better. Start Here.",
      secondaryCta: "Explore Experiences",
      trustNotes: [
        "Curated outing & private trip",
        "Team building facilitator",
        "Responsible travel element",
        "Dokumentasi tersedia",
        "Itinerary kustom",
      ],
    },
    audience: {
      title: "Dirancang untuk Kebutuhan Trip yang Berbeda",
      description:
        "Baik untuk outing perusahaan maupun daily trip bersama grup kecil, setiap perjalanan dapat disesuaikan dengan tujuan, jumlah peserta, dan gaya pengalaman yang Anda inginkan.",
      cards: [
        {
          icon: "🏢",
          title: "Untuk Perusahaan",
          description:
            "Outing kantor, team building, CSR activity, dan company gathering yang dirancang lebih rapi, fun, dan bermakna.",
          cta: "Make Your Outing Count",
          waMsg:
            "Hai Conscious Travel! 👋 Saya sedang merencanakan company outing dan ingin mengeksplorasi ide yang cocok untuk tim kami. Bisa bantu?",
        },
        {
          icon: "🌿",
          title: "Untuk Daily Trip & Grup Kecil",
          description:
            "Daily trip privat dan itinerary kustom untuk keluarga, teman, pasangan, atau grup kecil yang ingin menjelajahi Bali dengan cara yang lebih personal.",
          cta: "Explore Experiences",
          href: "#experiences",
          waMsg:
            "Halo Conscioustravel, saya ingin tanya paket daily trip kustom di Bali. Bisa dibantu rekomendasi itinerary?",
        },
      ],
    },
    packages: {
      title: "Paket Outing Kantor di Bali",
      description:
        "Pilih format outing yang paling sesuai untuk tim Anda — dari nature escape di Ubud atau Kintamani, hingga beach club party yang tetap memiliki cerita dan nilai positif.",
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
          cta: "Make Your Outing Count",
          waMsg:
            "Hai Conscious Travel! 👋 Saya sedang merencanakan company outing dan ingin mengeksplorasi ide yang cocok untuk tim kami. Bisa bantu?",
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
            "Banner perusahaan kustom",
            "Impact report",
          ],
          cta: "Make Your Outing Count",
          waMsg:
            "Hai Conscious Travel! 👋 Saya sedang merencanakan company outing dan ingin mengeksplorasi ide yang cocok untuk tim kami. Bisa bantu?",
        },
      ],
    },
    dailyTrip: {
      title: "Daily Trip & Grup Kecil Kustom",
      description:
        "Untuk Anda yang ingin menjelajahi Bali dengan itinerary yang lebih fleksibel, Conscioustravel dapat membantu merancang daily trip sesuai gaya perjalanan Anda — mulai dari nature escape, cultural trip, beach hopping, hidden gem, hingga pengalaman kuliner lokal.",
      tripTypes: [
        "Uluwatu sunset trip",
        "Kintamani jeep / nature trip",
        "Ubud culture & local experience",
        "Beach hopping",
        "Family trip",
        "Couple trip",
        "Itinerary kustom untuk grup kecil",
      ],
      cta: "Travel Better. Start Here.",
      waMsg:
        "Hai Conscious Travel! 👋 Saya ingin merencanakan perjalanan di Bali dan mencari experience yang paling cocok. Bisa bantu saya?",
    },
    why: {
      title: "Kenapa Conscioustravel?",
      benefits: [
        {
          icon: "✦",
          title: "Curated, Not Random",
          description:
            "Setiap itinerary dirancang sesuai kebutuhan grup, bukan sekadar menyusun daftar tempat wisata.",
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
      cta: "Make Your Outing Count",
      waMsg:
        "Hai Conscious Travel! 👋 Saya sedang merencanakan company outing dan ingin mengeksplorasi ide yang cocok untuk tim kami. Bisa bantu?",
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
        "Beberapa gambaran aktivitas yang bisa dirancang bersama Conscioustravel — dari nature outing, jeep adventure, makan siang lokal, beach team building, hingga makan malam grup.",
      images: [
        { src: "assets/images/kintamani-outing-cover.png", alt: "Team building activity in Kintamani Bali", label: "Nature Outing" },
        { src: "assets/images/jeep-adventure.png", alt: "Jeep adventure experience in Kintamani Bali", label: "Jeep Adventure" },
        { src: "assets/images/games-in-nature.png", alt: "Outdoor team building games in nature in Bali", label: "Team Building" },
        { src: "assets/images/group-local-lunch.png", alt: "Company group enjoying lunch at a local restaurant in Bali", label: "Makan Siang Lokal" },
        { src: "assets/images/beach-team-building.png", alt: "Beach team building activity for company outing in Bali", label: "Beach Activity" },
        { src: "assets/images/group-dinner-party.png", alt: "Corporate group dinner and party event in Bali", label: "Makan Malam Grup" },
        { src: "assets/images/local-restaurant-cover.png", alt: "Travelers enjoying local restaurant experience in Bali", label: "Local Experience" },
        { src: "assets/images/local-restaurant-simple.png", alt: "Local food experience in Bali", label: "Food Experience" },
      ],
    },
    clients: {
      title: "Dipercaya oleh Perusahaan, Komunitas, dan Grup Privat",
      description:
        "Conscioustravel telah mendukung berbagai kebutuhan perjalanan dan pengalaman grup, mulai dari perusahaan, komunitas, hingga trip privat.",
      names: ["DBS", "Astra FSCM", "Lumbung Architecture Bali", "BFB", "Lazada", "PT Gesit"],
      reviewCta: "Lihat Google Review",
    },
    inquiry: {
      title: "Butuh Paket yang Lebih Kustom?",
      description:
        "Ceritakan kebutuhan outing atau trip Anda. Tim Conscioustravel akan membantu merekomendasikan format perjalanan yang paling sesuai.",
      cta: "Kirim Inquiry",
      successTitle: "Inquiry Anda sudah terkirim!",
      successMsg:
        "Tim Conscioustravel akan menghubungi Anda melalui WhatsApp untuk membantu merekomendasikan paket yang paling sesuai.",
      successCta: "Travel Better. Start Here.",
      errorMsg: "Mohon cek kembali data yang wajib diisi.",
      privacyNote:
        "Dengan mengirim formulir ini, Anda setuju untuk dihubungi oleh tim Conscioustravel melalui WhatsApp atau email terkait kebutuhan trip Anda.",
      fields: {
        name: "Nama Lengkap",
        whatsapp: "Nomor WhatsApp",
        email: "Email (opsional)",
        inquiryType: "Jenis Kebutuhan",
        customerType: "Tipe Pelanggan",
        companyName: "Nama Perusahaan / Instansi (opsional)",
        preferredPackage: "Paket yang Diminati",
        destination: "Area Tujuan",
        participants: "Perkiraan Jumlah Peserta",
        tripDate: "Tanggal Rencana Trip (opsional)",
        budget: "Estimasi Anggaran per Pax (opsional)",
        message: "Ceritakan Kebutuhan Anda",
        messagePlaceholder:
          "Contoh: Kami ingin outing 1 hari untuk 60 orang di area Kintamani dengan team building, makan siang, dokumentasi, dan aktivitas CSR ringan.",
        submit: "Kirim Inquiry",
      },
    },
    faq: {
      title: "FAQ",
      items: [
        {
          q: "Apakah paket bisa dikustomisasi?",
          a: "Bisa. Paket dapat disesuaikan berdasarkan jumlah peserta, tujuan acara, venue, durasi, dan kebutuhan perusahaan.",
        },
        {
          q: "Apakah bisa untuk grup di bawah 50 pax?",
          a: "Bisa untuk permintaan kustom, namun harga dan format acara akan disesuaikan.",
        },
        {
          q: "Apakah sudah termasuk transportasi?",
          a: "Tergantung kebutuhan paket. Tim kami dapat membantu menyiapkan opsi transportasi, venue, aktivitas, dan dokumentasi.",
        },
        {
          q: "Apakah bisa dibuatkan proposal untuk perusahaan?",
          a: "Bisa. Silakan hubungi kami via WhatsApp atau isi formulir inquiry untuk diskusi kebutuhan awal.",
        },
        {
          q: "Apakah tersedia itinerary untuk daily trip?",
          a: "Ya. Daily trip dapat dibuat kustom sesuai preferensi destinasi, waktu, dan gaya perjalanan.",
        },
      ],
    },
    finalCta: {
      title: "Siap Merancang Outing atau Trip yang Lebih Bermakna?",
      description:
        "Ceritakan kebutuhan tim atau grup Anda. Tim Conscioustravel akan membantu merekomendasikan format perjalanan yang paling sesuai.",
      cta: "Travel Better. Start Here.",
    },
    footer: {
      description:
        "Conscioustravel.id adalah mitra perjalanan untuk company outing, daily trip, dan pengalaman perjalanan yang lebih bermakna di Bali.",
      legal: "PT Wisata Perjalanan Bermakna",
      addresses: [
        { label: "Alamat PT", value: "Jl. Cempaka Bulak No. 77, Jaticempaka, Pondokgede, Kota Bekasi, Jawa Barat, 17411" },
        { label: "Kantor Bali", value: "Jl. Nusantara II No. 17, Tuban, Kuta, Badung, Bali, 80361" },
      ],
      whatsapp: "+6285195559749",
      links: [
        { label: "Company Outing", href: "company-outing/" },
        { label: "Experiences", href: "experiences/" },
        { label: "Impact Light", href: "impact/" },
        { label: "About", href: "about/" },
        { label: "Contact", href: "contact/" },
        { label: "Inquiry Form", href: "contact/#inquiry" },
      ],
      copyright: "© 2025 Conscioustravel.id — PT Wisata Perjalanan Bermakna",
    },
    pages: {
      companyOuting: {
        eyebrow: "Corporate Trips",
        title: "Company Outing di Bali yang Rapi, Fun, dan Bermakna",
        description:
          "Dirancang untuk HR, owner, event planner, dan corporate team yang membutuhkan outing, team building, CSR ringan, atau gathering perusahaan dengan flow yang jelas dan pengalaman yang terasa premium.",
        heroImage: "assets/images/kintamani-outing-cover.png",
        primaryCta: "Travel Better. Start Here.",
        secondaryCta: "Lihat Paket",
        introTitle: "Bukan sekadar jalan-jalan kantor",
        introText:
          "Conscioustravel membantu merancang outing perusahaan dengan kombinasi itinerary, facilitator, venue, local experience, dokumentasi, dan elemen Impact Light yang bisa disesuaikan dengan kebutuhan tim.",
        highlights: [
          "Starting price jelas mulai Rp750.000/pax",
          "Format bisa disesuaikan dengan tujuan acara",
          "Siap untuk proposal, quotation, dan koordinasi vendor",
          "Pilihan nature escape, beach club, dinner, dan CSR ringan",
        ],
        processTitle: "Alur kerja yang nyaman untuk perusahaan",
        process: [
          { title: "Diskusi kebutuhan", text: "Ceritakan jumlah peserta, tanggal, tujuan acara, dan area yang diinginkan." },
          { title: "Rekomendasi konsep", text: "Kami bantu susun format outing, activity flow, dan opsi venue yang paling cocok." },
          { title: "Proposal & koordinasi", text: "Tim menyiapkan rincian paket, add-on, dan kebutuhan operasional untuk event." },
        ],
      },
      experiences: {
        eyebrow: "Daily Trips & Small Groups",
        title: "Explore Bali dengan Itinerary yang Lebih Personal",
        description:
          "Untuk keluarga, pasangan, teman, komunitas kecil, atau traveler yang ingin daily trip fleksibel dengan rekomendasi lokal dan alur perjalanan yang nyaman.",
        heroImage: "assets/images/jeep-adventure.png",
        primaryCta: "Travel Better. Start Here.",
        introTitle: "Daily trip yang bisa mengikuti gaya perjalanan Anda",
        introText:
          "Mulai dari Uluwatu sunset, Kintamani jeep, Ubud culture, beach hopping, sampai local food experience. Tim Conscioustravel membantu memilih rute yang terasa natural, tidak terlalu padat, dan tetap berkesan.",
        highlights: [
          "Cocok untuk private trip dan grup kecil",
          "Rute bisa dibuat santai, adventurous, atau cultural",
          "Rekomendasi local lunch, hidden gem, dan photo spots",
          "CTA cepat ke WhatsApp untuk diskusi itinerary",
        ],
      },
      impact: {
        eyebrow: "Impact Light",
        title: "Small Impact, Better Story",
        description:
          "Impact Light membantu perusahaan dan grup menambahkan aktivitas sederhana yang punya nilai positif tanpa membuat perjalanan terasa berat atau terlalu formal.",
        heroImage: "assets/images/local-restaurant-cover.png",
        primaryCta: "Travel Better. Start Here.",
        introTitle: "Dibuat ringan, relevan, dan tidak berlebihan",
        introText:
          "Aktivitas impact dapat berupa responsible travel briefing, local support, donation, waste sorting challenge, tree or plant support, atau short impact moment sebelum celebration.",
        highlights: [
          "Tidak mengklaim impact secara berlebihan",
          "Bisa menjadi add-on dalam outing perusahaan",
          "Membantu cerita event terasa lebih bermakna",
          "Opsional impact report untuk kebutuhan corporate",
        ],
      },
      about: {
        eyebrow: "About Conscioustravel",
        title: "Travel Partner untuk Perjalanan yang Lebih Bermakna",
        description:
          "Conscioustravel.id adalah travel partner yang merancang curated trips, company outings, dan private experiences di Bali dengan keseimbangan antara kenyamanan, local connection, dan positive impact.",
        heroImage: "assets/images/group-local-lunch.png",
        primaryCta: "Travel Better. Start Here.",
        introTitle: "Thoughtful, local, and ready for corporate needs",
        introText:
          "Kami tidak ingin menjadi travel agent generik. Fokus kami adalah membantu setiap grup mendapatkan pengalaman yang lebih rapi, lebih manusiawi, dan punya cerita yang lebih kuat.",
        highlights: [
          "Company outing dan team building",
          "Daily trip dan small group custom",
          "Local experience dan responsible travel",
          "Legal entity: PT Wisata Perjalanan Bermakna",
        ],
      },
      contact: {
        eyebrow: "Contact",
        title: "Ceritakan Kebutuhan Trip Anda",
        description:
          "Hubungi Conscioustravel via WhatsApp untuk respons cepat, atau isi inquiry form agar tim kami bisa memahami kebutuhan outing, daily trip, atau perjalanan kustom Anda.",
        heroImage: "assets/images/group-dinner-party.png",
        primaryCta: "Travel Better. Start Here.",
        introTitle: "Lebih mudah mulai dari WhatsApp",
        introText:
          "WhatsApp tetap menjadi jalur utama. Untuk kebutuhan B2B, inquiry form membantu tim kami menangkap detail seperti jumlah peserta, tanggal, budget, dan paket yang diminati.",
        highlights: [
          "WhatsApp: +6285195559749",
          "Inquiry form tetap tersambung ke Apps Script",
          "Dua alamat tetap ditampilkan di footer dan contact",
          "Cocok untuk request proposal atau itinerary custom",
        ],
      },
    },
  },

  en: {
    nav: {
      links: [
        { label: "Company Outing", href: "company-outing/" },
        { label: "Experiences", href: "experiences/" },
        { label: "Impact", href: "impact/" },
        { label: "About", href: "about/" },
        { label: "Contact", href: "contact/" },
      ],
      cta: "Travel Better. Start Here.",
    },
    hero: {
      eyebrow: "Sustainable journeys. Meaningful impact.",
      headline: "Company Outing & Meaningful Trips in Bali",
      subheadline:
        "Conscioustravel helps companies, communities, and small groups design Bali trips that are fun, well-organized, and thoughtfully connected to local experiences and positive impact.",
      primaryCta: "Travel Better. Start Here.",
      secondaryCta: "Explore Experiences",
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
          cta: "Make Your Outing Count",
          waMsg:
            "Hi Conscious Travel! 👋 I'm planning a company outing and would love to explore some ideas for our team. Can you help?",
        },
        {
          icon: "🌿",
          title: "For Daily Trips & Small Groups",
          description:
            "Private daily trips and custom itineraries for families, friends, couples, or small groups who want to explore Bali in a more personal way.",
          cta: "Explore Experiences",
          href: "#experiences",
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
          cta: "Make Your Outing Count",
          waMsg:
            "Hi Conscious Travel! 👋 I'm planning a company outing and would love to explore some ideas for our team. Can you help?",
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
          cta: "Make Your Outing Count",
          waMsg:
            "Hi Conscious Travel! 👋 I'm planning a company outing and would love to explore some ideas for our team. Can you help?",
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
      cta: "Travel Better. Start Here.",
      waMsg:
        "Hi Conscious Travel! 👋 I'd love to explore a better way to experience Bali. Can you help me find the right trip?",
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
      cta: "Make Your Outing Count",
      waMsg:
        "Hi Conscious Travel! 👋 I'm planning a company outing and would love to explore some ideas for our team. Can you help?",
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
      successCta: "Travel Better. Start Here.",
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
      cta: "Travel Better. Start Here.",
    },
    footer: {
      description:
        "Conscioustravel.id is a travel partner for company outings, daily trips, and more meaningful travel experiences in Bali.",
      legal: "PT Wisata Perjalanan Bermakna",
      addresses: [
        { label: "Company Address", value: "Jl. Cempaka Bulak No. 77, Jaticempaka, Pondokgede, Kota Bekasi, Jawa Barat, 17411" },
        { label: "Bali Office", value: "Jl. Nusantara II No. 17, Tuban, Kuta, Badung, Bali, 80361" },
      ],
      whatsapp: "+6285195559749",
      links: [
        { label: "Company Outing", href: "company-outing/" },
        { label: "Experiences", href: "experiences/" },
        { label: "Impact Light", href: "impact/" },
        { label: "About", href: "about/" },
        { label: "Contact", href: "contact/" },
        { label: "Inquiry Form", href: "contact/#inquiry" },
      ],
      copyright: "© 2025 Conscioustravel.id — PT Wisata Perjalanan Bermakna",
    },
    pages: {
      companyOuting: {
        eyebrow: "Corporate Trips",
        title: "Company Outings in Bali That Feel Organized, Fun, and Meaningful",
        description:
          "Designed for HR teams, owners, event planners, and corporate teams who need outings, team building, light CSR moments, or company gatherings with a clear flow and premium travel feel.",
        heroImage: "assets/images/kintamani-outing-cover.png",
        primaryCta: "Travel Better. Start Here.",
        secondaryCta: "View Packages",
        introTitle: "More than a company day out",
        introText:
          "Conscioustravel helps design company outings with itinerary planning, facilitators, venues, local experiences, documentation, and optional Impact Light elements tailored to your team.",
        highlights: [
          "Clear starting price from Rp750,000/pax",
          "Formats can be customized to your event goals",
          "Ready for proposal, quotation, and vendor coordination",
          "Nature escape, beach club, dinner, and light CSR options",
        ],
        processTitle: "A comfortable workflow for companies",
        process: [
          { title: "Share your needs", text: "Tell us the group size, date, event goals, and preferred area." },
          { title: "Get a concept recommendation", text: "We help shape the outing format, activity flow, and venue options." },
          { title: "Proposal & coordination", text: "The team prepares package details, add-ons, and operational needs for the event." },
        ],
      },
      experiences: {
        eyebrow: "Daily Trips & Small Groups",
        title: "Explore Bali with a More Personal Itinerary",
        description:
          "For families, couples, friends, small communities, or travelers who want flexible daily trips with local recommendations and a comfortable travel flow.",
        heroImage: "assets/images/jeep-adventure.png",
        primaryCta: "Travel Better. Start Here.",
        introTitle: "Daily trips that follow your travel style",
        introText:
          "From Uluwatu sunset, Kintamani jeep, Ubud culture, and beach hopping to local food experiences. Conscioustravel helps choose routes that feel natural, not rushed, and memorable.",
        highlights: [
          "Suitable for private trips and small groups",
          "Routes can feel relaxed, adventurous, or cultural",
          "Local lunch, hidden gems, and photo spot recommendations",
          "Fast WhatsApp CTA to discuss your itinerary",
        ],
      },
      impact: {
        eyebrow: "Impact Light",
        title: "Small Impact, Better Story",
        description:
          "Impact Light helps companies and groups add simple positive-value activities without making the trip feel heavy or overly formal.",
        heroImage: "assets/images/local-restaurant-cover.png",
        primaryCta: "Travel Better. Start Here.",
        introTitle: "Light, relevant, and not overclaimed",
        introText:
          "Impact activities can include responsible travel briefings, local support, donations, waste sorting challenges, tree or plant support, or short impact moments before a celebration.",
        highlights: [
          "No exaggerated impact claims",
          "Can be added to company outing formats",
          "Helps the event story feel more meaningful",
          "Optional impact report for corporate needs",
        ],
      },
      about: {
        eyebrow: "About Conscioustravel",
        title: "A Travel Partner for More Meaningful Journeys",
        description:
          "Conscioustravel.id is a travel partner designing curated trips, company outings, and private experiences in Bali with a balance of comfort, local connection, and positive impact.",
        heroImage: "assets/images/group-local-lunch.png",
        primaryCta: "Travel Better. Start Here.",
        introTitle: "Thoughtful, local, and ready for corporate needs",
        introText:
          "We are not trying to be a generic travel agent. Our focus is helping every group get an experience that feels organized, human, and rich with better stories.",
        highlights: [
          "Company outings and team building",
          "Daily trips and small group custom travel",
          "Local experiences and responsible travel",
          "Legal entity: PT Wisata Perjalanan Bermakna",
        ],
      },
      contact: {
        eyebrow: "Contact",
        title: "Tell Us What Kind of Trip You Need",
        description:
          "Contact Conscioustravel via WhatsApp for a fast response, or submit the inquiry form so our team can understand your outing, daily trip, or custom travel needs.",
        heroImage: "assets/images/group-dinner-party.png",
        primaryCta: "Travel Better. Start Here.",
        introTitle: "The easiest way to start is WhatsApp",
        introText:
          "WhatsApp remains the main channel. For B2B needs, the inquiry form helps our team capture details such as group size, date, budget, and preferred package.",
        highlights: [
          "WhatsApp: +6285195559749",
          "Inquiry form remains connected to Apps Script",
          "Both addresses remain visible in footer and contact",
          "Suitable for proposal requests or custom itineraries",
        ],
      },
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
