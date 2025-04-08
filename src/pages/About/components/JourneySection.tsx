import React from 'react';
import { Typography, Timeline } from 'antd';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { AboutJourney } from '../../../types/types';
import { globalStyles } from '../../../styles/theme';
import AboutSection from './AboutSection';

const { Paragraph } = Typography;

interface JourneySectionProps {
  data: AboutJourney;
  delay?: number;
}

const TimelineContainer = styled(motion.div)`
  margin-top: ${globalStyles.spacing.lg};
`;

const TimelineTitle = styled(Typography.Title)`
  margin-bottom: ${globalStyles.spacing.xs} !important;
`;

const TimelineDate = styled(Paragraph)`
  color: ${globalStyles.colors.lightText};
  margin-bottom: ${globalStyles.spacing.sm} !important;
`;

const JourneySection: React.FC<JourneySectionProps> = ({ data, delay = 0 }) => {
  const { journey } = data;

  return (
    <AboutSection title={data.title} delay={delay}>
      {journey.description.map((desc, index) => (
        <Paragraph key={index} style={{ marginTop: globalStyles.spacing.sm }}>
          {desc}
        </Paragraph>
      ))}

      {journey.milestones && journey.milestones.length > 0 && (
        <TimelineContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Timeline 
            mode="alternate"
            items={journey.milestones.map((milestone, index) => ({
              children: (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TimelineTitle level={4}>{milestone.title}</TimelineTitle>
                  <TimelineDate>{milestone.year}</TimelineDate>
                  <Paragraph>{milestone.description}</Paragraph>
                </motion.div>
              ),
            }))}
          />
        </TimelineContainer>
      )}
    </AboutSection>
  );
};

export default JourneySection;
