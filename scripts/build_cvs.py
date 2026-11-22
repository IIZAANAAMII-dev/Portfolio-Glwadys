#!/usr/bin/env python3
"""Create print-ready Glwadys CVs from the verified facts supplied in CV-FR.pdf.
Metrics are experience counts, not invented business outcomes.
"""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle

ROOT = Path(__file__).resolve().parents[1] / "public" / "cv"
ROOT.mkdir(parents=True, exist_ok=True)
INK = HexColor("#24242A")
WINE = HexColor("#9B495C")
BG = HexColor("#FAF8F6")
MUTED = HexColor("#62616A")
RULE = HexColor("#DDD8D4")
PORTFOLIO = "https://iizaanaamii-dev.github.io/Portfolio-Glwadys/fr/"
EMAIL = "glwadys.dalleau29@gmail.com"
W, H = A4

JOBS = [
    ("Responsable adjointe de magasin", "Le Comptoir de Mathilde", "OCT. 2024 - SEPT. 2026", [
        "Pilotage opérationnel du magasin et coordination de l'équipe.",
        "Merchandising, mise en valeur de l'offre et expérience client.",
        "Création de contenus digitaux pour la marque."]),
    ("Bénévole - Communication et événementiel", "Marseille Girls Club", "AVR. 2024 - AVR. 2025", [
        "Organisation d'événements et contribution aux partenariats.",
        "Création de contenus pour les réseaux sociaux et coordination."]),
    ("Conseillère de vente - Cosmétique", "Kiko Milano", "JUIN 2024 - AOÛT 2024", [
        "Conseil personnalisé et accompagnement de la clientèle.",
        "Présentation des collections et dynamisation de l'espace de vente."]),
    ("Responsable - Corner éphémère", "AGLAIA x Une à Une / Printemps", "AVR. 2024 - JUIN 2024", [
        "Gestion d'un corner de bijouterie et suivi des stocks.",
        "Suivi des ventes et création de contenus pour les réseaux sociaux."]),
    ("Responsable de magasin - Alternance", "Yuna Bijoux", "SEPT. 2022 - SEPT. 2023", [
        "Pilotage quotidien du magasin et organisation d'événements.",
        "Création de contenus visuels et communication digitale."]),
]

def label(c, text, x, y, size=9, font="Helvetica", color=INK):
    c.setFillColor(color)
    c.setFont(font, size)
    c.drawString(x, y, text)

def paragraph(c, text, x, top, width, font_size=8.7, leading=11.9, color=INK):
    style = ParagraphStyle("p", fontName="Helvetica", fontSize=font_size,
                           leading=leading, textColor=color)
    p = Paragraph(text, style)
    _, height = p.wrap(width, 1000)
    p.drawOn(c, x, top-height)
    return top-height

def line(c, x1, y, x2, color=RULE, thick=.7):
    c.setStrokeColor(color)
    c.setLineWidth(thick)
    c.line(x1,y,x2,y)

