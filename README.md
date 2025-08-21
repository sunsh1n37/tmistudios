<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>B. Mncube | Digital Growth Specialist</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=Inter&display=swap" rel="stylesheet">
  <style>
    /* ---------------- Fonts & Body ---------------- */
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      background: #f9f4f0;
      color: #3a3a3a;
      line-height: 1.6;
      scroll-behavior: smooth;
    }
    .container { max-width: 720px; margin: 0 auto; padding: 40px 20px; }

    /* ---------------- Hero ---------------- */
    .hero h1 {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      text-align: center;
      color: #a66a50;
      background: linear-gradient(90deg, #a66a50, #c68f72);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.2rem;
    }
    .hero .tagline {
  text-align: center;
  margin-bottom: 0.3rem;
  font-weight: 600;
  font-size: 1.25rem;
  letter-spacing: 1.5px;
  color: #a66a50;
  text-transform: uppercase;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
  transition: color 0.3s ease;
}

.hero .tagline:hover {
  color: #c68f72;
}

.hero .subtitle {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #7c6c64;
  font-size: 1rem;
  font-style: italic;
}

.hero-intro {
  text-align: center;
  max-width: 650px;
  margin: 0.5rem auto 1rem auto;
  color: #5e524c;
  line-height: 1.5;
  font-size: 1.1rem;
}

    /* ---------------- Section Titles ---------------- */
    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 1.6rem;
      text-align: center;
      background: linear-gradient(90deg, #a66a50, #c68f72);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
    }

    /* ---------------- Horizontal Tiles ---------------- */
    .horizontal-tiles {
      display: flex;
      gap: 15px;
      padding-bottom: 10px;
      scroll-snap-type: x mandatory;
      overflow-x: hidden; /* default: no scroll */
    }
    .horizontal-tiles.scrollable { overflow-x: auto; } /* toggle horizontal scroll */

    .horizontal-tiles::-webkit-scrollbar {
      height: 6px;
    }
    .horizontal-tiles::-webkit-scrollbar-thumb {
      background: #d0c4bd;
      border-radius: 10px;
    }

    .tile {
      flex: 0 0 200px;
      background: #fff;
      border-radius: 10px;
      padding: 16px;
      font-size: 0.88rem;
      line-height: 1.4;
      scroll-snap-align: start;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      border: 2px solid #d0c4bd;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .tile:hover {
      transform: scale(1.03);
      box-shadow: 0 6px 12px rgba(0,0,0,0.1);
      border-color: #a66a50;
    }
    .tile strong::before { content: "✨ "; }

    /* ---------------- Gallery ---------------- */
    .gallery-grid {
      display: flex;
      gap: 15px;
      padding-bottom: 2px;
      scroll-snap-type: x mandatory;
      overflow-x: hidden; /* default no scroll */
    }
    .gallery-grid.scrollable { overflow-x: auto; }

    .gallery-grid::-webkit-scrollbar {
      height: 8px;
    }
    .gallery-grid::-webkit-scrollbar-thumb {
      background: #d0c4bd;
      border-radius: 10px;
    }

    .project-card {
      flex: 0 0 140px;
      background: #fff;
      border-radius: 10px;
      padding: 10px;
      text-align: center;
      font-weight: 500;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      border: 2px solid #d0c4bd;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 180px;
    }
    .project-card:hover {
      transform: scale(1.03);
      box-shadow: 0 6px 12px rgba(0,0,0,0.1);
      border-color: #a66a50;
    }
    .small-img {
      width: 100px;
      height: 140px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 8px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .small-img:hover {
      transform: scale(1.5) translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.3);
      cursor: pointer;
      z-index: 10;
    }

    /* ---------------- Email Capture & CTA ---------------- */
    .email-capture {
      background: #fff4e6; 
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      margin-top: 3rem;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      border: 2px solid #d0c4bd;
    }
    .email-capture h2 { margin-bottom: 0.5rem; }
    .email-capture p { margin-bottom: 1.2rem; color: #5e524c; }
    .cta-button, .whatsapp-button {
      display: inline-block;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: bold;
      text-decoration: none;
      margin-top: 10px;
    }
    .cta-button { background-color: #a66a50; color: #fff; }
    .cta-button:hover { background-color: #ffffff; color: #a66a50; }
    .whatsapp-button { background-color: #25D366; color: #fff; }
    .whatsapp-button:hover { background-color: #1ebe5d; }

   .visit-button {
  display: inline-block;
  margin-top: 8px;
  padding: 6px 12px;
  background-color: #a66a50;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.85rem;
  transition: background 0.2s ease;
}

.visit-button:hover {
  background-color: #c68f72;
}


    /* ---------------- Footer ---------------- */
    .footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.95rem;
  color: #c68f72; /* white text for contrast */
  background-color: #ffffff; /* darker, rich brown */
  padding: 15px 10px;
  border-radius: 8px;
}
.footer a {
  color: #c68f72; /* soft accent for links */
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s ease;
}
.footer a:hover {
  color: #ffffff;
}
  </style>
</head>

<body>
  <div class="container">
    <header class="hero">
      <h1>B. Mncube</h1>
      <p class="tagline">Digital Growth Specialist</p>
      <p class="subtitle">Social Media | Web Development | Canva & Branding Design</p>
      <p class="hero-intro">👋 Hi, I’m Buyi — a Graphic Designer & Web Developer helping businesses grow online with 🚀 Social Media Marketing, 💻 stunning websites, and 🎨 eye-catching Canva branding kits.</p>
    </header>

    <!-- Social Media Section -->
    <section>
      <h2>Social Media Marketing Management</h2>
      <div class="horizontal-tiles scrollable">
        <div class="tile"><strong>Starter R3 500/mo</strong><p>• Instagram only<br>• 5 curated posts/week<br>• Basic captions</p></div>
        <div class="tile"><strong>Growth R5 000/mo</strong><p>• Instagram + Facebook<br>• 10 posts/week<br>• Hashtag strategy</p></div>
        <div class="tile"><strong>Pro R8 500/mo</strong><p>• Instagram + Facebook + TikTok<br>• Full content calendar<br>• Ad campaigns</p></div>
      </div>
    </section>

    <!-- Web Development Section -->
    <section>
      <h2>Web Development</h2>
      <div class="horizontal-tiles scrollable">
        <div class="tile"><strong>Starter Site R3 500</strong><p>• 1-pager website<br>• Mobile responsive<br>• Contact form</p></div>
        <div class="tile"><strong>Business Site R6 500</strong><p>• Up to 5 pages<br>• Blog setup<br>• Basic SEO</p></div>
        <div class="tile"><strong>E-commerce Store R11 500</strong><p>• Product catalog<br>• Cart & checkout<br>• Payment gateway</p></div>
      </div>
    </section>

    <!-- Graphic Design Section -->
    <section>
      <h2>Graphic Design</h2>
      <div class="horizontal-tiles scrollable">
        <div class="tile"><strong>Basic From R450</strong><p>• Logo + 1 template<br>• Business cards<br>• Email signature</p></div>
        <div class="tile"><strong>Pro R950</strong><p>• Basic kit + Biz card<br>• 3 social templates<br>• Brand style sheet</p></div>
        <div class="tile"><strong>Premium R1 450</strong><p>• Full kit + Flyers<br>• Pitch deck<br>• Editable Canva kit</p></div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="gallery">
      <h2>Recent Projects Gallery</h2>
      <div class="gallery-grid scrollable">
        <div class="project-card"><p>Youtube banner</p><img src="project1.jpg" alt="Project 1" class="small-img"></div>
        <div class="project-card"><p>Event Flyer</p><img src="project2.png" alt="Project 2" class="small-img"></div>
        <div class="project-card"><p>Ebook cover</p><img src="project3.png" alt="Project 3" class="small-img"></div>
        
        <div class="project-card">
             <p>Website</p>
             <img src="project4.jpg" alt="Project 4" class="small-img">
              <a href="https://tmistudios.xyz" target="_blank" class="visit-button">Visit Site</a>
              
    </div>
      </div>
    </section>

    <!-- Email & WhatsApp CTA -->
    <section class="email-capture">
      <h2>Get in Touch</h2>
      <div class="whatsapp-box">
        <p>💬 Enquire on WhatsApp</p>
        <a href="https://wa.me/27847517475" target="_blank" class="whatsapp-button">WhatsApp</a>
      </div>
      <p>Ready to start your project?</p>
      <a href="https://form.jotform.com/252303182302038" target="_blank" class="cta-button">Book a Free Strategy Call</a>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p class="footer-tag">B.MNCUBE | DIGITAL GROWTH SPECIALIST</p>
      <p>Created by <a href="https://www.tmistudios.xyz" target="_blank">TMI Studios</a></p>
    </footer>
  </div>
</body>
</html>