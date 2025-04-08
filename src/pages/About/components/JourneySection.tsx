import React from 'react';
import { Typography, Space, Timeline } from 'antd';
import styled from '@emotion/styled';
import { AboutJourney } from '../../../types/types';
import { globalStyles } from '../../../styles/theme';
import AboutSection from './AboutSection';

const { Text, Paragraph } = Typography;

interface JourneySectionProps {
  data: AboutJourney;
  delay?: number;
}

const JourneySection: React.FC<JourneySectionProps> = ({ data, delay = 0 }) => {
  const { journey } = data;
  
  return (
    <AboutSection title={data.title} delay={delay}>
      <Paragraph>
        {journey.description}
      </Paragraph>

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