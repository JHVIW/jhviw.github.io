# Rick's Portfolio

Welcome to my portfolio! This website showcases my **projects, skills, research, and expertise** in **software engineering, cybersecurity, and healthcare IT**.

## 📌 Table of Contents
- [Introduction](#introduction)
- [Website Structure](#website-structure)
- [Projects](#projects)
- [Skills & Expertise](#skills--expertise)
- [Security Research](#security-research)
- [FHIR & Healthcare IT](#fhir--healthcare-it)
- [CS:GO Skin Pricing](#csgo-skin-pricing)
- [Contact](#contact)
- [Deployment & Automation](#deployment--automation)
- [License](#license)

---

## 📖 Introduction
I am **Rick van Iwaarden**, a software engineer with a passion for **cybersecurity, healthcare IT, and digital transformation**. My experience spans **full-stack development, cloud computing, API design, and security research**. 

This portfolio includes:
- **Projects**: Open-source tools, web applications, and API integrations.
- **Skills**: Technologies and frameworks I specialize in.
- **Security Research**: Ethical research on software vulnerabilities.
- **Healthcare IT**: My work on **FHIR** and **Laboratory Information Systems**.
- **CS:GO Skin Pricing**: Automated data retrieval for **CSFloat** and **Skinport**.

---

## 📂 Website Structure

```
📁 jhviw-jhviw.github.io/
│── 📁 data/                  # JSON files storing CS:GO skin price data
│── 📁 portfolio/              # Main portfolio pages
│   │── contact.html
│   │── fhir.html
│   │── index.html
│   │── projects.html
│   │── research.html
│   │── skills.html
│   │── vertrektijden.html     # Live public transport times (NS API)
│   │── 📁 images/             # Portfolio images
│── 📁 research/               # Security research articles
│   │── cve_research.html
│   │── script.js
│   │── styles.css
│   │── 📁 images/
│── 📁 scripts/                # Backend scripts
│   │── update-prices.js       # Fetches CS:GO skin prices from APIs
│── 📁 .github/                # GitHub Actions workflow for automation
│   │── 📁 workflows/
│   │   │── update-prices.yml
│── portfolio_styles.css       # Global styles
│── portfolio_script.js        # Interactive animations
```

---

## 🚀 Projects
My portfolio features a variety of projects across different domains:

### 🔹 **Secret Santa Bot**
A **Discord & Steam** bot for **automated Secret Santa pairings** with:
- **Steam Trade Offer integration**
- **Discord event management**
- **2FA authentication for secure transactions**

🔗 **[GitHub Repository](https://github.com/JHVIW/Secret-Santa-Bot)**

---

### 🔹 **CS2 External ESP (Proof of Concept)**
A game overlay that **tracks players in CS2** using:
- **C++**
- **Windows API**
- **GDI+ for rendering**

🔗 **[GitHub Repository](https://github.com/JHVIW/CS2-External-ESP)**

⚠ **Disclaimer**: Research project focused on understanding game security.

---

### 🔹 **OV Vertrektijden (Live Dutch Public Transport Tracker)**
A web app that displays **real-time train and bus departures** using:
- **NS API** (Dutch Railways)
- **OVAPI** (Public Transport)
- **JavaScript, TailwindCSS**

🔗 **[GitHub Repository](https://github.com/JHVIW/OV-Vertrektijden)**

---

### 🔹 **FHIR $lastn-endpoint for Laboratory Information Systems**
Developed a **FHIR R4-compliant API** for handling **laboratory results**:
- **Supports LOINC, SNOMED, UCUM**
- **Optimized for 500+ concurrent requests**
- **Adheres to NEN 7513 logging standards**

🔗 **[GitHub Repository - Private]**

---

## 🛠 Skills & Expertise
My core technical skills include:

**💻 Programming Languages**
- **C#, Python, JavaScript/TypeScript**
- **C++, SQL, Bash**

**🖥 Backend & API Development**
- **ASP.NET Core, Node.js, Flask**
- **GraphQL, RESTful APIs, FHIR**

**🛡 Security & Cybersecurity**
- **Reverse engineering, malware analysis**
- **Network security, ethical hacking**
- **Memory manipulation research**

**☁ Cloud & DevOps**
- **Microsoft Azure, Google Cloud**
- **Docker, CI/CD Pipelines, GitHub Actions**

**🔬 Healthcare IT**
- **FHIR R4, HL7 v2/v3**
- **Interoperability solutions for LIS**

---

## 🔍 Security Research
I conduct **ethical vulnerability research** in **software security**. Some notable research includes:

### 🔹 **CVE-2021-30481: Steam RCON Vulnerability**
- **Reverse-engineered Steam RCON**
- **Developed a proof-of-concept exploit**
- **Proposed security mitigations**

🔗 **[Read More](research/cve_research.html)**

---

### 🔹 **Wallhack Detection & Memory Analysis**
- **Developed a proof-of-concept wallhack**
- **Analyzed memory injection techniques**
- **Proposed anti-cheat detection methods**

🔗 **[Read More](research/cve_research.html)**

---

## 🏥 FHIR & Healthcare IT
My experience with **Fast Healthcare Interoperability Resources (FHIR)** includes:

### 🔹 **FHIR $lastn-endpoint**
- **Optimized REST API for lab results**
- **LOINC, SNOMED, UCUM mapping**
- **NEN 7513-compliant logging**

🔗 **[Read More](portfolio/fhir.html)**

---

## 🎮 CS:GO Skin Pricing
This project automates the retrieval of **CS:GO skin market prices**.

### 🔹 **Automated Price Fetching**
- **Fetches price data from CSFloat & Skinport**
- **Runs daily via GitHub Actions**
- **Stores data in JSON format**

### 🔹 **Workflow Automation**
**`.github/workflows/update-prices.yml`**
- **Runs daily at 00:00 UTC**
- **Commits updated price data to repository**

🔗 **[Script - update-prices.js](scripts/update-prices.js)**

---

## 📬 Contact
Feel free to reach out via the **contact form** on my portfolio.

🔗 **[Contact Page](portfolio/contact.html)**

📧 **Alternatively, email me at:**
```
saltssecurity@proton.me
```

---

## 🚀 Deployment & Automation
This portfolio is hosted using **GitHub Pages** with **automated updates** via **GitHub Actions**.

- **Price update automation** (`update-prices.js` runs daily)
- **Continuous integration for content changes**

---

## 📝 License
This project is licensed under the **MIT License**.

---

### 📢 **Thank you for visiting my portfolio!** 🚀
If you find any of my projects useful, feel free to **star** ⭐ them on GitHub