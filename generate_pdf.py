import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(36, 805, "Skill Swap — Final Team Presentation Script & Defense Guide")
            self.drawRightString(559, 805, "Live Demo: http://localhost:3000/")
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.5)
            self.line(36, 800, 559, 800)
            
        # Footer
        footer_text = f"Page {self._pageNumber} of {page_count}"
        self.drawString(36, 30, "Team: Tulika • Varun • Tejas (2nd Last) • Ujjwal")
        self.drawRightString(559, 30, footer_text)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.5)
        self.line(36, 42, 559, 42)
        
        self.restoreState()


def build_pdf():
    pdf_filename = "Skill_Swap_Final_Presentation_Script.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=46,
        bottomMargin=50
    )

    styles = getSampleStyleSheet()
    
    # Custom Palette
    TEAL = colors.HexColor("#0D9488")
    TEAL_DARK = colors.HexColor("#0F766E")
    TEAL_LIGHT = colors.HexColor("#F0FDFA")
    SLATE = colors.HexColor("#0F172A")
    MUTED = colors.HexColor("#64748B")
    PURPLE = colors.HexColor("#7C3AED")
    BLUE = colors.HexColor("#2563EB")
    AMBER = colors.HexColor("#D97706")

    # Typography styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=colors.white,
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#CCFBF1"),
    )

    speaker_title_style = ParagraphStyle(
        'SpeakerTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=SLATE,
    )

    meta_badge_style = ParagraphStyle(
        'MetaBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=TEAL_DARK,
        alignment=2,
    )

    cue_style = ParagraphStyle(
        'CueStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#0284C7"),
    )

    dialogue_style = ParagraphStyle(
        'DialogueStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#1E293B"),
    )

    qa_q_style = ParagraphStyle(
        'QAQStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#854D0E"),
    )

    qa_a_style = ParagraphStyle(
        'QAAStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#713F12"),
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white,
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=SLATE,
    )

    story = []

    # 1. Header Banner Table
    banner_content = [
        [
            Paragraph("SKILL SWAP — FINAL PRESENTATION SCRIPT", title_style),
            Paragraph("HOST LINK:<br/><b>http://localhost:3000/</b><br/>MODE: 9 Screens Dock", ParagraphStyle('HRight', parent=subtitle_style, alignment=2))
        ],
        [
            Paragraph("Peer-to-Peer Learning Platform • 10–11 Minute Complete Team Script & Defense Sheet", subtitle_style),
            Paragraph("Status: Ready to Present", ParagraphStyle('HRightSub', parent=subtitle_style, alignment=2))
        ]
    ]
    banner_table = Table(banner_content, colWidths=[360, 163])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), TEAL),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 12),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('CORNERPAD', (0, 0), (-1, -1), 6),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 10))

    # 2. Executive Meta Bar Table
    meta_data = [
        [
            Paragraph("<b>TOTAL TIME</b><br/>10–11 Minutes", dialogue_style),
            Paragraph("<b>TEAM MEMBERS</b><br/>Tulika, Varun, Tejas, Ujjwal", dialogue_style),
            Paragraph("<b>TECH STACK</b><br/>React 19 • Node • Mongo • WebRTC", dialogue_style),
            Paragraph("<b>TEJAS POSITION</b><br/><font color='#0D9488'><b>2nd Last (Slot 3) ⭐</b></font>", dialogue_style),
        ]
    ]
    meta_table = Table(meta_data, colWidths=[110, 150, 153, 110])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#E2E8F0")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('PADDING', (0, 0), (-1, -1), 7),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # Helper function to create a speaker block
    def make_speaker_block(speaker_num, name, role, timing, cue_text, script_text, qa_q, qa_a, accent_color, is_tejas=False):
        header_text = f"<b>{speaker_num}. {name.upper()}</b> — {role}"
        if is_tejas:
            header_text += " <font color='#0D9488'>★ [YOUR PART - 2ND LAST]</font>"

        header_cell = [
            Paragraph(header_text, speaker_title_style),
            Paragraph(f"<b>{timing}</b>", meta_badge_style)
        ]
        
        cue_cell = Paragraph(f"<b>SCREEN CUE:</b> {cue_text}", cue_style)
        script_cell = Paragraph(script_text, dialogue_style)
        qa_cell = Paragraph(f"<b>Expected Judge Question:</b> {qa_q}<br/><b>Your 1-Line Defense:</b> {qa_a}", qa_q_style)

        card_data = [
            header_cell,
            [cue_cell, ''],
            [script_cell, ''],
            [qa_cell, '']
        ]

        card_table = Table(card_data, colWidths=[400, 123])
        card_table.setStyle(TableStyle([
            ('SPAN', (0, 1), (1, 1)),
            ('SPAN', (0, 2), (1, 2)),
            ('SPAN', (0, 3), (1, 3)),
            ('BACKGROUND', (0, 0), (1, 0), colors.HexColor("#F8FAFC")),
            ('LINELEFT', (0, 0), (0, -1), 4, accent_color),
            ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor("#F0F9FF")),
            ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor("#FEFCE8")),
            ('PADDING', (0, 0), (-1, 0), 6),
            ('PADDING', (0, 1), (-1, 1), 5),
            ('PADDING', (0, 2), (-1, 2), 8),
            ('PADDING', (0, 3), (-1, 3), 6),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        return card_table

    # --- SPEAKER 1: TULIKA ---
    tulika_script = (
        "\"Good morning respected teachers and fellow students. My name is <b>Tulika</b>, and along with my teammates "
        "<b>Varun, Tejas, and Ujjwal</b>, we are proud to present our project: <b>Skill Swap</b> — a peer-to-peer collaborative "
        "learning platform built for college students.<br/><br/>"
        "In college, whenever we want to pick up a new technical or creative skill — like React development, Figma UI/UX, or "
        "public speaking — we face two big problems:<br/>"
        "1. <b>Expensive recorded video courses</b> that cost thousands of rupees, where no instructor answers our personal doubts.<br/>"
        "2. <b>Watching YouTube tutorials alone</b>, without hands-on practice or individual mentorship.<br/><br/>"
        "But if you look around our campus, seniors and batchmates already possess these exact skills! One student is great at coding; "
        "another is great at design.<br/>"
        "<b>Skill Swap connects these students through a zero-cost barter credit economy.</b><br/><br/>"
        "On our platform, <b>knowledge is currency</b>. You do not need real money to learn. When you teach someone a skill you know, "
        "you earn <b>Credits</b>. You can then spend those credits to learn any skill you want from another student!<br/><br/>"
        "We built the frontend using <b>React.js, Vite, and modern CSS</b>, adopting a clean Academic Teal theme designed to feel "
        "approachable, human-made, and organized.<br/><br/>"
        "To explain how our backend securely manages user data, sessions, and credit balances, I now hand over to <b>Varun</b>.\""
    )
    story.append(make_speaker_block(
        1, "Tulika", "Opening, College Problem & Barter Vision", "0:00 – 2:30 (2.5 Mins)",
        "Show Screen 1 (Landing Page)",
        tulika_script,
        "Why React instead of HTML/JS?",
        "\"React's modular components allow us to reuse cards, navbars, and modals seamlessly while updating live state with zero page reloads.\"",
        PURPLE
    ))
    story.append(Spacer(1, 10))

    # --- SPEAKER 2: VARUN ---
    varun_script = (
        "\"Thank you, Tulika. Hello everyone, my name is <b>Varun</b>, and I will explain the <b>Backend Architecture, Database Design, "
        "and RESTful APIs</b> of Skill Swap.<br/><br/>"
        "Our backend runs on <b>Node.js using the Express.js framework</b>, connected to a <b>MongoDB database via Mongoose ODM</b>. "
        "We followed a clean MVC architecture to ensure modularity, high performance, and security.<br/><br/>"
        "We designed four core database schemas:<br/>"
        "1. <b>User Schema</b>: Stores student profiles, password hashes, current credit balances, and two distinct arrays: "
        "<code>skillsToTeach</code> and <code>skillsToLearn</code>.<br/>"
        "2. <b>Session Schema</b>: Tracks booking requests, status lifecycles (<em>requested, accepted, completed</em>), meeting durations, "
        "and WebRTC room IDs.<br/>"
        "3. <b>Feedback Schema</b>: Captures numerical ratings and evaluation criteria such as clarity, helpfulness, and punctuality.<br/>"
        "4. <b>Gamification Schema</b>: Stores unlocked badges, learning streaks, and community rankings.<br/><br/>"
        "For security, we implemented <b>JWT (JSON Web Tokens)</b> for stateless authentication and <b>bcrypt.js</b> to salt and hash all passwords.<br/><br/>"
        "Through our <b>Learner and Tutor Module APIs</b>, our server safely validates credit balances before confirming any booking, locking the "
        "amount in escrow until the session is completed so no double-spending can occur.<br/><br/>"
        "Now, to walk you through the actual live student experience and booking flow, I hand over to <b>Tejas</b>.\""
    )
    story.append(make_speaker_block(
        2, "Varun", "Backend Architecture, Database Schemas & APIs", "2:30 – 5:00 (2.5 Mins)",
        "Show Terminal / Health Check API or Architecture Flow",
        varun_script,
        "How do you prevent credit double-spending?",
        "\"Our API verifies credit balances before booking, locks the amount in escrow, and only releases it after session status becomes 'completed'.\"",
        BLUE
    ))
    
    # Page Break before Tejas and Ujjwal
    story.append(PageBreak())

    # --- SPEAKER 3: TEJAS ---
    tejas_script = (
        "\"Thank you, Varun! Hello everyone, I'm <b>Tejas</b>, and I will walk you through the <b>live student experience on Skill Swap</b>.<br/><br/>"
        "<em>(Click Screen 3: Student Dashboard)</em><br/>"
        "Once a student signs in, they land right here on their personalized <b>Student Dashboard</b>.<br/>"
        "At the top, you can see my profile with <b>250 welcome credits</b> ready to use. Below that, we have four clear stat cards:<br/>"
        "• My upcoming sessions,<br/>"
        "• Skills currently in progress,<br/>"
        "• Badges I’ve earned,<br/>"
        "• And how many fellow students I’ve helped so far!<br/><br/>"
        "Below that, the system presents <b>'Recommended for you'</b> tutor cards — such as Rohan Sharma for Web Development and Priya Singh for UI/UX Design — showing their star ratings and skills.<br/><br/>"
        "<em>(Click Screen 6: Book a Session Page)</em><br/>"
        "Now, booking a session with a tutor is completely frictionless. On the <b>Booking Screen</b>, a student can choose between:<br/>"
        "• A <b>1-on-1 private session</b>, which costs <b>1 credit</b>.<br/>"
        "• Or a <b>Group study session</b>, which costs only <b>0.5 credits</b> per person.<br/><br/>"
        "I simply pick a date on our interactive calendar — for example, October 14th — select an available time slot like 3:00 PM, and click <b>Confirm Booking</b>. The session is booked instantly without any back-and-forth emails.<br/><br/>"
        "<em>(Click Screen 9: Messages Page)</em><br/>"
        "Before the meeting begins, students can also coordinate directly inside our built-in <b>Messages screen</b>, where they can share notes, GitHub repositories, and clarify their doubts in advance.<br/><br/>"
        "Now, when it's time for the actual live session to start, how do students connect over real-time video without leaving the website? To explain our in-browser WebRTC video room and AI engine, here is <b>Ujjwal</b>.\""
    )
    story.append(make_speaker_block(
        3, "Tejas", "Live Student Journey, Dashboard, Booking & Credits", "5:00 – 7:30 (2.5 Mins)",
        "1. Click Screen 3 (Dashboard) → 2. Click Screen 6 (Book) → 3. Click Screen 9 (Messages)",
        tejas_script,
        "What happens if a student runs out of credits?",
        "\"They simply offer a 1-hour session to teach a skill they know, earn credits back from peers, and continue learning!\"",
        TEAL,
        is_tejas=True
    ))
    story.append(Spacer(1, 10))

    # --- SPEAKER 4: UJJWAL ---
    ujjwal_script = (
        "\"Thank you, Tejas. Hello everyone, I'm <b>Ujjwal</b>, and I will be explaining our <b>Real-Time WebRTC Video System, AI Skill Recommendation Engine, and Gamification</b>.<br/><br/>"
        "<em>(Click Screen 7: Video Room Page)</em><br/>"
        "Unlike traditional platforms that force students to switch to Zoom or Google Meet, Skill Swap features <b>native in-browser video calling powered by WebRTC</b>.<br/>"
        "WebRTC streams encrypted audio and video directly peer-to-peer between browsers with near-zero latency. Our Node.js server acts as the <b>Signaling Server</b>, negotiating SDP handshakes and ICE candidates.<br/>"
        "As you can see in Screen 7's theater mode, we have a running elapsed session timer, dual camera tiles for tutor and learner, floating call controls (mic, camera, screen share), and a live notes and chat sidebar.<br/><br/>"
        "<b>AI Skill Matching Engine:</b><br/>"
        "To intelligently match learners with the right tutors, we designed a Python microservice with <b>Scikit-learn</b>. It computes <b>cosine similarity</b> between a learner’s wanted skills and tutor profiles, ranking mentors by relevance, past ratings, and credibility.<br/><br/>"
        "<em>(Click Screen 8: Leaderboard Page)</em><br/>"
        "Finally, to sustain student motivation, our <b>Gamification Engine</b> rewards active participation with badges like <em>First Step, Helper, Consistent, and Explorer</em>.<br/>"
        "Whenever a session ends and feedback is submitted, the tutor's <b>AI Credibility Score</b> automatically recalculates based on weighted peer ratings.<br/><br/>"
        "In conclusion, Skill Swap is a complete, self-sustaining peer ecosystem that makes skill learning democratic, free, and accessible to every student.<br/><br/>"
        "Thank you so much for your time, and our team is now ready for any questions!\""
    )
    story.append(make_speaker_block(
        4, "Ujjwal", "WebRTC Video Room, AI Skill Matching & Conclusion", "7:30 – 10:00 (2.5 Mins)",
        "1. Click Screen 7 (Video Call) → 2. Click Screen 8 (Leaderboard)",
        ujjwal_script,
        "Why use WebRTC over Zoom links?",
        "\"WebRTC connects the two browsers directly with peer-to-peer encryption, eliminating third-party accounts and meeting link friction.\"",
        AMBER
    ))
    story.append(Spacer(1, 12))

    # 3. Master Q&A Table
    qa_rows = [
        [
            Paragraph("<b>Expected Judge Question</b>", table_header_style),
            Paragraph("<b>Speaker</b>", table_header_style),
            Paragraph("<b>Exact 1-Line Response</b>", table_header_style)
        ],
        [
            Paragraph("What happens if a student runs out of credits?", table_cell_style),
            Paragraph("<b>Tejas</b>", table_cell_style),
            Paragraph("They offer a 1-hour session to teach what they know, earn credits back from peers, and keep learning.", table_cell_style)
        ],
        [
            Paragraph("What if someone cancels a booking?", table_cell_style),
            Paragraph("<b>Tejas</b>", table_cell_style),
            Paragraph("The locked credit is refunded to the learner immediately, and the tutor's calendar slot reopens.", table_cell_style)
        ],
        [
            Paragraph("Why React instead of HTML/JS?", table_cell_style),
            Paragraph("<b>Tulika</b>", table_cell_style),
            Paragraph("React's modular components and hooks allow dynamic state updates without reloading the entire page.", table_cell_style)
        ],
        [
            Paragraph("How do you prevent credit double-spending?", table_cell_style),
            Paragraph("<b>Varun</b>", table_cell_style),
            Paragraph("Our API verifies balances beforehand, locks credits in escrow, and only releases upon 'completed' status.", table_cell_style)
        ],
        [
            Paragraph("How does AI compute credibility?", table_cell_style),
            Paragraph("<b>Ujjwal</b>", table_cell_style),
            Paragraph("It dynamically weights completed ratings and review criteria, recalculating after every session feedback.", table_cell_style)
        ]
    ]

    qa_table = Table(qa_rows, colWidths=[150, 70, 303])
    qa_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SLATE),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#F8FAFC")]),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    
    story.append(KeepTogether([
        Paragraph("<b>🛡️ MASTER TEAM Q&A DEFENSE CHEAT SHEET</b>", speaker_title_style),
        Spacer(1, 4),
        qa_table
    ]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated: {os.path.abspath(pdf_filename)}")

if __name__ == "__main__":
    build_pdf()
