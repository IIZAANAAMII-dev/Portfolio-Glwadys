import type { Content } from '@/content';
import type { Locale } from '@/content/locales';
import { ProjectFeature } from './ProjectFeature';
import { WorkJourneyBridge } from './WorkJourneyBridge';

export function ActWork({ content, locale }: { content: Content; locale: Locale }) {
  return (
    <div aria-labelledby="work-title">
      <h2 id="work-title" className="visually-hidden">{content.work.heading}</h2>
      {content.work.projects.map((project, index) => (
        <ProjectFeature project={project} content={content} locale={locale} index={index} key={project.id} />
      ))}
      <WorkJourneyBridge content={content} locale={locale} />
    </div>
  );
}
