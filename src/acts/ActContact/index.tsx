'use client';

import { useEffect, useRef, useState } from 'react';

import type { Content } from '@/content';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { EASE, MQ, SCRUB } from '@/lib/motion';
import { emitContact, requestChapter } from '@/lib/scrollControl';

import styles from './ActContact.module.css';

interface Props {
  content: Content;
}

/**
 * ACT 09 — Back cover.
 *
 * The manifesto sheet is the page Expertise physically hands over (its
 * geometry and timeline are unchanged). The contact sheet is the last page of
 * the film: a couture back cover. One masthead, one printed house label that
 * IS the email CTA, one colophon. The only gesture is the label being laid
 * and pressed onto the page while the masthead rises through its masks —
 * scrubbed, so reverse scroll is deterministic and the final scroll position
 * always shows the complete composition.
 */
export function ActContact({ content }: Props) {
  const root = useRef<HTMLElement>(null);
  const manifestoSection = useRef<HTMLElement>(null);
  const contactSection = useRef<HTMLElement>(null);
  const masthead = useRef<HTMLHeadingElement>(null);
  const familyName = useRef<HTMLSpanElement>(null);
  const copyTimer = useRef(0);
  const [copied, setCopied] = useState(false);
  const { contact } = content;

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  /* The woven label is a mailto link, and many visitors have no mail client:
     the address must be one click away from their clipboard. */
  const copyEmail = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(contact.email);
      ok = true;
    } catch {
      // Insecure context or denied permission: the legacy path still works.
      const field = document.createElement('textarea');
      field.value = contact.email;
      field.setAttribute('readonly', '');
      field.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.append(field);
      field.select();
      ok = document.execCommand('copy');
      field.remove();
    }
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 2400);
  };

  /* Fit the surname to the exact measure of the sheet. Width is linear in
     font-size, so one measurement gives the exact size; re-run on resize and
     once Bodoni has loaded. offsetWidth ignores GSAP transforms. */
  useEffect(() => {
    const head = masthead.current;
    const name = familyName.current;
    const measure = name?.parentElement;
    if (!head || !name || !measure) return;
    let raf = 0;
    let cancelled = false;

    const fit = () => {
      raf = 0;
      const natural = name.offsetWidth;
      const available = measure.clientWidth;
      const size = parseFloat(getComputedStyle(name).fontSize);
      if (!natural || !available || !size) return;
      const next = Math.floor(size * (available / natural) * 0.995 * 10) / 10;
      head.style.setProperty('--family-fit', `${next}px`);
    };
    const schedule = () => {
      if (!raf && !cancelled) raf = requestAnimationFrame(fit);
    };

    const observer = new ResizeObserver(schedule);
    observer.observe(measure);
    document.fonts?.ready.then(schedule).catch(() => undefined);
    schedule();

    return () => {
      cancelled = true;
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useGSAP(
    () => {
      const rootEl = root.current;
      const manifestoEl = manifestoSection.current;
      const contactEl = contactSection.current;
      if (!rootEl || !manifestoEl || !contactEl) return;
      const q = gsap.utils.selector(rootEl);
      const manifestoPage = q<HTMLElement>('[data-manifesto-page]')[0];
      const manifestoFold = q<HTMLElement>('[data-manifesto-fold]')[0];
      const lastPage = q<HTMLElement>('[data-contact-page]')[0];
      const label = q<HTMLElement>('[data-contact-label]')[0];
      const labelShadow = q<HTMLElement>('[data-contact-label-shadow]')[0];
      if (!manifestoPage || !manifestoFold || !lastPage || !label || !labelShadow) return;
      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: MQ.desktop, isMobile: MQ.mobile, isReduced: MQ.reduced },
        (context) => {
          const { isReduced, isMobile } = context.conditions as {
            isReduced: boolean;
            isMobile: boolean;
          };

          ScrollTrigger.create({
            trigger: contactEl,
            start: 'top 52%',
            end: 'bottom 48%',
            onToggle: (self) => emitContact(self.isActive),
          });

          if (isReduced) return;

          /* ---------- Manifesto: the page handed over by Expertise ----------
             Expertise's last pinned frame prints this exact sheet (title set,
             rule drawn, note written, corner folded) and stops painting at
             its pin end, where this sticky page sits beneath it. So the page
             starts complete, in that state; only what follows the seam moves:
             the corner settles flat, the copy drifts, the sheet is set aside
             as the back cover arrives. Scrubbed from the seam: reversible. */
          gsap.set(manifestoFold, { scale: 1, transformOrigin: 'right top' });

          const manifestoTl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: manifestoEl,
              start: 'top top',
              end: 'bottom top',
              scrub: SCRUB.narrative,
            },
          });

          manifestoTl
            .to(manifestoFold, { scale: 0, duration: 0.22 }, 0.04)
            .to(q<HTMLElement>('[data-manifesto-copy]'), { yPercent: -5, duration: 0.4 }, 0.3)
            .to(
              manifestoPage,
              { scale: 0.97, yPercent: -1.8, rotation: -0.35, autoAlpha: 0.82, duration: 0.28 },
              0.66,
            );

          /* ---------- Back cover: the closing reveal ----------
             Scrubbed from the moment the sheet slides over the manifesto until
             it is fully seated. Copy and label only ever animate opacity (never
             visibility) so keyboard focus can still reach the mailto link; a
             focused link scrolls into view, which completes the reveal. */
          const contactTl = gsap.timeline({
            defaults: { ease: EASE.scrub },
            scrollTrigger: {
              trigger: contactEl,
              start: isMobile ? 'top 92%' : 'top 88%',
              end: isMobile ? 'top 22%' : 'top 6%',
              scrub: SCRUB.narrative,
            },
          });

          contactTl
            // The sheet is laid down, settling from a slight angle.
            .fromTo(
              lastPage,
              { rotation: isMobile ? 0.6 : 0.9, transformOrigin: '0% 100%' },
              { rotation: 0, duration: 0.42 },
              0,
            )
            .fromTo(
              q<HTMLElement>('[data-contact-name]'),
              { yPercent: 108 },
              { yPercent: 0, duration: 0.36, stagger: 0.1 },
              0.06,
            )
            .fromTo(
              q<HTMLElement>('[data-contact-rule]'),
              { scaleX: 0 },
              { scaleX: 1, duration: 0.3, stagger: 0.04 },
              0.22,
            )
            .fromTo(
              q<HTMLElement>('[data-contact-copy]'),
              { y: 22, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.26, stagger: 0.035 },
              0.32,
            )
            // The house label: held above the page, then pressed flat.
            .fromTo(
              label,
              { opacity: 0, scale: 1.12, rotation: -6, yPercent: -18 },
              { opacity: 1, scale: 1, rotation: -1.4, yPercent: 0, duration: 0.4 },
              0.44,
            )
            .fromTo(
              labelShadow,
              { opacity: 0, scale: 1.18, yPercent: 14 },
              { opacity: 1, scale: 1, yPercent: 0, duration: 0.4 },
              0.44,
            )
            .fromTo(
              q<HTMLElement>('[data-contact-mark]'),
              { opacity: 0, scale: 0.6 },
              { opacity: 1, scale: 1, duration: 0.2, stagger: 0.03 },
              0.78,
            );

          /* The house label leans toward a fine pointer, its shadow at 40 %:
             the label reads as lifted off the page. Only x / y are written
             here; the scrubbed timeline owns opacity, scale, rotation and
             yPercent, and GSAP composes both into one transform. */
          if (isMobile || !window.matchMedia(MQ.finePointer).matches) return;
          const slot = label.parentElement;
          if (!slot) return;
          const follow = { duration: 0.7, ease: 'power3.out' };
          const lx = gsap.quickTo(label, 'x', follow);
          const ly = gsap.quickTo(label, 'y', follow);
          const sx = gsap.quickTo(labelShadow, 'x', follow);
          const sy = gsap.quickTo(labelShadow, 'y', follow);
          const reach = gsap.utils.clamp(-14, 14);
          const onMove = (event: PointerEvent) => {
            const box = slot.getBoundingClientRect();
            const dx = reach((event.clientX - box.left - box.width / 2) * 0.12);
            const dy = reach((event.clientY - box.top - box.height / 2) * 0.16);
            lx(dx); ly(dy); sx(dx * 0.4); sy(dy * 0.4);
          };
          const onLeave = () => { lx(0); ly(0); sx(0); sy(0); };
          slot.addEventListener('pointermove', onMove);
          slot.addEventListener('pointerleave', onLeave);
          return () => {
            slot.removeEventListener('pointermove', onMove);
            slot.removeEventListener('pointerleave', onLeave);
          };
        },
      );

      return () => {
        mm.revert();
        emitContact(false);
      };
    },
    { scope: root },
  );

  return (
    <footer ref={root} className={`act surface-wood ${styles.act}`}>
      <section ref={manifestoSection} className={styles.manifestoSection} aria-labelledby="manifesto-title">
        <div className={styles.manifestoStage}>
          <div className={`${styles.manifestoPage} paper-card`} data-manifesto-page>
            <span className={`${styles.manifestoEyebrow} micro`}>{content.manifesto.eyebrow}</span>
            <span className={`${styles.manifestoEdition} micro`}>Glwadys Dalleau / 2026</span>
            <span className={styles.manifestoFold} data-manifesto-fold aria-hidden="true" />

            <h2 id="manifesto-title" className={styles.manifestoTitle} data-manifesto-copy>
              <span className={`${styles.manifestoLine} line-mask`}>
                <span data-manifesto-line>{content.manifesto.lineOne}</span>
              </span>
              <span className={`${styles.manifestoLine} line-mask`}>
                <span data-manifesto-line>{content.manifesto.lineTwo}</span>
              </span>
            </h2>

            <span className={styles.manifestoRule} data-manifesto-rule aria-hidden="true" />
            <p className={`${styles.manifestoNote} hand-note`} data-manifesto-note>
              {content.manifesto.note}
            </p>
            <span className={`${styles.manifestoAxis} micro`}>{contact.axis}</span>
          </div>
        </div>
      </section>

      <section id="act-contact" ref={contactSection} className={styles.contactSection} aria-labelledby="contact-title">
        <div className={styles.stage}>
          <div className={`${styles.lastPage} paper-card`} data-contact-page>
            {/* Printer's trim marks: the page is an object, not a viewport.
                The fourth corner is the turned fold. */}
            <span className={`${styles.mark} ${styles.markTl}`} data-contact-mark aria-hidden="true" />
            <span className={`${styles.mark} ${styles.markBl}`} data-contact-mark aria-hidden="true" />
            <span className={`${styles.mark} ${styles.markBr}`} data-contact-mark aria-hidden="true" />

            <header className={`${styles.runningHead} micro`}>
              <span>09 / {contact.heading}</span>
              <span className={styles.runningEdition}>Portfolio 2026</span>
            </header>

            <h2 id="contact-title" ref={masthead} className={styles.masthead}>
              <span className={`${styles.given} line-mask`}>
                <span data-contact-name>Glwadys</span>
              </span>
              <span className={`${styles.family} line-mask`}>
                <span ref={familyName} data-contact-name>
                  Dalleau
                </span>
              </span>
            </h2>

            <div className={styles.rules} aria-hidden="true">
              <span className={styles.ruleThick} data-contact-rule />
              <span className={styles.ruleThin} data-contact-rule />
            </div>

            <div className={styles.body}>
              <p className={styles.statement} data-contact-copy>
                {contact.statement}
              </p>

              <div className={styles.labelSlot}>
                <span className={styles.labelShadow} data-contact-label-shadow aria-hidden="true" />
                <a
                  className={styles.label}
                  href={`mailto:${contact.email}`}
                  aria-label={`${contact.cta} — ${contact.email}`}
                  data-contact-label
                  data-cursor="view"
                >
                  <span className={`${styles.labelTop} micro`} aria-hidden="true">
                    <span>N° 09</span>
                    <span className={styles.labelCta}>{contact.cta}</span>
                    <span className={styles.labelArrow}>↗</span>
                  </span>
                  <span className={styles.labelEmail}>{contact.email}</span>
                  <span className={`${styles.labelFoot} micro`} aria-hidden="true">
                    <span>Glwadys Dalleau</span>
                    <span>{contact.axis}</span>
                  </span>
                </a>
                <button type="button" className={`${styles.copy} micro`} onClick={copyEmail}
                  data-copied={copied ? 'true' : undefined} data-contact-copy>
                  <span className={styles.copyMark} aria-hidden="true" />
                  {copied ? contact.copiedEmail : contact.copyEmail}
                </button>
                <span className="visually-hidden" role="status">{copied ? contact.copiedEmail : ''}</span>
              </div>

              <div className={styles.colophon} data-contact-copy>
                <p className={styles.availability}>{contact.availability}</p>
                <p className={styles.services}>{contact.services}</p>
                <p className={`${styles.languages} micro`}>
                  {contact.languages} <span aria-hidden="true">·</span> {contact.axis}
                </p>
                <a
                  className={`${styles.linkedin} micro`}
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  {contact.linkedinLabel} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <div className={`${styles.foot} micro`} data-contact-copy>
              <span className={styles.copyright}>{contact.copyright}</span>
              <a className={styles.backTop} href="#act-opening" onClick={(event) => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                if (requestChapter({ id: 'act-opening', label: content.nav.home, folio: '01 / 05' })) event.preventDefault();
              }}>
                {contact.backToTop} <span aria-hidden="true">↑</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
