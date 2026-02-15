// Orbit - Comprehensive Cybersecurity Learning Platform
// Advanced implementation with roadmaps, rooms, and detailed content

// TOP OF APP.JS
const SUPABASE_URL = 'https://nmpvknbxcqhwkysljcjy.supabase.co'; // Replace with yours
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tcHZrbmJ4Y3Fod2t5c2xqY2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MDg1MjgsImV4cCI6MjA4NjM4NDUyOH0.sUy_oPxBRDVmn8sXrAOP6D-2ePPna4dwDXvgO0tkQIE'; // Replace with your anon key

// 1. Setup the unique connection (Renamed to orbitDB)
const orbitDB = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. The Unsticker Logic
async function initializeOrbit() {
    console.log("Checking connection to Orbit Cloud...");
    
    try {
        // Use orbitDB here instead of supabase
        const { data: { session }, error } = await orbitDB.auth.getSession();
        
        if (error) throw error;

        if (session) {
            console.log("Welcome back, Explorer:", session.user.email);
            currentUser = session.user;
            // Hide the login box if they are already logged in
            document.getElementById('auth-modal').style.display = 'none';
            // 2. FETCH PROFILE DATA (XP and Tasks)
            const { data: profile, error: profileError } = await orbitDB
                .from('profiles')
                .select('*')
                .eq('id', currentUser.id)
                .single();

            if (profile) {
                // Update the Portal UI with real data
                document.getElementById('username-stat').innerText = currentUser.email;
                document.getElementById('xp-stat').innerText = profile.xp;
                
                // Optional: If you have a top-bar XP display, update that too
                const topXP = document.getElementById('xp-display');
                if (topXP) topXP.innerText = `XP: ${profile.xp}`;

                // 3. AUTO-CHECK COMPLETED TASKS
                profile.completed_tasks.forEach(taskId => {
                    const checkbox = document.getElementById(taskId);
                    if (checkbox) {
                        checkbox.checked = true;
                        // checkbox.disabled = true; // Uncomment if you want to lock completed tasks
                    }
                });
            }
            
        } else {
            console.log("No active session. Ready for login.");
            // Show the login box if they aren't logged in
            document.getElementById('auth-modal').style.display = 'flex';
        }
    } catch (err) {
        console.error("Connection issue:", err.message);
    } finally {
        // This is the part that removes the loading screen
        const loader = document.getElementById('loading-screen');
        if (loader) {
            loader.style.display = 'none'; 
            console.log("Loading screen removed successfully.");
        }
    }
}

