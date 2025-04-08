import React, { useState } from 'react';
import { Card, Space, Modal, Typography } from 'antd';
import styled from '@emotion/styled';
import { globalStyles } from '../../../styles/theme';
import * as Icons from '@ant-design/icons';

const { Link } = Typography;

export interface ContactItemProps {
  type: string;
  icon: string;
  value: string;
  link?: string;
  isQrCode?: boolean;
  qrCodeUrl?: string;
}

const ContactCard = styled(Card)`
  margin-top: ${globalStyles.spacing.xl};
  box-shadow: ${globalStyles.shadows.small};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${globalStyles.shadows.medium};
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${globalStyles.spacing.md};
  padding: ${globalStyles.spacing.md} 0;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${globalStyles.colors.primary};
  }

  .anticon {
    font-size: 24px;
  }
`;

const QRCodeImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
`;

const ContactSection: React.FC<{ items: ContactItemProps[] }> = ({ items }) => {
  const [qrCodeModalVisible, setQrCodeModalVisible] = useState(false);
  const [currentQrCode, setCurrentQrCode] = useState<string>('');
  const [currentQrCodeTitle, setCurrentQrCodeTitle] = useState<string>('');

  const handleQrCodeClick = (item: ContactItemProps) => {
    if (item.isQrCode && item.qrCodeUrl) {
      setCurrentQrCode(item.qrCodeUrl);
      setCurrentQrCodeTitle(`${item.type}二维码`);
      setQrCodeModalVisible(true);
    }
  };

  // 动态获取图标组件
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <>
      <ContactCard title="联系方式">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {items.map((item, index) => (
            item.link ? (
              <Link key={index} href={item.link} target="_blank">
                <ContactItem>
                  {getIcon(item.icon)}
                  <span>{item.value}</span>
                </ContactItem>
              </Link>
            ) : (
              <ContactItem 
                key={index} 
                onClick={() => item.isQrCode && handleQrCodeClick(item)}
              >
                {getIcon(item.icon)}
                <span>{item.value}</span>
              </ContactItem>
            )
          ))}
        </Space>
      </ContactCard>

      <Modal
        title={currentQrCodeTitle}
        open={qrCodeModalVisible}
        onCancel={() => setQrCodeModalVisible(false)}
        footer={null}
      >
        <QRCodeImage
          src={currentQrCode}
          alt={currentQrCodeTitle}
          loading="lazy"
        />
      </Modal>
    </>
  );
};

export default ContactSection; 