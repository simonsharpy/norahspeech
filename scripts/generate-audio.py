#!/usr/bin/env python3
"""
Generate pre-recorded audio files for Norah Speech vocabulary using edge-tts.

Usage:
    pip install edge-tts
    python scripts/generate-audio.py

This generates mp3 files in public/audio/{en,fr}/ for every vocabulary item.
Uses Microsoft Edge neural TTS voices (free, no API key needed).

Voices can be customized below. To list all available voices:
    edge-tts --list-voices
"""

import asyncio
import os
import edge_tts

# ── Vocabulary (must match src/data/vocabulary.ts) ───────────────────────────

VOCABULARY = {
    # Social
    "yes":          {"en": "yes",          "fr": "oui"},
    "no":           {"en": "no",           "fr": "non"},
    "hi":           {"en": "hi",           "fr": "salut"},
    "bye":          {"en": "bye",          "fr": "au revoir"},
    "please":       {"en": "please",       "fr": "s'il te plaît"},
    "thank_you":    {"en": "thank you",    "fr": "merci"},
    "help":         {"en": "help",         "fr": "aide"},
    "sorry":        {"en": "sorry",        "fr": "pardon"},
    "love":         {"en": "love",         "fr": "amour"},
    "good_morning": {"en": "good morning", "fr": "bonjour"},
    "good_night":   {"en": "good night",   "fr": "bonne nuit"},

    # People
    "mom":          {"en": "mom",          "fr": "maman"},
    "dad":          {"en": "dad",          "fr": "papa"},
    "me":           {"en": "me",           "fr": "moi"},
    "you":          {"en": "you",          "fr": "toi"},
    "brother":      {"en": "brother",      "fr": "frère"},
    "sister":       {"en": "sister",       "fr": "sœur"},
    "friend":       {"en": "friend",       "fr": "ami"},
    "teacher":      {"en": "teacher",      "fr": "enseignant"},
    "baby":         {"en": "baby",         "fr": "bébé"},
    "grandma":      {"en": "grandma",      "fr": "mamie"},
    "grandpa":      {"en": "grandpa",      "fr": "papi"},

    # Actions
    "want":         {"en": "want",         "fr": "vouloir"},
    "go":           {"en": "go",           "fr": "aller"},
    "stop":         {"en": "stop",         "fr": "arrêter"},
    "more":         {"en": "more",         "fr": "encore"},
    "eat":          {"en": "eat",          "fr": "manger"},
    "drink":        {"en": "drink",        "fr": "boire"},
    "play":         {"en": "play",         "fr": "jouer"},
    "give":         {"en": "give",         "fr": "donner"},
    "make":         {"en": "make",         "fr": "faire"},
    "look":         {"en": "look",         "fr": "regarder"},
    "sleep":        {"en": "sleep",        "fr": "dormir"},
    "come":         {"en": "come",         "fr": "venir"},
    "wait":         {"en": "wait",         "fr": "attendre"},
    "open":         {"en": "open",         "fr": "ouvrir"},
    "close":        {"en": "close",        "fr": "fermer"},
    "read":         {"en": "read",         "fr": "lire"},
    "sing":         {"en": "sing",         "fr": "chanter"},
    "dance":        {"en": "dance",        "fr": "danser"},
    "hug":          {"en": "hug",          "fr": "câlin"},
    "wash":         {"en": "wash",         "fr": "laver"},

    # Feelings
    "happy":        {"en": "happy",        "fr": "content"},
    "sad":          {"en": "sad",          "fr": "triste"},
    "angry":        {"en": "angry",        "fr": "en colère"},
    "tired":        {"en": "tired",        "fr": "fatigué"},
    "scared":       {"en": "scared",       "fr": "peur"},
    "sick":         {"en": "sick",         "fr": "malade"},
    "hungry":       {"en": "hungry",       "fr": "faim"},
    "thirsty":      {"en": "thirsty",      "fr": "soif"},
    "excited":      {"en": "excited",      "fr": "excité"},
    "bored":        {"en": "bored",        "fr": "ennuyé"},
    "hurt":         {"en": "hurt",         "fr": "mal"},

    # Descriptors
    "big":          {"en": "big",          "fr": "grand"},
    "little":       {"en": "little",       "fr": "petit"},
    "hot":          {"en": "hot",          "fr": "chaud"},
    "cold":         {"en": "cold",         "fr": "froid"},
    "good":         {"en": "good",         "fr": "bon"},
    "bad":          {"en": "bad",          "fr": "mauvais"},
    "fast":         {"en": "fast",         "fr": "vite"},
    "slow":         {"en": "slow",         "fr": "lent"},
    "up":           {"en": "up",           "fr": "en haut"},
    "down":         {"en": "down",         "fr": "en bas"},
    "all_done":     {"en": "all done",     "fr": "fini"},
    "same":         {"en": "same",         "fr": "pareil"},
    "different":    {"en": "different",    "fr": "différent"},
    "new":          {"en": "new",          "fr": "nouveau"},

    # Questions
    "what":         {"en": "what",         "fr": "quoi"},
    "where":        {"en": "where",        "fr": "où"},
    "who":          {"en": "who",          "fr": "qui"},
    "when":         {"en": "when",         "fr": "quand"},
    "why":          {"en": "why",          "fr": "pourquoi"},
    "how":          {"en": "how",          "fr": "comment"},

    # Food
    "apple":        {"en": "apple",        "fr": "pomme"},
    "banana":       {"en": "banana",       "fr": "banane"},
    "cookie":       {"en": "cookie",       "fr": "biscuit"},
    "bread":        {"en": "bread",        "fr": "pain"},
    "cheese":       {"en": "cheese",       "fr": "fromage"},
    "water":        {"en": "water",        "fr": "eau"},
    "milk":         {"en": "milk",         "fr": "lait"},
    "juice":        {"en": "juice",        "fr": "jus"},
    "chicken":      {"en": "chicken",      "fr": "poulet"},
    "pasta":        {"en": "pasta",        "fr": "pâtes"},
    "rice":         {"en": "rice",         "fr": "riz"},
    "yogurt":       {"en": "yogurt",       "fr": "yaourt"},

    # Places
    "home":         {"en": "home",         "fr": "maison"},
    "school":       {"en": "school",       "fr": "école"},
    "park":         {"en": "park",         "fr": "parc"},
    "bathroom":     {"en": "bathroom",     "fr": "salle de bain"},
    "outside":      {"en": "outside",      "fr": "dehors"},
    "bed":          {"en": "bed",          "fr": "lit"},
    "car_place":    {"en": "car",          "fr": "voiture"},
    "store":        {"en": "store",        "fr": "magasin"},

    # Objects
    "book":         {"en": "book",         "fr": "livre"},
    "ball":         {"en": "ball",         "fr": "ballon"},
    "phone":        {"en": "phone",        "fr": "téléphone"},
    "tv":           {"en": "TV",           "fr": "télé"},
    "toy":          {"en": "toy",          "fr": "jouet"},
    "shoes":        {"en": "shoes",        "fr": "chaussures"},
    "hat":          {"en": "hat",          "fr": "chapeau"},
    "blanket":      {"en": "blanket",      "fr": "couverture"},

    # Body
    "head":         {"en": "head",         "fr": "tête"},
    "hand":         {"en": "hand",         "fr": "main"},
    "mouth":        {"en": "mouth",        "fr": "bouche"},
    "eyes":         {"en": "eyes",         "fr": "yeux"},
    "ears":         {"en": "ears",         "fr": "oreilles"},
    "tummy":        {"en": "tummy",        "fr": "ventre"},
    "feet":         {"en": "feet",         "fr": "pieds"},

    # Time
    "now":          {"en": "now",          "fr": "maintenant"},
    "later":        {"en": "later",        "fr": "plus tard"},
    "today":        {"en": "today",        "fr": "aujourd'hui"},
    "tomorrow":     {"en": "tomorrow",     "fr": "demain"},
    "morning":      {"en": "morning",      "fr": "matin"},
    "night":        {"en": "night",        "fr": "nuit"},
}