// 3. Start the app
initializeOrbit();
class OrbitPlatform {
    constructor() {
        this.currentView = 'dashboard';
        this.theme = localStorage.getItem('orbit-theme') || 'dark';
        this.userProgress = JSON.parse(localStorage.getItem('orbit-progress')) || {
            currentXP: 0,
            level: "Explorer",
            completedLessons: [],
            achievements: [],
            streakDays: 0,
            lastActive: null,
            currentPaths: [],
            bookmarks: []
        };

        this.currentLesson = null;
        this.currentModule = null;
        this.currentRoom = null;
        this.currentPage = 0;

        // Learning paths data
        this.learningPaths = [
            {
                id: "complete-beginner",
                name: "Complete Beginner",
                description: "Perfect for those new to cybersecurity. No prior experience required.",
                difficulty: "Beginner",
                estimatedTime: "40-60 hours",
                prerequisite: "None",
                modules: ["cybersec-fundamentals", "basic-networking", "operating-systems", "security-tools"],
                color: "#10b981",
                icon: "🚀"
            },
            {
                id: "blue-team-defense",
                name: "Blue Team (Defense)",
                description: "Learn to defend, monitor, and respond to cyber threats.",
                difficulty: "Intermediate",
                estimatedTime: "60-80 hours", 
                prerequisite: "Basic networking knowledge",
                modules: ["siem-log-analysis", "incident-response", "threat-hunting", "digital-forensics"],
                color: "#3b82f6",
                icon: "🛡️"
            },
            {
                id: "red-team-offense",
                name: "Red Team (Offense)",
                description: "Master offensive security and penetration testing techniques.",
                difficulty: "Advanced",
                estimatedTime: "80-100 hours",
                prerequisite: "Networking and Linux fundamentals",
                modules: ["penetration-testing", "web-app-security", "network-exploitation", "social-engineering"],
                color: "#ef4444",
                icon: "⚔️"
            },
            {
                id: "compliance-governance",
                name: "Compliance & Governance",
                description: "Focus on frameworks, compliance, and security management.",
                difficulty: "Intermediate",
                estimatedTime: "50-70 hours",
                prerequisite: "Basic security concepts",
                modules: ["security-frameworks", "risk-management", "compliance-standards", "security-policies"],
                color: "#8b5cf6",
                icon: "📋"
            },
            {
                id: "cloud-security",
                name: "Cloud Security",
                description: "Secure cloud environments and implement DevSecOps practices.",
                difficulty: "Advanced",
                estimatedTime: "70-90 hours",
                prerequisite: "Cloud computing basics",
                modules: ["aws-security", "azure-security", "cloud-architecture", "devsecops"],
                color: "#06b6d4",
                icon: "☁️"
            }
        ];

        // Modules with rooms structure
        this.modules = [
            {
                id: "siem-log-analysis",
                name: "SIEM & Log Analysis",
                description: "Master Security Information and Event Management systems and log analysis techniques",
                difficulty: "Intermediate",
                estimatedTime: "12-15 hours",
                icon: "📊",
                rooms: [
                    {
                        id: "siem-fundamentals",
                        name: "SIEM Fundamentals",
                        description: "Understanding the core concepts and architecture of SIEM systems",
                        estimatedTime: "2-3 hours",
                        icon: "🏗️",
                        lessons: [
                            {id: "siem-intro", title: "Introduction to SIEM", pages: 4, xp: 25, time: "30 min", difficulty: "Beginner"},
                            {id: "siem-architecture", title: "SIEM Architecture & Components", pages: 5, xp: 30, time: "40 min", difficulty: "Intermediate"},
                            {id: "data-sources", title: "SIEM Data Sources", pages: 3, xp: 20, time: "25 min", difficulty: "Beginner"},
                            {id: "use-cases", title: "SIEM Use Cases & Benefits", pages: 4, xp: 25, time: "30 min", difficulty: "Intermediate"}
                        ]
                    },
                    {
                        id: "elk-stack",
                        name: "ELK Stack",
                        description: "Deep dive into Elasticsearch, Logstash, and Kibana for log management",
                        estimatedTime: "4-5 hours",
                        icon: "🦌",
                        lessons: [
                            {id: "elasticsearch-basics", title: "Elasticsearch Fundamentals", pages: 6, xp: 35, time: "50 min", difficulty: "Intermediate"},
                            {id: "logstash-processing", title: "Logstash Data Processing", pages: 5, xp: 30, time: "40 min", difficulty: "Intermediate"},
                            {id: "kibana-visualization", title: "Kibana Dashboards & Visualization", pages: 5, xp: 30, time: "45 min", difficulty: "Intermediate"},
                            {id: "elk-integration", title: "ELK Stack Integration", pages: 4, xp: 25, time: "35 min", difficulty: "Advanced"},
                            {id: "elk-security", title: "Securing ELK Stack", pages: 3, xp: 20, time: "25 min", difficulty: "Advanced"}
                        ]
                    },
                    {
                        id: "splunk",
                        name: "Splunk",
                        description: "Comprehensive Splunk training for enterprise log management",
                        estimatedTime: "4-5 hours",
                        icon: "🔍",
                        lessons: [
                            {id: "splunk-basics", title: "Splunk Architecture & Installation", pages: 5, xp: 30, time: "40 min", difficulty: "Beginner"},
                            {id: "splunk-search", title: "Splunk Search Language (SPL)", pages: 6, xp: 35, time: "50 min", difficulty: "Intermediate"},
                            {id: "splunk-dashboards", title: "Creating Splunk Dashboards", pages: 4, xp: 25, time: "35 min", difficulty: "Intermediate"},
                            {id: "splunk-alerts", title: "Splunk Alerts & Monitoring", pages: 4, xp: 25, time: "30 min", difficulty: "Advanced"},
                            {id: "splunk-apps", title: "Splunk Apps & Add-ons", pages: 3, xp: 20, time: "25 min", difficulty: "Intermediate"}
                        ]
                    },
                    {
                        id: "log-analysis",
                        name: "Log Analysis Techniques",
                        description: "Advanced log analysis methods and threat detection",
                        estimatedTime: "3-4 hours",
                        icon: "🔬",
                        lessons: [
                            {id: "log-types", title: "Understanding Log Types", pages: 4, xp: 25, time: "30 min", difficulty: "Beginner"},
                            {id: "log-parsing", title: "Log Parsing & Normalization", pages: 5, xp: 30, time: "40 min", difficulty: "Intermediate"},
                            {id: "threat-patterns", title: "Identifying Threat Patterns", pages: 5, xp: 30, time: "45 min", difficulty: "Advanced"},
                            {id: "correlation-rules", title: "Building Correlation Rules", pages: 4, xp: 25, time: "35 min", difficulty: "Advanced"}
                        ]
                    }
                ]
            },
            {
                id: "basic-networking",
                name: "Networking Fundamentals",
                description: "Essential networking concepts for cybersecurity professionals",
                difficulty: "Beginner",
                estimatedTime: "15-20 hours",
                icon: "🌐",
                rooms: [
                    {
                        id: "osi-model",
                        name: "OSI Model",
                        description: "Master the 7-layer OSI model and network communication",
                        estimatedTime: "3-4 hours",
                        icon: "🏗️",
                        lessons: [
                            {id: "osi-overview", title: "OSI Model Overview", pages: 4, xp: 20, time: "25 min", difficulty: "Beginner"},
                            {id: "physical-layer", title: "Layer 1: Physical Layer", pages: 3, xp: 15, time: "20 min", difficulty: "Beginner"},
                            {id: "data-link", title: "Layer 2: Data Link Layer", pages: 4, xp: 20, time: "25 min", difficulty: "Beginner"},
                            {id: "network-layer", title: "Layer 3: Network Layer", pages: 5, xp: 25, time: "35 min", difficulty: "Intermediate"},
                            {id: "transport-layer", title: "Layer 4: Transport Layer", pages: 5, xp: 25, time: "35 min", difficulty: "Intermediate"},
                            {id: "session-layer", title: "Layer 5: Session Layer", pages: 3, xp: 15, time: "20 min", difficulty: "Intermediate"},
                            {id: "presentation-layer", title: "Layer 6: Presentation Layer", pages: 3, xp: 15, time: "20 min", difficulty: "Intermediate"},
                            {id: "application-layer", title: "Layer 7: Application Layer", pages: 4, xp: 20, time: "25 min", difficulty: "Intermediate"}
                        ]
                    },
                    {
                        id: "tcpip-model",
                        name: "TCP/IP Model",
                        description: "Deep dive into the TCP/IP protocol suite",
                        estimatedTime: "4-5 hours",
                        icon: "📡",
                        lessons: [
                            {id: "tcpip-overview", title: "TCP/IP Model Introduction", pages: 4, xp: 20, time: "25 min", difficulty: "Beginner"},
                            {id: "network-access", title: "Network Access Layer", pages: 4, xp: 20, time: "30 min", difficulty: "Intermediate"},
                            {id: "internet-protocol", title: "Internet Layer (IP)", pages: 6, xp: 30, time: "45 min", difficulty: "Intermediate"},
                            {id: "transport-protocols", title: "Transport Layer (TCP/UDP)", pages: 6, xp: 30, time: "45 min", difficulty: "Intermediate"},
                            {id: "application-protocols", title: "Application Layer Protocols", pages: 5, xp: 25, time: "35 min", difficulty: "Intermediate"},
                            {id: "ip-addressing", title: "IP Addressing & Subnetting", pages: 7, xp: 35, time: "50 min", difficulty: "Advanced"}
                        ]
                    },
                    {
                        id: "network-protocols",
                        name: "Network Protocols",
                        description: "Essential protocols for network communication and security",
                        estimatedTime: "5-6 hours",
                        icon: "🔗",
                        lessons: [
                            {id: "http-https", title: "HTTP & HTTPS Protocols", pages: 5, xp: 25, time: "35 min", difficulty: "Beginner"},
                            {id: "dns-protocol", title: "DNS (Domain Name System)", pages: 6, xp: 30, time: "40 min", difficulty: "Intermediate"},
                            {id: "dhcp-protocol", title: "DHCP (Dynamic Host Configuration)", pages: 4, xp: 20, time: "25 min", difficulty: "Beginner"},
                            {id: "ftp-ssh", title: "FTP & SSH Protocols", pages: 5, xp: 25, time: "30 min", difficulty: "Intermediate"},
                            {id: "email-protocols", title: "Email Protocols (SMTP, POP3, IMAP)", pages: 4, xp: 20, time: "25 min", difficulty: "Intermediate"},
                            {id: "network-management", title: "SNMP & Network Management", pages: 4, xp: 20, time: "25 min", difficulty: "Advanced"}
                        ]
                    },
                    {
                        id: "network-security",
                        name: "Network Security",
                        description: "Network security fundamentals and defensive mechanisms",
                        estimatedTime: "4-5 hours",
                        icon: "🔒",
                        lessons: [
                            {id: "firewall-basics", title: "Firewall Fundamentals", pages: 5, xp: 25, time: "35 min", difficulty: "Beginner"},
                            {id: "ids-ips", title: "Intrusion Detection/Prevention Systems", pages: 6, xp: 30, time: "40 min", difficulty: "Intermediate"},
                            {id: "vpn-security", title: "VPN Technologies", pages: 5, xp: 25, time: "30 min", difficulty: "Intermediate"},
                            {id: "wireless-security", title: "Wireless Network Security", pages: 5, xp: 25, time: "35 min", difficulty: "Intermediate"},
                            {id: "network-monitoring", title: "Network Monitoring & Analysis", pages: 4, xp: 20, time: "25 min", difficulty: "Advanced"}
                        ]
                    }
                ]
            },
            {
                id: "cybersec-fundamentals",
                name: "Cybersecurity Fundamentals", 
                description: "Core cybersecurity concepts and principles for beginners",
                difficulty: "Beginner",
                estimatedTime: "10-12 hours",
                icon: "🛡️",
                rooms: [
                    {
                        id: "security-basics",
                        name: "Security Basics",
                        description: "Fundamental security concepts and terminology",
                        estimatedTime: "3-4 hours",
                        icon: "🔰",
                        lessons: [
                            {id: "intro-cybersecurity", title: "Introduction to Cybersecurity", pages: 5, xp: 25, time: "30 min", difficulty: "Beginner"},
                            {id: "cia-triad", title: "CIA Triad: Confidentiality, Integrity, Availability", pages: 4, xp: 20, time: "25 min", difficulty: "Beginner"},
                            {id: "threat-landscape", title: "Understanding the Threat Landscape", pages: 6, xp: 30, time: "40 min", difficulty: "Beginner"},
                            {id: "attack-vectors", title: "Common Attack Vectors", pages: 5, xp: 25, time: "35 min", difficulty: "Intermediate"},
                            {id: "security-controls", title: "Types of Security Controls", pages: 4, xp: 20, time: "25 min", difficulty: "Beginner"}
                        ]
                    },
                    {
                        id: "risk-management",
                        name: "Risk Management",
                        description: "Understanding and managing cybersecurity risks",
                        estimatedTime: "2-3 hours",
                        icon: "⚖️",
                        lessons: [
                            {id: "risk-concepts", title: "Risk Management Concepts", pages: 4, xp: 20, time: "25 min", difficulty: "Beginner"},
                            {id: "risk-assessment", title: "Risk Assessment Process", pages: 5, xp: 25, time: "35 min", difficulty: "Intermediate"},
                            {id: "risk-mitigation", title: "Risk Mitigation Strategies", pages: 4, xp: 20, time: "25 min", difficulty: "Intermediate"},
                            {id: "business-continuity", title: "Business Continuity Planning", pages: 4, xp: 20, time: "30 min", difficulty: "Intermediate"}
                        ]
                    },
                    {
                        id: "security-awareness",
                        name: "Security Awareness",
                        description: "Human factors in cybersecurity and awareness training",
                        estimatedTime: "2-3 hours",
                        icon: "👥",
                        lessons: [
                            {id: "human-element", title: "The Human Element in Security", pages: 4, xp: 20, time: "25 min", difficulty: "Beginner"},
                            {id: "social-engineering", title: "Social Engineering Attacks", pages: 5, xp: 25, time: "35 min", difficulty: "Intermediate"},
                            {id: "phishing-awareness", title: "Phishing & Email Security", pages: 5, xp: 25, time: "30 min", difficulty: "Beginner"},
                            {id: "security-culture", title: "Building a Security Culture", pages: 3, xp: 15, time: "20 min", difficulty: "Intermediate"}
                        ]
                    },
                    {
                        id: "compliance-basics",
                        name: "Compliance Basics",
                        description: "Introduction to cybersecurity regulations and standards",
                        estimatedTime: "3-4 hours",
                        icon: "📋",
                        lessons: [
                            {id: "regulatory-landscape", title: "Regulatory Landscape Overview", pages: 4, xp: 20, time: "25 min", difficulty: "Beginner"},
                            {id: "gdpr-basics", title: "GDPR & Data Protection", pages: 5, xp: 25, time: "35 min", difficulty: "Intermediate"},
                            {id: "hipaa-basics", title: "HIPAA & Healthcare Security", pages: 4, xp: 20, time: "25 min", difficulty: "Intermediate"},
                            {id: "pci-dss", title: "PCI DSS & Payment Security", pages: 4, xp: 20, time: "25 min", difficulty: "Intermediate"},
                            {id: "compliance-audits", title: "Security Audits & Assessments", pages: 4, xp: 20, time: "30 min", difficulty: "Advanced"}
                        ]
                    }
                ]
            }
        ];

        // Levels system
        this.levels = [
            {name: "Explorer", minXP: 0, maxXP: 149, color: "#94a3b8", icon: "🧭"},
            {name: "Specialist", minXP: 150, maxXP: 399, color: "#3b82f6", icon: "🔧"},
            {name: "Expert", minXP: 400, maxXP: 799, color: "#06b6d4", icon: "💎"},
            {name: "Master", minXP: 800, maxXP: 1499, color: "#10b981", icon: "👑"},
            {name: "Architect", minXP: 1500, maxXP: 9999, color: "#8b5cf6", icon: "🏛️"}
        ];

        // Comprehensive lesson content with multi-page structure
        this.lessonContent = {
            "siem-intro": {
                title: "Introduction to SIEM",
                pages: [
                    {
                        title: "What is SIEM?",
                        content: `<div class="lesson-content-page">
                            <h2>Security Information and Event Management (SIEM)</h2>
                            <p>SIEM is a comprehensive approach to security management that combines Security Information Management (SIM) and Security Event Management (SEM) into one integrated solution.</p>

                            <div class="definition-box">
                                <h3>📖 Core Definition</h3>
                                <p>SIEM technology collects, aggregates, and analyzes activity from many different resources across your entire IT infrastructure to provide real-time analysis of security alerts generated by applications and network hardware.</p>
                            </div>

                            <h3>🔧 Key Components</h3>
                            <ul class="feature-list">
                                <li><strong>Data Collection:</strong> Gathering logs and events from various sources</li>
                                <li><strong>Data Aggregation:</strong> Combining related events into meaningful information</li>
                                <li><strong>Correlation:</strong> Identifying patterns and relationships between events</li>
                                <li><strong>Alerting:</strong> Notifying security teams of potential threats</li>
                                <li><strong>Reporting:</strong> Providing compliance and forensic reports</li>
                                <li><strong>Dashboards:</strong> Visual representation of security posture</li>
                            </ul>

                            <div class="importance-box">
                                <h3>🎯 Why SIEM Matters</h3>
                                <ol>
                                    <li><strong>Centralized Visibility:</strong> Single pane of glass for security monitoring</li>
                                    <li><strong>Real-time Detection:</strong> Immediate identification of security incidents</li>
                                    <li><strong>Compliance Support:</strong> Meeting regulatory requirements</li>
                                    <li><strong>Forensic Analysis:</strong> Historical data for incident investigation</li>
                                    <li><strong>Threat Intelligence:</strong> Integration with external threat feeds</li>
                                </ol>
                            </div>
                        </div>`
                    },
                    {
                        title: "SIEM Evolution & History",
                        content: `<div class="lesson-content-page">
                            <h2>The Evolution of SIEM Technology</h2>

                            <div class="timeline">
                                <div class="timeline-item">
                                    <h3>🥉 First Generation (1990s-2000s)</h3>
                                    <ul>
                                        <li>Simple log collection and storage</li>
                                        <li>Basic alerting mechanisms</li>
                                        <li>Manual correlation processes</li>
                                        <li>Limited scalability</li>
                                    </ul>
                                </div>

                                <div class="timeline-item">
                                    <h3>🥈 Second Generation (2000s-2010s)</h3>
                                    <ul>
                                        <li>Automated correlation rules</li>
                                        <li>Better user interfaces</li>
                                        <li>Integration with more data sources</li>
                                        <li>Improved reporting capabilities</li>
                                        <li>Introduction of compliance features</li>
                                    </ul>
                                </div>

                                <div class="timeline-item">
                                    <h3>🥇 Third Generation (2010s-Present)</h3>
                                    <ul>
                                        <li>Machine learning and AI integration</li>
                                        <li>Big data analytics capabilities</li>
                                        <li>Cloud-native architectures</li>
                                        <li>User and Entity Behavior Analytics (UEBA)</li>
                                        <li>Integration with threat intelligence platforms</li>
                                        <li>Advanced visualization and dashboards</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="trends-box">
                                <h3>🚀 Current Trends</h3>
                                <ul>
                                    <li><strong>SOAR Integration:</strong> Security Orchestration, Automation, and Response</li>
                                    <li><strong>Cloud-First Approach:</strong> SaaS and cloud-native SIEM solutions</li>
                                    <li><strong>Extended Detection and Response (XDR):</strong> Beyond traditional SIEM</li>
                                    <li><strong>AI-Powered Analytics:</strong> Machine learning for threat detection</li>
                                    <li><strong>Zero Trust Integration:</strong> Supporting zero trust architectures</li>
                                </ul>
                            </div>

                            <div class="market-leaders">
                                <h3>🏢 Market Leaders</h3>
                                <div class="vendor-grid">
                                    <div class="vendor-item">Splunk Enterprise Security</div>
                                    <div class="vendor-item">IBM QRadar</div>
                                    <div class="vendor-item">Microsoft Sentinel</div>
                                    <div class="vendor-item">LogRhythm</div>
                                    <div class="vendor-item">ArcSight (Micro Focus)</div>
                                    <div class="vendor-item">Elastic Security</div>
                                    <div class="vendor-item">Chronicle (Google Cloud)</div>
                                </div>
                            </div>
                        </div>`
                    },
                    {
                        title: "SIEM Architecture Components",
                        content: `<div class="lesson-content-page">
                            <h2>Core SIEM Architecture Components</h2>

                            <div class="architecture-layers">
                                <div class="architecture-layer">
                                    <h3>1. Data Collection Layer</h3>
                                    <ul>
                                        <li><strong>Log Collectors:</strong> Agents installed on systems to collect logs</li>
                                        <li><strong>Network Taps:</strong> Hardware devices for network traffic capture</li>
                                        <li><strong>API Integrations:</strong> Direct connections to cloud services and applications</li>
                                        <li><strong>Syslog Servers:</strong> Centralized logging infrastructure</li>
                                        <li><strong>Database Connectors:</strong> Direct database query capabilities</li>
                                    </ul>
                                </div>

                                <div class="architecture-layer">
                                    <h3>2. Data Processing Layer</h3>
                                    <ul>
                                        <li><strong>Parsing Engines:</strong> Convert raw logs into structured data</li>
                                        <li><strong>Normalization:</strong> Standardize data formats across sources</li>
                                        <li><strong>Enrichment:</strong> Add context to events (geolocation, threat intel)</li>
                                        <li><strong>Filtering:</strong> Remove noise and irrelevant data</li>
                                        <li><strong>Aggregation:</strong> Combine related events</li>
                                    </ul>
                                </div>

                                <div class="architecture-layer">
                                    <h3>3. Analytics Layer</h3>
                                    <ul>
                                        <li><strong>Correlation Engine:</strong> Pattern matching and rule processing</li>
                                        <li><strong>Statistical Analysis:</strong> Baseline establishment and anomaly detection</li>
                                        <li><strong>Machine Learning:</strong> Behavioral analysis and predictive modeling</li>
                                        <li><strong>Threat Intelligence:</strong> Integration with external threat feeds</li>
                                        <li><strong>Risk Scoring:</strong> Prioritization of security events</li>
                                    </ul>
                                </div>

                                <div class="architecture-layer">
                                    <h3>4. Storage Layer</h3>
                                    <ul>
                                        <li><strong>Hot Storage:</strong> Recent data for real-time analysis</li>
                                        <li><strong>Warm Storage:</strong> Historical data for investigations</li>
                                        <li><strong>Cold Storage:</strong> Long-term archival for compliance</li>
                                        <li><strong>Data Compression:</strong> Efficient storage utilization</li>
                                        <li><strong>Data Retention:</strong> Automated lifecycle management</li>
                                    </ul>
                                </div>

                                <div class="architecture-layer">
                                    <h3>5. Presentation Layer</h3>
                                    <ul>
                                        <li><strong>Dashboards:</strong> Real-time security posture visualization</li>
                                        <li><strong>Reports:</strong> Scheduled and ad-hoc reporting</li>
                                        <li><strong>Alerts:</strong> Notification mechanisms</li>
                                        <li><strong>Investigation Tools:</strong> Forensic analysis capabilities</li>
                                        <li><strong>APIs:</strong> Integration with other security tools</li>
                                    </ul>
                                </div>
                            </div>
                        </div>`
                    },
                    {
                        title: "SIEM Deployment Models",
                        content: `<div class="lesson-content-page">
                            <h2>SIEM Deployment Options</h2>

                            <div class="deployment-models">
                                <div class="deployment-model">
                                    <h3>1. On-Premises SIEM</h3>
                                    <div class="pros-cons">
                                        <div class="pros">
                                            <h4>✅ Advantages:</h4>
                                            <ul>
                                                <li>Complete control over data and infrastructure</li>
                                                <li>Customization flexibility</li>
                                                <li>No data leaves the organization</li>
                                                <li>Compliance with data residency requirements</li>
                                            </ul>
                                        </div>
                                        <div class="cons">
                                            <h4>❌ Disadvantages:</h4>
                                            <ul>
                                                <li>High upfront capital investment</li>
                                                <li>Ongoing maintenance and updates</li>
                                                <li>Scalability challenges</li>
                                                <li>Requires dedicated security expertise</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <p><strong>Best For:</strong> Large enterprises with strict compliance requirements</p>
                                </div>

                                <div class="deployment-model">
                                    <h3>2. Cloud-Based SIEM (SaaS)</h3>
                                    <div class="pros-cons">
                                        <div class="pros">
                                            <h4>✅ Advantages:</h4>
                                            <ul>
                                                <li>Lower upfront costs</li>
                                                <li>Automatic updates and maintenance</li>
                                                <li>Elastic scalability</li>
                                                <li>Faster deployment</li>
                                                <li>Built-in threat intelligence</li>
                                            </ul>
                                        </div>
                                        <div class="cons">
                                            <h4>❌ Disadvantages:</h4>
                                            <ul>
                                                <li>Data stored outside organization</li>
                                                <li>Less customization options</li>
                                                <li>Ongoing subscription costs</li>
                                                <li>Internet connectivity dependency</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <p><strong>Best For:</strong> Small to medium businesses, rapid deployment needs</p>
                                </div>

                                <div class="deployment-model">
                                    <h3>3. Hybrid SIEM</h3>
                                    <div class="pros-cons">
                                        <div class="pros">
                                            <h4>✅ Advantages:</h4>
                                            <ul>
                                                <li>Balance of control and convenience</li>
                                                <li>Flexible data placement</li>
                                                <li>Gradual cloud migration path</li>
                                                <li>Optimized cost structure</li>
                                            </ul>
                                        </div>
                                        <div class="cons">
                                            <h4>❌ Disadvantages:</h4>
                                            <ul>
                                                <li>Complex architecture</li>
                                                <li>Integration challenges</li>
                                                <li>Dual management overhead</li>
                                                <li>Potential security gaps</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <p><strong>Best For:</strong> Organizations transitioning to cloud, complex compliance needs</p>
                                </div>

                                <div class="deployment-model">
                                    <h3>4. Managed SIEM (MSSPs)</h3>
                                    <div class="pros-cons">
                                        <div class="pros">
                                            <h4>✅ Advantages:</h4>
                                            <ul>
                                                <li>24/7 monitoring by experts</li>
                                                <li>Cost-effective for smaller organizations</li>
                                                <li>Access to specialized skills</li>
                                                <li>Faster incident response</li>
                                            </ul>
                                        </div>
                                        <div class="cons">
                                            <h4>❌ Disadvantages:</h4>
                                            <ul>
                                                <li>Less control over processes</li>
                                                <li>Dependency on service provider</li>
                                                <li>Potential communication delays</li>
                                                <li>Limited customization</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <p><strong>Best For:</strong> Organizations lacking internal security expertise</p>
                                </div>
                            </div>
                        </div>`
                    }
                ],
                quiz: [
                    {
                        question: "What does SIEM stand for?",
                        options: ["Security Information and Event Management", "System Information and Event Monitoring", "Security Intelligence and Event Modeling", "System Intelligence and Event Management"],
                        correct: 0
                    },
                    {
                        question: "Which SIEM deployment model provides the most control over data?",
                        options: ["Cloud-based", "On-premises", "Hybrid", "Managed"],
                        correct: 1
                    }
                ],
                resources: [
                    {title: "NIST SIEM Guidelines", url: "#", type: "guide"},
                    {title: "SIEM Buyer's Guide", url: "#", type: "whitepaper"},
                    {title: "SIEM Architecture Best Practices", url: "#", type: "article"}
                ]
            },
            "osi-overview": {
                title: "OSI Model Overview",
                pages: [
                    {
                        title: "Introduction to the OSI Model",
                        content: `<div class="lesson-content-page">
                            <h2>The Open Systems Interconnection (OSI) Model</h2>
                            <p>The OSI model is a conceptual framework that standardizes how different network protocols and systems communicate. Developed by the International Organization for Standardization (ISO) in 1984, it provides a universal language for network communication.</p>

                            <div class="why-matters">
                                <h3>🎯 Why the OSI Model Matters</h3>
                                <ul>
                                    <li><strong>Standardization:</strong> Creates a common framework for network design</li>
                                    <li><strong>Troubleshooting:</strong> Helps isolate network problems by layer</li>
                                    <li><strong>Interoperability:</strong> Ensures different vendors' products can work together</li>
                                    <li><strong>Education:</strong> Provides a structured way to learn networking</li>
                                    <li><strong>Design:</strong> Guides network architecture decisions</li>
                                </ul>
                            </div>

                            <div class="osi-layers">
                                <h3>📚 The 7 Layers (Bottom to Top)</h3>
                                <div class="layer-stack">
                                    <div class="layer layer-7">7. Application Layer - Network services to applications</div>
                                    <div class="layer layer-6">6. Presentation Layer - Data encryption, compression, and formatting</div>
                                    <div class="layer layer-5">5. Session Layer - Dialog control and session management</div>
                                    <div class="layer layer-4">4. Transport Layer - End-to-end delivery and error recovery</div>
                                    <div class="layer layer-3">3. Network Layer - Path determination and logical addressing</div>
                                    <div class="layer layer-2">2. Data Link Layer - Node-to-node delivery and error detection</div>
                                    <div class="layer layer-1">1. Physical Layer - Electrical signals and physical connections</div>
                                </div>
                            </div>

                            <div class="memory-aid">
                                <h3>🧠 Memory Aid</h3>
                                <p class="mnemonic">"Please Do Not Throw Sausage Pizza Away"</p>
                                <p>(Physical, Data Link, Network, Transport, Session, Presentation, Application)</p>
                            </div>
                        </div>`
                    },
                    {
                        title: "OSI vs. Real-World Implementation",
                        content: `<div class="lesson-content-page">
                            <h2>OSI Model vs. TCP/IP Stack</h2>
                            <p>While the OSI model provides a theoretical framework, the TCP/IP model is what's actually implemented in most networks today.</p>

                            <div class="comparison-table">
                                <h3>🔄 OSI Layer Mapping to TCP/IP</h3>
                                <div class="mapping">
                                    <div class="mapping-item">
                                        <span class="osi-layers">Physical + Data Link</span>
                                        <span class="arrow">↔</span>
                                        <span class="tcpip-layer">Network Access Layer</span>
                                    </div>
                                    <div class="mapping-item">
                                        <span class="osi-layers">Network</span>
                                        <span class="arrow">↔</span>
                                        <span class="tcpip-layer">Internet Layer</span>
                                    </div>
                                    <div class="mapping-item">
                                        <span class="osi-layers">Transport</span>
                                        <span class="arrow">↔</span>
                                        <span class="tcpip-layer">Transport Layer</span>
                                    </div>
                                    <div class="mapping-item">
                                        <span class="osi-layers">Session + Presentation + Application</span>
                                        <span class="arrow">↔</span>
                                        <span class="tcpip-layer">Application Layer</span>
                                    </div>
                                </div>
                            </div>

                            <div class="real-world-examples">
                                <h3>🌍 Real-World Examples by Layer</h3>

                                <div class="layer-examples">
                                    <div class="example-section">
                                        <h4>Layer 1 (Physical):</h4>
                                        <ul>
                                            <li>Ethernet cables (Cat5e, Cat6)</li>
                                            <li>Fiber optic cables</li>
                                            <li>Wireless radio frequencies</li>
                                            <li>USB connections</li>
                                            <li>Network interface cards (NICs)</li>
                                        </ul>
                                    </div>

                                    <div class="example-section">
                                        <h4>Layer 2 (Data Link):</h4>
                                        <ul>
                                            <li>Ethernet frames</li>
                                            <li>WiFi (802.11)</li>
                                            <li>Bluetooth</li>
                                            <li>PPP (Point-to-Point Protocol)</li>
                                            <li>MAC addresses</li>
                                        </ul>
                                    </div>

                                    <div class="example-section">
                                        <h4>Layer 3 (Network):</h4>
                                        <ul>
                                            <li>IP (Internet Protocol)</li>
                                            <li>ICMP (Internet Control Message Protocol)</li>
                                            <li>OSPF (Open Shortest Path First)</li>
                                            <li>BGP (Border Gateway Protocol)</li>
                                            <li>Routers</li>
                                        </ul>
                                    </div>

                                    <div class="example-section">
                                        <h4>Layer 4 (Transport):</h4>
                                        <ul>
                                            <li>TCP (Transmission Control Protocol)</li>
                                            <li>UDP (User Datagram Protocol)</li>
                                            <li>Port numbers</li>
                                            <li>Firewalls operating at this level</li>
                                        </ul>
                                    </div>

                                    <div class="example-section">
                                        <h4>Layer 5 (Session):</h4>
                                        <ul>
                                            <li>NetBIOS</li>
                                            <li>SQL sessions</li>
                                            <li>RPC (Remote Procedure Call)</li>
                                            <li>Session tokens</li>
                                        </ul>
                                    </div>

                                    <div class="example-section">
                                        <h4>Layer 6 (Presentation):</h4>
                                        <ul>
                                            <li>SSL/TLS encryption</li>
                                            <li>JPEG, GIF image formats</li>
                                            <li>MPEG video compression</li>
                                            <li>ASCII, EBCDIC character encoding</li>
                                        </ul>
                                    </div>

                                    <div class="example-section">
                                        <h4>Layer 7 (Application):</h4>
                                        <ul>
                                            <li>HTTP/HTTPS</li>
                                            <li>FTP, SFTP</li>
                                            <li>SMTP, POP3, IMAP</li>
                                            <li>DNS</li>
                                            <li>DHCP</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>`
                    },
                    {
                        title: "Data Flow Through OSI Layers",
                        content: `<div class="lesson-content-page">
                            <h2>How Data Travels Through the OSI Stack</h2>

                            <div class="data-flow">
                                <h3>📤 Sending Data (Encapsulation Process)</h3>

                                <div class="flow-step">
                                    <h4>Application Layer (7):</h4>
                                    <ul>
                                        <li>User creates data (email, web request, file)</li>
                                        <li>Application adds application headers</li>
                                        <li>Example: HTTP headers added to web request</li>
                                    </ul>
                                </div>

                                <div class="flow-step">
                                    <h4>Presentation Layer (6):</h4>
                                    <ul>
                                        <li>Data encryption/compression if needed</li>
                                        <li>Character encoding conversion</li>
                                        <li>SSL/TLS encryption applied here</li>
                                    </ul>
                                </div>

                                <div class="flow-step">
                                    <h4>Session Layer (5):</h4>
                                    <ul>
                                        <li>Session establishment and management</li>
                                        <li>Authentication tokens added</li>
                                        <li>Session IDs assigned</li>
                                    </ul>
                                </div>

                                <div class="flow-step">
                                    <h4>Transport Layer (4):</h4>
                                    <ul>
                                        <li>Segments data into manageable chunks</li>
                                        <li>Adds TCP or UDP headers</li>
                                        <li>Port numbers assigned (source and destination)</li>
                                        <li>Sequence numbers for TCP</li>
                                    </ul>
                                </div>

                                <div class="flow-step">
                                    <h4>Network Layer (3):</h4>
                                    <ul>
                                        <li>Adds IP headers with source and destination IP addresses</li>
                                        <li>Routing decisions made</li>
                                        <li>Time To Live (TTL) set</li>
                                    </ul>
                                </div>

                                <div class="flow-step">
                                    <h4>Data Link Layer (2):</h4>
                                    <ul>
                                        <li>Frames created with MAC addresses</li>
                                        <li>Error detection codes added (CRC)</li>
                                        <li>Frame synchronization</li>
                                    </ul>
                                </div>

                                <div class="flow-step">
                                    <h4>Physical Layer (1):</h4>
                                    <ul>
                                        <li>Converts frames to electrical signals</li>
                                        <li>Transmitted over physical medium</li>
                                        <li>Bits sent as voltage levels or light pulses</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="receiving-data">
                                <h3>📥 Receiving Data (De-encapsulation Process)</h3>
                                <p>The receiving device reverses this process, removing headers at each layer until the original data reaches the application.</p>
                            </div>

                            <div class="pdu-info">
                                <h3>📦 Protocol Data Units (PDUs)</h3>
                                <ul>
                                    <li>Layer 7-5: <strong>Data</strong></li>
                                    <li>Layer 4: <strong>Segments</strong> (TCP) or <strong>Datagrams</strong> (UDP)</li>
                                    <li>Layer 3: <strong>Packets</strong></li>
                                    <li>Layer 2: <strong>Frames</strong></li>
                                    <li>Layer 1: <strong>Bits</strong></li>
                                </ul>
                            </div>
                        </div>`
                    },
                    {
                        title: "OSI Model in Cybersecurity",
                        content: `<div class="lesson-content-page">
                            <h2>Security Implications at Each OSI Layer</h2>

                            <div class="security-layers">
                                <div class="security-layer">
                                    <h3>Layer 1 (Physical) Security</h3>
                                    <div class="threats-controls">
                                        <div class="threats">
                                            <h4>🚨 Threats:</h4>
                                            <ul>
                                                <li>Physical access to network infrastructure</li>
                                                <li>Cable tapping and wiretapping</li>
                                                <li>Electromagnetic interference</li>
                                                <li>Hardware tampering</li>
                                            </ul>
                                        </div>
                                        <div class="controls">
                                            <h4>🔐 Security Measures:</h4>
                                            <ul>
                                                <li>Physical access controls</li>
                                                <li>Secure wiring closets</li>
                                                <li>Fiber optic cables (harder to tap)</li>
                                                <li>Equipment locks and tamper detection</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="security-layer">
                                    <h3>Layer 2 (Data Link) Security</h3>
                                    <div class="threats-controls">
                                        <div class="threats">
                                            <h4>🚨 Threats:</h4>
                                            <ul>
                                                <li>MAC address spoofing</li>
                                                <li>ARP poisoning attacks</li>
                                                <li>VLAN hopping</li>
                                                <li>Switch flooding attacks</li>
                                            </ul>
                                        </div>
                                        <div class="controls">
                                            <h4>🔐 Security Measures:</h4>
                                            <ul>
                                                <li>Port security on switches</li>
                                                <li>802.1X authentication</li>
                                                <li>VLAN segmentation</li>
                                                <li>Dynamic ARP inspection</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="security-layer">
                                    <h3>Layer 3 (Network) Security</h3>
                                    <div class="threats-controls">
                                        <div class="threats">
                                            <h4>🚨 Threats:</h4>
                                            <ul>
                                                <li>IP spoofing</li>
                                                <li>Routing attacks</li>
                                                <li>DDoS attacks</li>
                                                <li>Man-in-the-middle attacks</li>
                                            </ul>
                                        </div>
                                        <div class="controls">
                                            <h4>🔐 Security Measures:</h4>
                                            <ul>
                                                <li>Firewalls and ACLs</li>
                                                <li>IPSec encryption</li>
                                                <li>Route filtering</li>
                                                <li>Network segmentation</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="security-layer">
                                    <h3>Layer 4 (Transport) Security</h3>
                                    <div class="threats-controls">
                                        <div class="threats">
                                            <h4>🚨 Threats:</h4>
                                            <ul>
                                                <li>Port scanning</li>
                                                <li>TCP hijacking</li>
                                                <li>SYN flood attacks</li>
                                                <li>Connection manipulation</li>
                                            </ul>
                                        </div>
                                        <div class="controls">
                                            <h4>🔐 Security Measures:</h4>
                                            <ul>
                                                <li>Stateful firewalls</li>
                                                <li>Port filtering</li>
                                                <li>Rate limiting</li>
                                                <li>Connection monitoring</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div class="security-layer">
                                    <h3>Layer 5-7 (Session/Presentation/Application) Security</h3>
                                    <div class="threats-controls">
                                        <div class="threats">
                                            <h4>🚨 Threats:</h4>
                                            <ul>
                                                <li>Application vulnerabilities</li>
                                                <li>Data interception</li>
                                                <li>Authentication bypass</li>
                                                <li>Malware and viruses</li>
                                            </ul>
                                        </div>
                                        <div class="controls">
                                            <h4>🔐 Security Measures:</h4>
                                            <ul>
                                                <li>Application firewalls (WAF)</li>
                                                <li>Intrusion detection systems</li>
                                                <li>Antivirus software</li>
                                                <li>Application security testing</li>
                                                <li>SSL/TLS encryption</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="security-tools">
                                <h3>🛠️ Security Tools by Layer</h3>
                                <ul>
                                    <li><strong>Physical:</strong> Security cameras, locks</li>
                                    <li><strong>Data Link:</strong> Switch port security, 802.1X</li>
                                    <li><strong>Network:</strong> Routers, firewalls, IDS</li>
                                    <li><strong>Transport:</strong> Proxy servers, load balancers</li>
                                    <li><strong>Application:</strong> WAF, antivirus, SIEM</li>
                                </ul>
                            </div>
                        </div>`
                    }
                ],
                quiz: [
                    {
                        question: "How many layers are in the OSI model?",
                        options: ["5", "6", "7", "8"],
                        correct: 2
                    },
                    {
                        question: "Which layer is responsible for end-to-end delivery?",
                        options: ["Network", "Transport", "Session", "Application"],
                        correct: 1
                    }
                ],
                resources: [
                    {title: "ISO OSI Reference Model", url: "#", type: "standard"},
                    {title: "Network Troubleshooting with OSI", url: "#", type: "guide"},
                    {title: "OSI vs TCP/IP Comparison", url: "#", type: "article"}
                ]
            }
        };

        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
        this.renderDashboard();
        this.hideLoadingScreen();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => loadingScreen.style.display = 'none', 300);
            }
        }, 1000);
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile menu
        const mobileToggle = document.getElementById('mobile-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-view]')) {
                e.preventDefault();
                this.showView(e.target.dataset.view);
            }
        });

        // Auto-save progress
        setInterval(() => this.saveProgress(), 30000);
    }

    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme();
        localStorage.setItem('orbit-theme', this.theme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        const body = document.body;
        if (this.theme === 'dark') {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        }
    }

    toggleMobileMenu() {
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav) {
            mobileNav.classList.toggle('active');
        }
    }

    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('active');
        });

        // Show target view
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
            this.currentView = viewName;
        }

        // Update navigation
        this.updateNavigation();

        // Load view content
        switch(viewName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'roadmaps':
                this.renderRoadmaps();
                break;
            case 'modules':
                this.renderModules();
                break;
            case 'progress':
                this.renderProgress();
                break;
        }

        // Close mobile menu
        const mobileNav = document.getElementById('mobile-nav');
        if (mobileNav) {
            mobileNav.classList.remove('active');
        }
    }

    updateNavigation() {
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === this.currentView) {
                link.classList.add('active');
            }
        });
    }

    renderDashboard() {
        this.updateUserStats();
        this.renderRecommendedPaths();
        this.renderRecentActivity();
        this.renderAchievements();
    }

    updateUserStats() {
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.getNextLevel();

        // Update level display
        const levelElement = document.getElementById('current-level');
        if (levelElement) {
            levelElement.textContent = currentLevel.name;
            levelElement.style.color = currentLevel.color;
        }

        // Update XP display
        const xpCurrent = document.getElementById('xp-current');
        const xpNext = document.getElementById('xp-next');
        if (xpCurrent) xpCurrent.textContent = this.userProgress.currentXP;
        if (xpNext && nextLevel) {
            xpNext.textContent = nextLevel.minXP;
        }

        // Update progress bar
        const progressBar = document.getElementById('xp-progress');
        if (progressBar && nextLevel) {
            const progressPercent = ((this.userProgress.currentXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100;
            progressBar.style.width = `${Math.min(Math.max(progressPercent, 0), 100)}%`;
        }

        // Update stats
        const statsElements = {
            'lessons-completed': this.userProgress.completedLessons.length,
            'achievements-earned': this.userProgress.achievements.length,
            'streak-days': this.userProgress.streakDays
        };

        Object.entries(statsElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    }

    getCurrentLevel() {
        const xp = this.userProgress.currentXP;
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (xp >= this.levels[i].minXP) {
                return this.levels[i];
            }
        }
        return this.levels[0];
    }

    getNextLevel() {
        const currentLevel = this.getCurrentLevel();
        const currentIndex = this.levels.indexOf(currentLevel);
        return currentIndex < this.levels.length - 1 ? this.levels[currentIndex + 1] : null;
    }

    renderRoadmaps() {
        const container = document.getElementById('roadmaps-container');
        if (!container) return;

        container.innerHTML = this.learningPaths.map(path => `
            <div class="roadmap-card" data-path="${path.id}">
                <div class="roadmap-header">
                    <div class="roadmap-icon">${path.icon}</div>
                    <div class="roadmap-info">
                        <h3 class="roadmap-title">${path.name}</h3>
                        <p class="roadmap-description">${path.description}</p>
                    </div>
                </div>
                <div class="roadmap-details">
                    <div class="detail-item">
                        <span class="detail-label">Difficulty:</span>
                        <span class="difficulty-badge ${path.difficulty.toLowerCase()}">${path.difficulty}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Time:</span>
                        <span>${path.estimatedTime}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Prerequisites:</span>
                        <span>${path.prerequisite}</span>
                    </div>
                </div>
                <div class="roadmap-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.calculatePathProgress(path.id)}%;"></div>
                    </div>
                    <span class="progress-text">${this.calculatePathProgress(path.id)}% Complete</span>
                </div>
                <button class="btn btn-primary" onclick="app.startPath('${path.id}')">
                    ${this.calculatePathProgress(path.id) > 0 ? 'Continue Path' : 'Start Path'}
                </button>
            </div>
        `).join('');
    }

    renderModules() {
        const container = document.getElementById('modules-container');
        if (!container) return;

        container.innerHTML = this.modules.map(module => `
            <div class="module-card" onclick="app.openModule('${module.id}')">
                <div class="module-header">
                    <div class="module-icon">${module.icon}</div>
                    <div class="module-info">
                        <h3 class="module-title">${module.name}</h3>
                        <p class="module-description">${module.description}</p>
                    </div>
                </div>
                <div class="module-stats">
                    <div class="stat">
                        <span class="stat-value">${module.rooms.length}</span>
                        <span class="stat-label">Rooms</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${this.getTotalLessonsInModule(module)}</span>
                        <span class="stat-label">Lessons</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${module.estimatedTime}</span>
                        <span class="stat-label">Duration</span>
                    </div>
                </div>
                <div class="module-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.calculateModuleProgress(module.id)}%;"></div>
                    </div>
                    <span class="progress-text">${this.calculateModuleProgress(module.id)}% Complete</span>
                </div>
            </div>
        `).join('');
    }

    openModule(moduleId) {
        const module = this.modules.find(m => m.id === moduleId);
        if (!module) return;

        this.currentModule = module;
        this.showModuleView(module);
    }

    showModuleView(module) {
        const container = document.getElementById('module-detail-container');
        if (!container) return;

        container.innerHTML = `
            <div class="module-detail">
                <div class="module-detail-header">
                    <button class="btn btn-secondary" onclick="app.showView('modules')">
                        ← Back to Modules
                    </button>
                    <h1 class="module-detail-title">${module.icon} ${module.name}</h1>
                    <p class="module-detail-description">${module.description}</p>
                    <div class="module-detail-stats">
                        <div class="stat">
                            <span class="stat-label">Difficulty:</span>
                            <span class="difficulty-badge ${module.difficulty.toLowerCase()}">${module.difficulty}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Duration:</span>
                            <span>${module.estimatedTime}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Progress:</span>
                            <span>${this.calculateModuleProgress(module.id)}% Complete</span>
                        </div>
                    </div>
                </div>

                <div class="rooms-container">
                    ${module.rooms.map(room => `
                        <div class="room-card" onclick="app.openRoom('${module.id}', '${room.id}')">
                            <div class="room-header">
                                <div class="room-icon">${room.icon}</div>
                                <div class="room-info">
                                    <h3 class="room-title">${room.name}</h3>
                                    <p class="room-description">${room.description}</p>
                                    <div class="room-meta">
                                        <span class="room-duration">⏱️ ${room.estimatedTime}</span>
                                        <span class="room-lessons">${room.lessons.length} lessons</span>
                                    </div>
                                </div>
                            </div>
                            <div class="room-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${this.calculateRoomProgress(room)}%;"></div>
                                </div>
                                <span class="progress-text">${this.calculateRoomProgress(room)}% Complete</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Switch to module detail view
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        const moduleView = document.getElementById('module-view');
        if (moduleView) {
            moduleView.classList.add('active');
            this.currentView = 'module';
        }
    }

    openRoom(moduleId, roomId) {
        const module = this.modules.find(m => m.id === moduleId);
        const room = module?.rooms.find(r => r.id === roomId);
        if (!room) return;

        this.currentRoom = room;
        this.showRoomView(module, room);
    }

    showRoomView(module, room) {
        const container = document.getElementById('room-detail-container');
        if (!container) return;

        container.innerHTML = `
            <div class="room-detail">
                <div class="room-detail-header">
                    <button class="btn btn-secondary" onclick="app.openModule('${module.id}')">
                        ← Back to ${module.name}
                    </button>
                    <h1 class="room-detail-title">${room.icon} ${room.name}</h1>
                    <p class="room-detail-description">${room.description}</p>
                    <div class="room-detail-stats">
                        <span class="room-duration">⏱️ ${room.estimatedTime}</span>
                        <span class="room-lessons">${room.lessons.length} lessons</span>
                        <span class="room-progress">${this.calculateRoomProgress(room)}% complete</span>
                    </div>
                </div>

                <div class="lessons-container">
                    ${room.lessons.map((lesson, index) => {
                        const isCompleted = this.userProgress.completedLessons.includes(lesson.id);
                        return `
                            <div class="lesson-card ${isCompleted ? 'completed' : ''}" onclick="app.openLesson('${module.id}', '${room.id}', '${lesson.id}')">
                                <div class="lesson-number">${isCompleted ? '✅' : index + 1}</div>
                                <div class="lesson-info">
                                    <h3 class="lesson-title">${lesson.title}</h3>
                                    <div class="lesson-meta">
                                        <span class="difficulty-badge ${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
                                        <span class="lesson-duration">⏱️ ${lesson.time}</span>
                                        <span class="lesson-xp">+${lesson.xp} XP</span>
                                        <span class="lesson-pages">${lesson.pages} pages</span>
                                    </div>
                                </div>
                                <div class="lesson-status">
                                    ${isCompleted ? '<span class="status-completed">Completed</span>' : '<span class="status-pending">Start</span>'}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // Switch to room detail view
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        const roomView = document.getElementById('room-view');
        if (roomView) {
            roomView.classList.add('active');
            this.currentView = 'room';
        }
    }

    openLesson(moduleId, roomId, lessonId) {
        const module = this.modules.find(m => m.id === moduleId);
        const room = module?.rooms.find(r => r.id === roomId);
        const lesson = room?.lessons.find(l => l.id === lessonId);

        if (!lesson) return;

        this.currentLesson = { moduleId, roomId, lessonId, lesson, module, room };
        this.currentPage = 0;
        this.showLessonView();
    }

    showLessonView() {
        if (!this.currentLesson) return;

        const { lesson, module, room } = this.currentLesson;
        const lessonContent = this.lessonContent[lesson.id];
        const isCompleted = this.userProgress.completedLessons.includes(lesson.id);

        const container = document.getElementById('lesson-detail-container');
        if (!container) return;

        if (lessonContent) {
            const currentPageContent = lessonContent.pages[this.currentPage];

            container.innerHTML = `
                <div class="lesson-detail">
                    <div class="lesson-detail-header">
                        <button class="btn btn-secondary" onclick="app.openRoom('${module.id}', '${room.id}')">
                            ← Back to ${room.name}
                        </button>
                        <div class="lesson-breadcrumb">
                            ${module.name} > ${room.name} > ${lesson.title}
                        </div>
                        <h1 class="lesson-detail-title">${lesson.title}</h1>
                        <div class="lesson-detail-meta">
                            <span class="difficulty-badge ${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
                            <span class="lesson-duration">⏱️ ${lesson.time}</span>
                            <span class="lesson-xp">+${lesson.xp} XP</span>
                            ${isCompleted ? '<span class="status-completed">✅ Completed</span>' : ''}
                        </div>
                    </div>

                    <div class="lesson-content-area">
                        <div class="lesson-navigation">
                            <div class="page-indicator">
                                Page ${this.currentPage + 1} of ${lessonContent.pages.length}
                            </div>
                            <div class="page-dots">
                                ${lessonContent.pages.map((_, index) => `
                                    <span class="page-dot ${index === this.currentPage ? 'active' : ''}" 
                                          onclick="app.goToPage(${index})"></span>
                                `).join('')}
                            </div>
                        </div>

                        <div class="lesson-page">
                            <h2 class="page-title">${currentPageContent.title}</h2>
                            <div class="page-content">${currentPageContent.content}</div>
                        </div>

                        <div class="lesson-actions">
                            <button class="btn btn-secondary" 
                                    onclick="app.previousPage()" 
                                    ${this.currentPage === 0 ? 'disabled' : ''}>
                                ← Previous
                            </button>

                            ${this.currentPage < lessonContent.pages.length - 1 ? 
                                '<button class="btn btn-primary" onclick="app.nextPage()">Next →</button>' :
                                `<button class="btn btn-success" onclick="app.completeLesson()" ${isCompleted ? 'disabled' : ''}>
                                    ${isCompleted ? 'Completed ✅' : `Complete Lesson (+${lesson.xp} XP)`}
                                </button>`
                            }
                        </div>
                    </div>

                    ${lessonContent.resources ? `
                        <div class="lesson-resources">
                            <h3>📚 Additional Resources</h3>
                            <div class="resources-list">
                                ${lessonContent.resources.map(resource => `
                                    <a href="${resource.url}" class="resource-link" target="_blank">
                                        <span class="resource-type">${resource.type}</span>
                                        <span class="resource-title">${resource.title}</span>
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            // Fallback for lessons without detailed content
            container.innerHTML = `
                <div class="lesson-detail">
                    <div class="lesson-detail-header">
                        <button class="btn btn-secondary" onclick="app.openRoom('${module.id}', '${room.id}')">
                            ← Back to ${room.name}
                        </button>
                        <h1 class="lesson-detail-title">${lesson.title}</h1>
                        <div class="lesson-detail-meta">
                            <span class="difficulty-badge ${lesson.difficulty.toLowerCase()}">${lesson.difficulty}</span>
                            <span class="lesson-duration">⏱️ ${lesson.time}</span>
                            <span class="lesson-xp">+${lesson.xp} XP</span>
                        </div>
                    </div>

                    <div class="lesson-content-area">
                        <div class="lesson-placeholder">
                            <h2>Lesson Content Coming Soon</h2>
                            <p>This lesson content is being developed and will be available in a future update.</p>
                            <p>You can still complete this lesson to earn XP and track your progress.</p>
                        </div>

                        <div class="lesson-actions">
                            <button class="btn btn-success" onclick="app.completeLesson()" ${isCompleted ? 'disabled' : ''}>
                                ${isCompleted ? 'Completed ✅' : `Complete Lesson (+${lesson.xp} XP)`}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Switch to lesson view
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
        const lessonView = document.getElementById('lesson-view');
        if (lessonView) {
            lessonView.classList.add('active');
            this.currentView = 'lesson';
        }
    }

    goToPage(pageIndex) {
        this.currentPage = pageIndex;
        this.showLessonView();
    }

    nextPage() {
        const lessonContent = this.lessonContent[this.currentLesson.lesson.id];
        if (this.currentPage < lessonContent.pages.length - 1) {
            this.currentPage++;
            this.showLessonView();
        }
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.showLessonView();
        }
    }

    completeLesson() {
        if (!this.currentLesson) return;

        const { lessonId, lesson } = this.currentLesson;

        // Check if already completed
        if (this.userProgress.completedLessons.includes(lessonId)) return;

        // Add to completed lessons
        this.userProgress.completedLessons.push(lessonId);

        // Add XP
        this.userProgress.currentXP += lesson.xp;

        // Check for level up
        const oldLevel = this.getCurrentLevel();
        const newLevel = this.getCurrentLevel();
        const leveledUp = oldLevel.name !== newLevel.name;

        // Update level
        this.userProgress.level = newLevel.name;

        // Show completion feedback
        this.showCompletionFeedback(lesson.xp, newLevel.name, leveledUp);

        // Update UI
        this.updateUserStats();
        this.showLessonView();

        // Save progress
        this.saveProgress();
    }

    showCompletionFeedback(xp, levelName, leveledUp) {
        const feedback = document.createElement('div');
        feedback.className = 'completion-feedback';
        feedback.innerHTML = `
            <div class="feedback-content">
                <div class="feedback-icon">🎉</div>
                <h3>Lesson Completed!</h3>
                <p class="xp-earned">+${xp} XP earned</p>
                ${leveledUp ? `<p class="level-up">🆙 Level up! You're now a ${levelName}!</p>` : `<p class="level-info">Current Level: ${levelName}</p>`}
            </div>
        `;

        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.classList.add('show');
        }, 100);

        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }

    // Helper methods
    calculatePathProgress(pathId) {
        const path = this.learningPaths.find(p => p.id === pathId);
        if (!path) return 0;

        const pathModules = this.modules.filter(m => path.modules.includes(m.id));
        const totalLessons = pathModules.reduce((total, module) => total + this.getTotalLessonsInModule(module), 0);
        const completedLessons = pathModules.reduce((total, module) => {
            return total + this.getCompletedLessonsInModule(module);
        }, 0);

        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    calculateModuleProgress(moduleId) {
        const module = this.modules.find(m => m.id === moduleId);
        if (!module) return 0;

        const totalLessons = this.getTotalLessonsInModule(module);
        const completedLessons = this.getCompletedLessonsInModule(module);

        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    calculateRoomProgress(room) {
        const totalLessons = room.lessons.length;
        const completedLessons = room.lessons.filter(lesson => 
            this.userProgress.completedLessons.includes(lesson.id)
        ).length;

        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    }

    getTotalLessonsInModule(module) {
        return module.rooms.reduce((total, room) => total + room.lessons.length, 0);
    }

    getCompletedLessonsInModule(module) {
        return module.rooms.reduce((total, room) => {
            return total + room.lessons.filter(lesson => 
                this.userProgress.completedLessons.includes(lesson.id)
            ).length;
        }, 0);
    }

    renderRecommendedPaths() {
        const container = document.getElementById('recommended-paths');
        if (!container) return;

        // Show first 3 paths as recommendations
        const recommendedPaths = this.learningPaths.slice(0, 3);

        container.innerHTML = recommendedPaths.map(path => `
            <div class="path-card" onclick="app.startPath('${path.id}')">
                <div class="path-icon">${path.icon}</div>
                <h3 class="path-title">${path.name}</h3>
                <p class="path-description">${path.description}</p>
                <div class="path-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${this.calculatePathProgress(path.id)}%;"></div>
                    </div>
                    <span class="progress-text">${this.calculatePathProgress(path.id)}% Complete</span>
                </div>
            </div>
        `).join('');
    }

    renderRecentActivity() {
        const container = document.getElementById('recent-activity');
        if (!container) return;

        const recentLessons = this.getRecentCompletedLessons(5);

        if (recentLessons.length === 0) {
            container.innerHTML = `
                <div class="activity-placeholder">
                    <div class="placeholder-icon">🚀</div>
                    <h3>Start Your Learning Journey</h3>
                    <p>Complete lessons to see your recent activity here.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recentLessons.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">✅</div>
                <div class="activity-content">
                    <h4>${activity.lesson.title}</h4>
                    <p>${activity.module.name} > ${activity.room.name}</p>
                    <span class="activity-xp">+${activity.lesson.xp} XP</span>
                </div>
            </div>
        `).join('');
    }

    renderAchievements() {
        const container = document.getElementById('achievements-display');
        if (!container) return;

        // Check for new achievements
        this.checkForAchievements();

        const earnedAchievements = this.userProgress.achievements;

        if (earnedAchievements.length === 0) {
            container.innerHTML = `
                <div class="achievements-placeholder">
                    <div class="placeholder-icon">🏆</div>
                    <p>Complete lessons to earn achievements!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = earnedAchievements.map(achievementId => {
            const achievement = this.getAchievementById(achievementId);
            return `
                <div class="achievement-badge">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    getRecentCompletedLessons(limit = 5) {
        const recentLessons = [];

        this.modules.forEach(module => {
            module.rooms.forEach(room => {
                room.lessons.forEach(lesson => {
                    if (this.userProgress.completedLessons.includes(lesson.id)) {
                        recentLessons.push({ lesson, module, room });
                    }
                });
            });
        });

        return recentLessons.slice(-limit).reverse();
    }

    checkForAchievements() {
        const newAchievements = [];

        // First lesson achievement
        if (this.userProgress.completedLessons.length >= 1 && !this.userProgress.achievements.includes('first-lesson')) {
            newAchievements.push('first-lesson');
        }

        // Module completion achievement
        const completedModules = this.modules.filter(module => 
            this.getTotalLessonsInModule(module) === this.getCompletedLessonsInModule(module)
        );
        if (completedModules.length >= 1 && !this.userProgress.achievements.includes('module-complete')) {
            newAchievements.push('module-complete');
        }

        // Add new achievements
        newAchievements.forEach(achievementId => {
            if (!this.userProgress.achievements.includes(achievementId)) {
                this.userProgress.achievements.push(achievementId);
            }
        });
    }

    getAchievementById(id) {
        const achievements = {
            'first-lesson': { name: 'First Steps', description: 'Complete your first lesson', icon: '🎯' },
            'module-complete': { name: 'Module Master', description: 'Complete your first module', icon: '🏆' },
            'week-streak': { name: 'Consistent Learner', description: 'Maintain a 7-day streak', icon: '⚡' },
            'expert-level': { name: 'Security Expert', description: 'Reach Expert level', icon: '🔥' }
        };
        return achievements[id] || { name: 'Unknown', description: 'Mystery achievement', icon: '🏅' };
    }

    startPath(pathId) {
        const path = this.learningPaths.find(p => p.id === pathId);
        if (!path) return;

        // Add to current paths if not already there
        if (!this.userProgress.currentPaths.includes(pathId)) {
            this.userProgress.currentPaths.push(pathId);
        }

        // Find first module in path
        const firstModuleId = path.modules[0];
        const firstModule = this.modules.find(m => m.id === firstModuleId);

        if (firstModule) {
            this.openModule(firstModuleId);
        }

        this.saveProgress();
    }

    renderProgress() {
        const container = document.getElementById('progress-detail');
        if (!container) return;

        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.getNextLevel();

        container.innerHTML = `
            <div class="progress-overview">
                <div class="level-display">
                    <div class="level-icon" style="color: ${currentLevel.color}">${currentLevel.icon}</div>
                    <div class="level-info">
                        <h2>${currentLevel.name}</h2>
                        <div class="level-progress">
                            <div class="xp-bar">
                                <div class="xp-fill" style="width: ${nextLevel ? ((this.userProgress.currentXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100 : 100}%;"></div>
                            </div>
                            <div class="xp-text">
                                ${this.userProgress.currentXP} / ${nextLevel ? nextLevel.minXP : 'MAX'} XP
                            </div>
                        </div>
                    </div>
                </div>

                <div class="progress-stats">
                    <div class="stat-card">
                        <div class="stat-value">${this.userProgress.completedLessons.length}</div>
                        <div class="stat-label">Lessons Completed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.userProgress.achievements.length}</div>
                        <div class="stat-label">Achievements</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.userProgress.streakDays}</div>
                        <div class="stat-label">Day Streak</div>
                    </div>
                </div>
            </div>

            <div class="modules-progress">
                <h3>Module Progress</h3>
                <div class="modules-progress-list">
                    ${this.modules.map(module => `
                        <div class="module-progress-item">
                            <div class="module-progress-header">
                                <span class="module-name">${module.icon} ${module.name}</span>
                                <span class="module-percentage">${this.calculateModuleProgress(module.id)}%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${this.calculateModuleProgress(module.id)}%;"></div>
                            </div>
                            <div class="module-stats">
                                <span>${this.getCompletedLessonsInModule(module)}/${this.getTotalLessonsInModule(module)} lessons</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    saveProgress() {
        localStorage.setItem('orbit-progress', JSON.stringify(this.userProgress));
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new OrbitPlatform();
});

// Make app globally available for onclick handlers
window.app = app;

// --- AUTHENTICATION LOGIC ---
let isLoginMode = false; // Starts in Sign Up mode

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const title = document.getElementById('modal-title');
    const btn = document.getElementById('auth-submit-btn');
    const link = document.getElementById('toggle-link');
    const desc = document.getElementById('modal-desc');
    
    title.innerText = isLoginMode ? "Welcome Back" : "Join Orbit";
    btn.innerText = isLoginMode ? "Login" : "Send Verification Link";
    link.innerText = isLoginMode ? "Sign Up" : "Login";
    desc.style.display = isLoginMode ? "none" : "block";
}

async function handleAuth() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    if (isLoginMode) {
        // Log the user in
        const { data, error } = await orbitDB.auth.signInWithPassword({ email, password });
        if (error) alert("Login Error: " + error.message);
        else window.location.reload(); 
    } else {
        // Sign up and send the Gmail verification link
        const { data, error } = await orbitDB.auth.signUp({ email, password });
        if (error) alert("Signup Error: " + error.message);
        else alert("Success! Check your Gmail for the verification link.");
    }
}

// 1. LOGOUT: Clears the session and refreshes the page
async function handleLogout() {
    await orbitDB.auth.signOut();
    window.location.reload();
}

// 2. RESET PROGRESS: Wipes the XP and task list in the database
async function resetAllTasks() {
    if (!confirm("This will permanently wipe your XP and task progress. Proceed?")) return;

    try {
        const { error } = await orbitDB
            .from('profiles')
            .update({ completed_tasks: [], xp: 0 })
            .eq('id', currentUser.id);

        if (error) throw error;
        alert("Progress wiped. Starting fresh!");
        window.location.reload();
    } catch (err) {
        alert("Reset failed: " + err.message);
    }
}

// 3. DELETE ACCOUNT: Wipes the profile row and logs the user out
async function deleteAccount() {
    const confirmation = prompt("To confirm deletion, type your EMAIL address:");
    
    if (confirmation === currentUser.email) {
        // Delete the profile row from the database
        await orbitDB.from('profiles').delete().eq('id', currentUser.id);
        // Log them out
        await orbitDB.auth.signOut();
        alert("Your data has been erased. Goodbye, Explorer.");
        window.location.reload();
    } else {
        alert("Email mismatch. Deletion cancelled.");
    }
}
supabase.auth.onAuthStateChange((event, session) => {
  console.log("AUTH EVENT:", event);

  if (event === "SIGNED_IN") {
    window.location.replace(
      "https://aadimarwah.github.io/PBL_PROJECT/index.html"
    );
  }
});

