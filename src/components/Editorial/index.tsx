import styled from '@emotion/styled';
import { themeVars } from '../../theme';

export const GardenSection = styled.section`
  width: min(100%, 1200px);
  min-width: 0;
  margin: 0 auto;
  padding: clamp(40px, 6vw, 80px) clamp(20px, 4vw, 56px);
  border-top: 1px solid ${themeVars.colors.border};
  overflow-wrap: anywhere;
`;

export const SectionHeading = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  align-items: end;
  margin-bottom: clamp(28px, 4vw, 48px);

  h2 {
    font-family: ${themeVars.typography.fontFamilyHeading};
    font-size: clamp(28px, 3vw, 38px);
    font-weight: 400;
    line-height: 1.4;
    margin: 0;
  }

  p { margin: 0; color: ${themeVars.colors.lightText}; line-height: 1.9; }
  @media (max-width: 640px) { grid-template-columns: minmax(0, 1fr); gap: 12px; }
`;

export const Eyebrow = styled.p`
  margin: 0 0 16px;
  color: ${themeVars.colors.primary};
  font-size: 11px;
  letter-spacing: 0.2em;
  line-height: 1.8;
`;

export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: 28px 40px;
  > * { min-width: 0; }
`;

export const EditorialTitle = styled.h1`
  text-wrap: balance;
  font-family: ${themeVars.typography.fontFamilyHeading};
  font-size: clamp(32px, 4.2vw, 54px);
  font-weight: 400;
  line-height: 1.4;
  margin: 0 0 20px;
  color: ${themeVars.colors.text};
`;