def make_premium():
    path = ROOT/"CV_Glwadys_Dalleau_Premium_2026.pdf"
    c = canvas.Canvas(str(path), pagesize=A4, pageCompression=1)
    c.setTitle("Glwadys Dalleau - CV Premium 2026")
    c.setAuthor("Glwadys Dalleau")
    c.setFillColor(BG);c.rect(0,0,W,H,stroke=0,fill=1)
    c.setFillColor(WINE);c.rect(0,H-7,W,7,fill=1,stroke=0)
    label(c,"CV / PROFIL PROFESSIONNEL  -  2026",41,797,8.5,"Helvetica-Bold",WINE)
    label(c,"GLWADYS",41,748,41,"Times-Roman")
    label(c,"DALLEAU",41,700,41,"Times-Roman")
    label(c,"COMMERCE  /  COMMUNICATION  /  MANAGEMENT",41,674,9,"Helvetica-Bold",WINE)
    c.setFillColor(HexColor("#EFE8E7"));c.roundRect(447,694,104,114,9,stroke=0,fill=1)
    label(c,"GD",463,728,43,"Times-Roman",WINE)
    line(c,41,655,554)
    label(c,"VANNES, FRANCE",41,639,8,"Helvetica-Bold",MUTED)
    label(c,"06 21 97 12 50",173,639,8.3)
    label(c,EMAIL,287,639,8.3)
    c.linkURL("mailto:"+EMAIL,(286,632,554,649),relative=0)
    label(c,"PORTFOLIO",41,617,8.4,"Helvetica-Bold",WINE)
    label(c,"iizaanaamii-dev.github.io/Portfolio-Glwadys/fr/",159,617,8.3)
    c.linkURL(PORTFOLIO,(155,611,554,632),relative=0)
    line(c,41,602,554)
    for i,(value,sub) in enumerate([
        ("24 MOIS","DE RESPONSABILITÉ ADJOINTE"),
        ("5","EXPÉRIENCES PROFESSIONNELLES"),
        ("3","UNIVERS DE VENTE")]):
        x=41+i*171
        if i:line(c,x-12,572,x-12,RULE,.8)
        label(c,value,x,576,19,"Times-Roman",WINE)
        label(c,sub,x,562,7.1,"Helvetica-Bold",MUTED)
    c.setFillColor(WINE);c.roundRect(41,509,5,39,2,fill=1,stroke=0)
    paragraph(c,"Professionnelle du commerce et de la communication, avec une expérience concrète en gestion de boutique, merchandising, conseil client et création de contenus. Un parcours entre l'opérationnel, l'événementiel et l'image de marque.",53,545,495,9.1,12.1,MUTED)
    line(c,383,53,383)
    c.setStrokeColor(RULE);c.line(383,52,383,490)
    def sec(t,x,y,width):
        label(c,t,x,y,10,"Helvetica-Bold")
        line(c,x,y-8,x+30,WINE,1.8)
        line(c,x+38,y-8,x+width)
        return y-23
    x,y,width=41,483,331
    y=sec("EXPÉRIENCE PROFESSIONNELLE",x,y,width)
    for idx,(role,company,dates,bullets) in enumerate(JOBS):
        if idx:line(c,x,y+5,x+width);y-=7
        label(c,role,x,y,9,"Helvetica-Bold")
        y-=14
        label(c,company,x,y,8.3,"Helvetica",MUTED)
        c.setFillColor(WINE);c.setFont("Helvetica-Bold",6.55)
        c.drawRightString(x+width,y,dates)
        y-=10
        for bullet in bullets:
            c.setFillColor(WINE);c.circle(x+2,y-3,1.3,fill=1,stroke=0)
            y=paragraph(c,bullet,x+10,y,width-12,7.8,10.4,INK)-1.3
        y-=8
    sx,sw,side=395,157,483
    side=sec("COMPÉTENCES",sx,side,sw)
    for item in ["Gestion et coordination de boutique","Merchandising et stocks","Expérience client","Création de contenus digitaux","Communication / réseaux sociaux","Événementiel et partenariats"]:
        side=paragraph(c,"&#8226; "+item,sx,side,sw,8.0,11.1,MUTED)-5
    side-=10;side=sec("FORMATION",sx,side,sw)
    side=paragraph(c,"<b>Bachelor</b><br/>Commerce, marketing et négociation",sx,side,sw,8.1,11.3)-7
    side=paragraph(c,"IPAC Bachelor Factory",sx,side,sw,7.6,11,MUTED)-13
    side=paragraph(c,"<b>Certificat Inside LVMH</b><br/>Creation &amp; Branding, Retail &amp; Customer Experience",sx,side,sw,8.0,11.3)-17
    side=sec("LANGUES",sx,side,sw)
    side=paragraph(c,"Français : langue maternelle<br/>Anglais : B2",sx,side,sw,8.2,14)-11
    side=sec("QUALITÉS",sx,side,sw)
    side=paragraph(c,"Dynamisme<br/>Créativité<br/>Adaptabilité",sx,side,sw,8.2,13)
    if min(y,side)<58:raise RuntimeError("Premium CV overflow")
    line(c,41,43,554)
    label(c,"GLWADYS DALLEAU   /   CV 2026",41,28,7.5,"Helvetica-Bold",MUTED)
    label(c,"PORTFOLIO : EN LIGNE / FR",392,28,7.5,"Helvetica-Bold",WINE)
    c.linkURL(PORTFOLIO,(378,17,554,40),relative=0)
    c.save()
    print(path.name,"bottom",round(y),round(side))

