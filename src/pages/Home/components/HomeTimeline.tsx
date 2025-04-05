import React from 'react';
import { Typography, Timeline } from 'antd';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { HomeTimeline as HomeTimelineType } from '../../../types/types';
import { globalStyles } from '../../../styles/theme';
import * as Icons from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const SectionContainer = styled.div`
  padding: ${globalStyles.spacing.xl} 0;
  background: #fff;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${globalStyles.spacing.lg};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${globalStyles.spacing.xl};
`;

const SectionTitle = styled(Title)`
  margin-bottom: ${globalStyles.spacing.md} !important;
`;

const SectionDescription = styled(Paragraph)`
  font-size: 1.2em;
  color: ${globalStyles.colors.lightText};
  max-width: 600px;
  margin: 0 auto !important;
`;

const TimelineContainer = styled(motion.div)`
  margin-top: ${globalStyles.spacing.xl};
`;

const TimelineTitle = styled(Title)`
  margin-bottom: ${globalStyles.spacing.xs} !important;
`;

const TimelineDate = styled(Paragraph)`
  color: ${globalStyles.colors.lightText};
  margin-bottom: ${globalStyles.spacing.sm} !important;
`;

interface HomeTimelineProps {
  data: HomeTimelineType;
}

const HomeTimeline: React.FC<HomeTimelineProps> = ({ data }) => {
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <SectionContainer>
      <Content>
        <Header>
          <SectionTitle level={2}>{data.title}</SectionTitle>
          <SectionDescription>{data.description}</SectionDescription>
        </Header>

        <TimelineContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Timeline
            mode="alternate"
            items={data.timelineItems.map((item, index) => ({
              color: item.color || globalStyles.colors.primary,
              dot: item.icon && getIcon(item.icon),
              children: (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <TimelineTitle level={4}>{item.title}</TimelineTitle>
                  <TimelineDate>{item.date}</TimelineDate>
                  <Paragraph>{item.description}</Paragraph>
                </motion.div>
              ),
            }))}
          />
        </TimelineContainer>
      </Content>
    </SectionContainer>
  );
};

export default HomeTimeline; 