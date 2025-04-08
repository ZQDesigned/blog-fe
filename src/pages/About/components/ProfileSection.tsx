import React from 'react';
import { Typography } from 'antd';
import styled from '@emotion/styled';
import { BookOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { AboutProfile } from '../../../types/types';
import { globalStyles } from '../../../styles/theme';
import AboutSection from './AboutSection';

const { Text, Paragraph } = Typography;

interface ProfileSectionProps {
  data: AboutProfile;
  delay?: number;
}

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  object-fit: cover;
  margin-bottom: ${globalStyles.spacing.md};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: ${globalStyles.shadows.medium};
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: ${globalStyles.spacing.md};
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    gap: ${globalStyles.spacing.xl};
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.sm};
  margin: ${globalStyles.spacing.sm} 0;
`;

const EducationItem = styled.div`
  margin-bottom: ${globalStyles.spacing.sm};
`;

const ProfileSection: React.FC<ProfileSectionProps> = ({ data, delay = 0 }) => {
  const { profile } = data;

  return (
    <AboutSection title={data.title} delay={delay}>
      {profile.avatar && (
        <ProfileHeader>
          <Avatar src={profile.avatar} />
          <ProfileInfo>
            <Paragraph>
              {profile.bio}
            </Paragraph>
          </ProfileInfo>
        </ProfileHeader>
      )}

      {!profile.avatar && (
        <Paragraph>
          {profile.bio}
        </Paragraph>
      )}

      <Typography.Title level={4}>教育背景</Typography.Title>
      {profile.education.map((edu, index) => (
        <EducationItem key={index}>
          <ContactInfo>
            <BookOutlined />
            <Text>
              {edu.school} - {edu.major} - {edu.degree} {edu.time && `(${edu.time})`}
            </Text>
          </ContactInfo>
        </EducationItem>
      ))}

      <ContactInfo>
        <EnvironmentOutlined />
        <Text>{profile.location}</Text>
      </ContactInfo>

      <Paragraph style={{ marginTop: globalStyles.spacing.sm }}>
        {profile.highlights.map((highlight, index) => (
          <React.Fragment key={index}>
            {highlight}<br />
          </React.Fragment>
        ))}
      </Paragraph>
    </AboutSection>
  );
};

export default ProfileSection;
