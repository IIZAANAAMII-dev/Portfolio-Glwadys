#!/usr/bin/env python3
"""Génère un catalogue statique à partir d'API officielles ouvertes.
Remotive : attribution et lien d'origine conservés ; données retardées ~24h.
"""
import datetime as dt
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.request

OUT = Path("public/job-hub/jobs-feed.json")
TERMS = re.compile(r"communication|marketing|community|social media|content|brand|event|évén|retail|merchandis|boutique|store manager|sales assistant|sales associate|customer experience|partnership", re.I)
EXCLUDE = re.compile(r"software engineer|developer|accountant|data engineer", re.I)

class PlainText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
    def handle_data(self, value):
        self.parts.append(value)

def plain(value):
    parser = PlainText()
    parser.feed(str(value or ""))
    return re.sub(r"\s+", " ", html.unescape(" ".join(parser.parts))).strip()[:380]

def get_json(url):
    request = urllib.request.Request(url, headers={
        "User-Agent": "GlwadysCareerStudio/1.0 (public job index)",
        "Accept": "application/json",
    })
    with urllib.request.urlopen(request, timeout=22) as response:
        payload = response.read(6000000)
    return json.loads(payload)

def accept(item):
    title = str(item.get("title", ""))
    url = str(item.get("url", ""))
    return TERMS.search(title) and not EXCLUDE.search(title) and url.startswith("https://")

def fetch():
    found = []
    errors = []
    endpoints = [
        ("Remotive", "https://remotive.com/api/remote-jobs?category=marketing&limit=200", "jobs"),
        ("Arbeitnow", "https://www.arbeitnow.com/api/job-board-api", "data"),
    ]
    for source, url, key in endpoints:
        try:
            data = get_json(url)
            for item in data.get(key, []):
                if not accept(item):
                    continue
                if source == "Remotive":
                    entry = {
                        "id": "remotive-" + str(item.get("id", "")),
                        "title": str(item.get("title", "")),
                        "company": str(item.get("company_name", "")),
                        "location": str(item.get("candidate_required_location", "Remote")),
                        "description": plain(item.get("description", "")),
                        "date": item.get("publication_date"),
                        "remote": True,
                    }
                else:
                    created = item.get("created_at")
                    entry = {
                        "id": "arbeitnow-" + str(item.get("slug", "")),
                        "title": str(item.get("title", "")),
                        "company": str(item.get("company_name", "")),
                        "location": str(item.get("location", "Europe")),
                        "description": plain(item.get("description", "")),
                        "date": dt.datetime.fromtimestamp(created, tz=dt.timezone.utc).isoformat() if isinstance(created, (float, int)) else None,
                        "remote": bool(item.get("remote", False)),
                    }
                entry["url"] = item["url"]
                entry["source"] = source
                found.append(entry)
        except Exception as error:
            errors.append(source + ": " + type(error).__name__)
    jobs = []
    seen = set()
    for job in sorted(found, key=lambda i: i.get("date") or "", reverse=True):
        key = job["url"].split("?")[0]
        if key not in seen:
            seen.add(key)
            jobs.append(job)
    return {
        "generated_at": dt.datetime.now(dt.timezone.utc).isoformat(),
        "sources": ["Remotive", "Arbeitnow"],
        "source_errors": errors,
        "jobs": jobs[:250],
        "notice": "Les offres proviennent de sources publiques et peuvent évoluer. Remotive retarde ses annonces de 24 heures environ.",
    }

if __name__ == "__main__":
    OUT.parent.mkdir(parents=True, exist_ok=True)
    data = fetch()
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Job feed:", len(data["jobs"]), "jobs; errors:", data["source_errors"])
