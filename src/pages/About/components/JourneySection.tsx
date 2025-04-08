import React from 'react';
import { Typography, Timeline } from 'antd';
import styled from '@emotion/styled';
import { AboutJourney } from '../../../types/types';
import { globalStyles } from '../../../styles/theme';
import AboutSection from './AboutSection';

const {Paragraph } = Typography;

interface JourneySectionProps {
  data: AboutJourney;
  delay?: number;
}

const TimelineLabel = styled.div`
  padding: ${globalStyles.spacing.xs} 0;
`;

const TimelineContent = styled.div`
  padding: ${globalStyles.spacing.sm} 0;
`;

const JourneySection: React.FC<JourneySectionProps> = ({ data, delay = 0 }) => {
  const { journey } = data;

  return (
    <AboutSection title={data.title} delay={delay}>
        {journey.description.map(
            (desc, index) => (
                <Paragraph key={index} style={{ marginTop: globalStyles.spacing.sm }}>
                {desc}
                </Paragraph>
            )
        )}

      {journey.milestones && journey.milestones.length > 0 && (
        <Timeline mode="left" style={{ marginTop: globalStyles.spacing.lg }}>
          {journey.milestones.map((milestone, index) => (
            <Timeline.Item key={index} label={
              <TimelineLabel>
                <Typography.Title level={5}>
                  {milestone.year}
                </Typography.Title>
              </TimelineLabel>
            }>
              <TimelineContent>
                <Typography.Title level={5}>
                  {milestone.title}
                </Typography.Title>
                <Paragraph>{milestone.description}</Paragraph>
              </TimelineContent>
            </Timeline.Item>
          ))}
        </Timeline>
      )}
    </AboutSection>
  );
};

export default JourneySection;