# ── Voice configuration ──────────────────────────────────────────────────────
# Warm, clear voices suitable for a child's AAC device.
# Change these to any edge-tts voice you prefer.
# Run `edge-tts --list-voices` to see all options.

VOICES = {
    "en": "en-US-JennyNeural",     # Warm, friendly adult female voice
    "fr": "fr-FR-DeniseNeural",    # Warm, natural adult female voice
}

# Slightly slower rate for clarity (AAC best practice)
RATE = "-10%"
PITCH = "+0Hz"

# ── Generation ───────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
OUTPUT_BASE = os.path.join(PROJECT_ROOT, "public", "audio")


async def generate_one(item_id: str, language: str, text: str) -> None:
    """Generate a single audio file."""
    voice = VOICES[language]
    output_dir = os.path.join(OUTPUT_BASE, language)
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"{item_id}.mp3")

    communicate = edge_tts.Communicate(text, voice, rate=RATE, pitch=PITCH)
    await communicate.save(output_path)

    size_kb = os.path.getsize(output_path) / 1024
    print(f"  ✓ {output_path} ({size_kb:.1f} KB)")


async def main() -> None:
    print(f"Generating audio for {len(VOCABULARY)} words × 2 languages...\n")

    tasks = []
    for item_id, labels in VOCABULARY.items():
        for lang in ["en", "fr"]:
            text = labels[lang]
            tasks.append(generate_one(item_id, lang, text))

    await asyncio.gather(*tasks)

    # Calculate total size
    total_size = 0
    file_count = 0
    for lang in ["en", "fr"]:
        lang_dir = os.path.join(OUTPUT_BASE, lang)
        if os.path.exists(lang_dir):
            for f in os.listdir(lang_dir):
                if f.endswith(".mp3"):
                    total_size += os.path.getsize(os.path.join(lang_dir, f))
                    file_count += 1

    print(f"\n✅ Done! Generated {file_count} audio files ({total_size / 1024:.0f} KB total)")


if __name__ == "__main__":
    asyncio.run(main())