def make_ats(kind):
    c = canvas.Canvas(str(ROOT/("CV_Glwadys_Dalleau_"+kind+"_ATS.pdf")),pagesize=A4,pageCompression=1)
    c.setTitle("Glwadys Dalleau - CV "+kind+" ATS")
    c.setFillColor(BG);c.rect(0,0,W,H,stroke=0,fill=1)
    x,full=48,498
    label(c,"GLWADYS DALLEAU",x,790,25,"Times-Roman")
    title=("CHARGÉE DE COMMUNICATION - MARKETING" if kind=="Communication" else "RESPONSABLE ADJOINTE - RETAIL & MANAGEMENT")
    label(c,title,x,765,10,"Helvetica-Bold",WINE)
    line(c,x,755,x+full,WINE,1.0)
    label(c,"Vannes, France  |  06 21 97 12 50  |  "+EMAIL,x,739,8.6,"Helvetica",MUTED)
    label(c,"Portfolio : iizaanaamii-dev.github.io/Portfolio-Glwadys/fr/",x,725,8.6,"Helvetica",MUTED)
    c.linkURL(PORTFOLIO,(x,721,x+full,740),relative=0)
    y=702
    def section(label_text):
        nonlocal y
        label(c,label_text,x,y,9.6,"Helvetica-Bold",WINE)
        line(c,x,y-5,x+full)
        y-=22
    section("PROFIL PROFESSIONNEL")
    profile=("Professionnelle du commerce et de la communication, avec une pratique de la création de contenus, de l'organisation d'événements, des partenariats et de la valorisation de marque. Expérience terrain en bijouterie, cosmétique et épicerie fine." if kind=="Communication" else "Professionnelle du commerce, avec 24 mois en responsabilité adjointe au Comptoir de Mathilde. Gestion opérationnelle, coordination d'équipe, merchandising et conseil client. Expérience dans trois univers de vente : épicerie fine, bijouterie et cosmétique.")
    y=paragraph(c,profile,x,y+2,full,9,12)-15
    section("REPÈRES PROFESSIONNELS")
    y=paragraph(c,"24 mois de responsabilité adjointe  |  5 expériences présentées  |  3 univers de vente",x,y+1,full,8.7,11)-14
    section("EXPÉRIENCE PROFESSIONNELLE")
    for role,company,dates,bullets in JOBS:
        y=paragraph(c,"<b>"+role+" - "+company+"</b>",x,y+2,full,9.4,12)-1
        y=paragraph(c,dates,x,y+2,full,8,10,WINE)-4
        for b in bullets[:2]:
            y=paragraph(c,"&#8226; "+b,x+13,y+2,full-13,8.6,11)-2
        y-=8
    section("COMPÉTENCES")
    skills=("Communication digitale ; réseaux sociaux ; création de contenus visuels ; événementiel ; partenariats ; relation client ; merchandising ; coordination d'équipe" if kind=="Communication" else "Gestion de boutique ; coordination d'équipe ; merchandising ; stocks ; vente conseil ; expérience client ; événementiel ; communication digitale")
    y=paragraph(c,skills,x,y+1,full,8.7,11)-10
    section("FORMATION")
    y=paragraph(c,"Bachelor Commerce, Marketing et Négociation - IPAC Bachelor Factory<br/>Certificat Inside LVMH - Creation &amp; Branding, Retail &amp; Customer Experience",x,y+2,full,8.6,12)-10
    section("LANGUES")
    y=paragraph(c,"Français : langue maternelle   |   Anglais : niveau B2",x,y+2,full,8.6,11)
    if y<48:raise RuntimeError("ATS CV overflow: "+str(y))
    c.save()
    print(kind,"ATS bottom",round(y))

if __name__=="__main__":
    make_premium()
    make_ats("Communication")
    make_ats("Retail")
